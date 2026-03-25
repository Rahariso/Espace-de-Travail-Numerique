import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PAGE_TITLES = {
  "/dashboard": "Tableau de bord",
  "/activites": "Activités",
  "/personnes": "Personnels",
  "/profil": "Profil",
};

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const title = PAGE_TITLES[location.pathname] || "MESUPRES";
  const initials = user?.nom
    ? user.nom.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <nav className="bg-white border-b border-slate-200 px-5 h-13 flex items-center justify-between sticky top-0 z-50 h-[52px]">
      {/* Titre de la page courante */}
      <h1 className="font-['Cinzel',serif] text-[#1a3a6b] text-base font-semibold">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        {/* Cloche notif */}
        <button className="relative w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M15 17h5l-1.405-1.405A2 2 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
        </button>

        {/* Pill utilisateur */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
          <div className="w-6 h-6 rounded-full bg-[#1a3a6b] flex items-center justify-center text-[10px] text-white font-bold">
            {initials}
          </div>
          <span className="text-xs font-semibold text-slate-700">{user?.nom || "Utilisateur"}</span>
        </div>
      </div>
    </nav>
  );
}