import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const STATUS_BADGE = {
  "En cours": "bg-blue-100 text-blue-800",
  "Planifiée": "bg-amber-100 text-amber-800",
  "Terminée": "bg-green-100 text-green-800",
};

const STATUS_ICON = {
  "En cours": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  "Planifiée": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  "Terminée": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const ICON_BG = {
  "En cours": "bg-blue-50 text-blue-700",
  "Planifiée": "bg-amber-50 text-amber-700",
  "Terminée": "bg-green-50 text-green-700",
};

const formatDisplayDate = (value) => {
  if (!value) return "-";
  if (value.includes("/")) {
    const [day, month, year] = value.split("/");
    return `${day}-${month}-${year}`;
  }
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
};

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Administrateur";
  const navigate = useNavigate();

  const [activites, setActivites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchActivites();
  }, []);

  const fetchActivites = async () => {
    try {
      const response = await api.get("/activites");
      const data = response.data.map((activite) => ({
        ...activite,
        participants: Array.isArray(activite.participants)
          ? activite.participants
          : [],
      }));
      setActivites(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (activite) => {
    setSelected(activite);
    setShowModal(true);
  };

  const openEditFromDashboard = () => {
    if (!selected?.id) {
      return;
    }

    setShowModal(false);
    navigate("/activites", {
      state: { openEditActiviteId: selected.id },
    });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400 text-sm">
        Chargement...
      </div>
    );
  }

  const enCours = activites.filter((activite) => activite.statut === "En cours").length;
  const planifiees = activites.filter((activite) => activite.statut === "Planifiée").length;
  const terminees = activites.filter((activite) => activite.statut === "Terminée").length;

  const STATS = [
    { label: "En cours", value: enCours, status: "En cours" },
    { label: "Planifiées", value: planifiees, status: "Planifiée" },
    { label: "Terminées", value: terminees, status: "Terminée" },
  ];

  return (
    <div className="space-y-5 font-['Lato',sans-serif]">
      <div className="flex items-center justify-between">
        <h1 className="font-['Cinzel',serif] text-xl text-[#1a3a6b] font-semibold">
          Tableau de bord
        </h1>
        <span className="text-xs bg-slate-200 text-slate-500 px-3 py-1 rounded-full">
          {activites.length} activités au total
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {STATS.map(({ label, value, status }) => (
          <div key={status} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${ICON_BG[status]}`}>
              {STATUS_ICON[status]}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-3xl font-bold text-slate-800 leading-none">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-800">Activités récentes</span>
          <span className="text-xs text-slate-400">
            {isAdmin ? "Consultation et gestion rapide" : "Consultation"}
          </span>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Activité</th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Responsable</th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Statut</th>
              <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {activites.slice(0, 5).map((activite) => (
              <tr key={activite.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 text-sm text-slate-700 font-medium">{activite.nom_activite}</td>
                <td className="px-5 py-3 text-sm text-slate-500">{activite.responsable}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${STATUS_BADGE[activite.statut] ?? "bg-slate-100 text-slate-500"}`}>
                    {activite.statut}
                  </span>
                </td>
                <td className="px-5 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => openModal(activite)}
                    className="px-4 py-1.5 bg-[#1a3a6b] hover:bg-[#0f2548] text-white text-xs font-bold rounded-lg transition"
                  >
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selected && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-['Cinzel',serif] text-[#1a3a6b] text-base font-semibold">
                Fiche activité
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-400 flex items-center justify-center text-sm transition"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 space-y-4">
              {[
                { label: "Nom de l'activité", value: selected.nom_activite },
                { label: "Responsable", value: selected.responsable },
                { label: "Statut", value: selected.statut },
                { label: "Date début", value: formatDisplayDate(selected.date_debut) },
                { label: "Date fin", value: formatDisplayDate(selected.date_fin) },
                { label: "Commentaire", value: selected.commentaire || "-" },
              ].map((item) => (
                <div key={item.label}>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                    {item.label}
                  </label>
                  <div className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50">
                    {item.value}
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Participants
                </label>
                <div className="border border-slate-200 rounded-xl bg-slate-50 p-3 space-y-2">
                  {selected.participants?.length ? (
                    selected.participants.map((participant, index) => (
                      <div key={`${participant}-${index}`} className="bg-white border border-slate-100 rounded-lg px-3 py-2 text-sm text-slate-700">
                        {typeof participant === "string" ? participant : participant.nom}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">Aucun participant</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-lg transition"
              >
                Fermer
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={openEditFromDashboard}
                  className="px-4 py-2 bg-[#1a3a6b] hover:bg-[#0f2548] text-white text-xs font-bold rounded-lg transition"
                >
                  Modifier cette activite
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
