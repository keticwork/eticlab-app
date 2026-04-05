import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DAILY_LIMIT = 10;

export async function POST(request: Request) {
  const supabase = await createClient();

  // Vérifier la session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Non connecté" },
      { status: 401 }
    );
  }

  // Récupérer ou créer le profil
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    await supabase.from("profiles").insert({ id: user.id });
    profile = { ai_requests_today: 0, ai_last_request_date: null };
  }

  // Vérifier la limite quotidienne
  const today = new Date().toISOString().split("T")[0];
  let requestsToday = profile.ai_requests_today || 0;

  if (profile.ai_last_request_date !== today) {
    requestsToday = 0;
  }

  if (requestsToday >= DAILY_LIMIT) {
    return NextResponse.json(
      {
        error: "Limite quotidienne atteinte (10 questions/jour). Réinitialisation à minuit.",
        requests_remaining: 0,
      },
      { status: 429 }
    );
  }

  // Parser le body
  const { message, conversation_history } = await request.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json(
      { error: "Message requis" },
      { status: 400 }
    );
  }

  // Fetch les modules depuis Supabase pour le prompt système
  const { data: modules } = await supabase
    .from("modules")
    .select("code, nom, description, statut, tags, phases(nom)")
    .order("code");

  const modulesList = (modules || [])
    .map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (m: any) =>
        `- ${m.code} — ${m.nom} (${m.phases?.nom || "?"}) : ${m.description || ""} [${m.statut}]`
    )
    .join("\n");

  const systemPrompt = `Tu es le guide pédagogique d'EticLab, une plateforme de formation technique pour débutants en développement web.
Ton rôle : analyser le projet de l'utilisateur et lui recommander un parcours personnalisé parmi les modules disponibles.

Modules disponibles :
${modulesList}

Règles :
- Recommande entre 3 et 8 modules maximum
- Indique l'ordre logique d'apprentissage
- Si un concept nécessaire n'existe pas en module, signale-le avec exactement ce format : [MODULE_MANQUANT: nom du concept]
- Sois encourageant et pédagogique
- Réponds toujours en français
- Format de réponse : d'abord une analyse du projet, ensuite le parcours recommandé avec les modules dans l'ordre
- Quand tu cites un module, utilise TOUJOURS le format "CODE — Nom" (ex: "T-01 — Node.js", "C4-01 — Supabase")
- Ne cite jamais un code seul sans son nom`;

  // Construire les messages pour l'API
  const messages: { role: "user" | "assistant"; content: string }[] = [];

  if (conversation_history && Array.isArray(conversation_history)) {
    for (const msg of conversation_history) {
      messages.push({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      });
    }
  }

  messages.push({ role: "user", content: message });

  // Appel API Anthropic
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    });

    const assistantResponse =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Détecter les modules manquants
    const missingModules = [
      ...assistantResponse.matchAll(/\[MODULE_MANQUANT:\s*(.+?)\]/g),
    ].map((m) => m[1]);

    // Stocker les suggestions de modules manquants
    for (const moduleName of missingModules) {
      const { data: existing } = await supabase
        .from("ai_suggestions")
        .select("id, count")
        .eq("module_manquant", moduleName)
        .single();

      if (existing) {
        await supabase
          .from("ai_suggestions")
          .update({
            count: existing.count + 1,
            last_seen_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("ai_suggestions").insert({
          module_manquant: moduleName,
        });
      }
    }

    // Incrémenter le compteur
    await supabase
      .from("profiles")
      .update({
        ai_requests_today: requestsToday + 1,
        ai_last_request_date: today,
      })
      .eq("id", user.id);

    // Extraire les codes modules de la réponse et sauvegarder le projet
    const codeRegex = /(C\d+-\d+[a-z]?|T-\d+[a-z]?|T-A\d+[a-z]?|T-SEC\d+|T-LEG\d+|T-ORG\d+|T-GCLOUD\d+)/gi;
    const foundCodes = [...new Set(assistantResponse.match(codeRegex) || [])];

    if (foundCodes.length > 0 && conversation_history.length === 0) {
      // Premier message = nouveau projet
      const titre = message.split(/\s+/).slice(0, 5).join(" ");
      const parcours = foundCodes.map((code: string) => {
        const mod = (modules || []).find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (m: any) => m.code.toLowerCase() === code.toLowerCase()
        );
        return { code: code.toUpperCase(), nom: mod?.nom || code };
      });

      const { data: project } = await supabase
        .from("ai_projects")
        .insert({ user_id: user.id, titre, parcours })
        .select("id")
        .single();

      return NextResponse.json({
        response: assistantResponse,
        requests_remaining: DAILY_LIMIT - requestsToday - 1,
        project_id: project?.id,
        parcours,
      });
    }

    return NextResponse.json({
      response: assistantResponse,
      requests_remaining: DAILY_LIMIT - requestsToday - 1,
    });
  } catch (err) {
    console.error("Erreur API Anthropic:", err);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la réponse" },
      { status: 500 }
    );
  }
}
