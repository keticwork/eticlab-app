"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";

type Parcours = { code: string; nom: string };
type Project = {
  id: string;
  titre: string;
  parcours: Parcours[];
  created_at: string;
};

type ActiveProject = {
  id: string;
  titre: string;
  parcours: Parcours[];
};

export function ProjectSidebar() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [collapsed, setCollapsed] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) loadProjects();
    });

    // Charger le projet actif depuis localStorage
    const stored = localStorage.getItem("eticlab-active-project");
    if (stored) {
      try {
        const parsed: ActiveProject = JSON.parse(stored);
        setActiveId(parsed.id);
      } catch {}
    }
  }, []);

  const loadProjects = async () => {
    const { data } = await supabase
      .from("ai_projects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    setProjects(data || []);
  };

  const activateProject = (project: Project) => {
    const active: ActiveProject = {
      id: project.id,
      titre: project.titre,
      parcours: project.parcours,
    };
    localStorage.setItem("eticlab-active-project", JSON.stringify(active));
    setActiveId(project.id);
    window.dispatchEvent(new Event("eticlab-project-changed"));
  };

  const clearProject = () => {
    localStorage.removeItem("eticlab-active-project");
    setActiveId(null);
    window.dispatchEvent(new Event("eticlab-project-changed"));
  };

  if (!user) return null;

  return (
    <aside
      className="fixed left-0 z-30 border-r border-gray-200 bg-white transition-all duration-200"
      style={{ top: "57px", bottom: "48px", width: collapsed ? "48px" : "240px" }}
    >
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-10 w-full items-center justify-center border-b border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
      >
        {collapsed ? "→" : "←"}
      </button>

      {collapsed ? (
        /* Icône seule */
        <div className="flex flex-col items-center gap-2 pt-3">
          <span className="text-lg" title="Mes projets">📂</span>
        </div>
      ) : (
        /* Liste complète */
        <div className="flex h-[calc(100%-40px)] flex-col">
          <div className="border-b border-gray-100 px-3 py-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase">
              Mes parcours
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {projects.length === 0 ? (
              <p className="px-3 py-4 text-xs text-gray-400">
                Aucun parcours. Utilise le Guide IA pour en créer un.
              </p>
            ) : (
              <div className="flex flex-col gap-1 p-2">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() =>
                      activeId === project.id
                        ? clearProject()
                        : activateProject(project)
                    }
                    className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      activeId === project.id
                        ? "border border-[#1D9E75] bg-[#1D9E75]/10 text-[#1D9E75]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-medium truncate">{project.titre}</p>
                    <p className="mt-0.5 text-gray-400">
                      {project.parcours?.length || 0} modules
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
