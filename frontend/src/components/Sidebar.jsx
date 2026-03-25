import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Tableau de bord",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: "/activites",
    label: "Activités",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    to: "/personnes",
    label: "Personnels",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m0 0A4 4 0 1113 8a4 4 0 01-4 3.87z" />
      </svg>
    ),
  },
  {
    to: "/profil",
    label: "Profil",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const preview = user?.image ? `data:image/png;base64,${user.image}` : null;

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div
        className={`relative bg-[#1a3a6b] flex flex-col items-center py-5 px-3 h-screen text-white transition-all duration-300 ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-5 w-6 h-6 rounded-full bg-[#1a3a6b] border-2 border-slate-200 flex items-center justify-center text-white text-xs z-10 transition-transform duration-300"
          style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ◀
        </button>

        <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10 flex items-center justify-center shrink-0 mb-4">
          <span className="font-['Cinzel',serif] text-lg font-semibold text-white/90">M</span>
        </div>

        {!collapsed && (
          <>
            <img
              src={preview || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt="profil"
              className="w-14 h-14 rounded-full object-cover border-2 border-white/40"
            />
            <p className="mt-2 font-bold text-sm text-center truncate max-w-[160px]">
              {user?.nom || "Utilisateur"}
            </p>
            <p className="text-xs text-white/50 text-center">
              {user?.role || "Compte"}
            </p>
          </>
        )}

        {collapsed && (
          <img
            src={preview || "https://randomuser.me/api/portraits/men/32.jpg"}
            alt="profil"
            className="w-9 h-9 rounded-full object-cover border-2 border-white/40 mb-2"
          />
        )}

        <div className="w-full h-px bg-white/10 my-3" />

        <nav className="w-full flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all overflow-hidden ${
                isActive(to)
                  ? "bg-white/15 text-white font-bold"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              }`}
            >
              {icon}
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setShowModal(true)}
          className="mt-auto flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/15 text-red-300 hover:bg-red-500/25 text-sm font-semibold w-full transition overflow-hidden"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white text-slate-800 p-6 rounded-xl shadow-xl w-80 text-center">
            <p className="mb-5 font-semibold text-base">
              Voulez-vous vraiment vous déconnecter ?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
              >
                Oui
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2 rounded-lg text-sm font-semibold transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
