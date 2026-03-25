import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const STATUS_STYLE = {
  "En cours": { badge: "bg-blue-100 text-blue-800", dot: "bg-blue-600" },
  "Planifiée": { badge: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
  "Terminée": { badge: "bg-green-100 text-green-800", dot: "bg-green-600" },
};

const MODAL_META = {
  create: { title: "Créer une activité", badge: "bg-green-100 text-green-700", label: "Nouveau" },
  edit: { title: "Modifier l'activité", badge: "bg-amber-100 text-amber-700", label: "Modification" },
  view: { title: "Détail de l'activité", badge: "bg-blue-100 text-blue-700", label: "Lecture seule" },
  delete: { title: "Supprimer l'activité", badge: "bg-red-100 text-red-700", label: "Suppression" },
};

const createEmptyForm = () => ({
  nom_activite: "",
  statut: "Planifiée",
  responsable: "",
  profil_id: "",
  participants: [],
  date_debut: "",
  date_fin: "",
  commentaire: "",
});

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const toInputDate = (value) => {
  if (!value) return "";
  if (value.includes("/")) {
    const [day, month, year] = value.split("/");
    return `${year}-${month}-${day}`;
  }
  if (value.includes("-")) {
    const parts = value.split("-");
    if (parts[0].length === 4) {
      return value;
    }
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return value;
};

const toDisplayDate = (value) => {
  if (!value) return "-";
  if (value.includes("/")) {
    const [day, month, year] = value.split("/");
    return `${day}-${month}-${year}`;
  }
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
};

export default function Activites() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Administrateur";
  const location = useLocation();
  const navigate = useNavigate();

  const [activites, setActivites] = useState([]);
  const [profils, setProfils] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("Toutes");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedActivite, setSelectedActivite] = useState(null);
  const [form, setForm] = useState(createEmptyForm);
  const [newParticipant, setNewParticipant] = useState("");

  useEffect(() => {
    fetchActivites();
    fetchProfils();
  }, []);

  const fetchActivites = async () => {
    try {
      const response = await api.get("/activites");
      setActivites(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfils = async () => {
    try {
      const response = await api.get("/profils");
      setProfils(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = useMemo(() => {
    return activites.filter((activite) => {
      const matchesSearch =
        activite.nom_activite?.toLowerCase().includes(search.toLowerCase()) ||
        activite.responsable?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        filterStatut === "Toutes" || activite.statut === filterStatut;
      return matchesSearch && matchesStatus;
    });
  }, [activites, filterStatut, search]);

  const inputCls =
    "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white outline-none transition focus:border-[#1a3a6b] focus:ring-2 focus:ring-[#1a3a6b]/10";

  const openModal = (mode, activite = null) => {
    setModalMode(mode);
    setSelectedActivite(activite);
    setNewParticipant("");

    if (activite) {
      const responsableProfil = profils.find((profil) => profil.nom === activite.responsable);
      setForm({
        ...createEmptyForm(),
        ...activite,
        profil_id: activite.profil_id ?? responsableProfil?.id ?? "",
        date_debut: toInputDate(activite.date_debut),
        date_fin: toInputDate(activite.date_fin),
        participants: (activite.participants || []).map((participant) =>
          typeof participant === "string" ? { nom: participant } : participant
        ),
      });
    } else {
      setForm(createEmptyForm());
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedActivite(null);
    setForm(createEmptyForm());
    setNewParticipant("");
  };

  useEffect(() => {
    const editId = location.state?.openEditActiviteId;

    if (!editId || !isAdmin || activites.length === 0) {
      return;
    }

    const activite = activites.find((item) => item.id === editId);

    if (activite) {
      openModal("edit", activite);
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [activites, isAdmin, location.pathname, location.state, navigate]);

  const handleResponsableChange = (event) => {
    const profilId = event.target.value;
    const profil = profils.find((item) => String(item.id) === profilId);

    setForm((prev) => ({
      ...prev,
      profil_id: profilId,
      responsable: profil?.nom ?? "",
    }));
  };

  const addParticipant = () => {
    if (!newParticipant.trim()) return;

    setForm((prev) => ({
      ...prev,
      participants: [...prev.participants, { nom: newParticipant.trim() }],
    }));
    setNewParticipant("");
  };

  const removeParticipant = (index) => {
    setForm((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        profil_id: Number(form.profil_id),
        participants: form.participants.map((participant) => participant.nom).filter(Boolean),
        date_debut: form.date_debut,
        date_fin: form.date_fin,
        commentaire: form.commentaire || "",
      };

      if (!payload.profil_id) {
        alert("Veuillez sélectionner un responsable.");
        return;
      }

      if (modalMode === "create") {
        await api.post("/activites", payload);
      }

      if (modalMode === "edit") {
        await api.put(`/activites/${selectedActivite.id}`, payload);
      }

      await fetchActivites();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement de l'activité.");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/activites/${selectedActivite.id}`);
      await fetchActivites();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression.");
    }
  };

  const meta = MODAL_META[modalMode];
  const isReadOnly = modalMode === "view";

  return (
    <div className="space-y-5 font-['Lato',sans-serif]">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-['Cinzel',serif] text-xl text-[#1a3a6b] font-semibold">
            Gestion des activités
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Vue d'ensemble et suivi des activités institutionnelles
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => openModal("create")}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a3a6b] hover:bg-[#0f2548] text-white text-xs font-bold rounded-lg transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path d="M12 4v16m8-8H4" />
            </svg>
            Créer une activité
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher une activité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-[#1a3a6b] focus:ring-2 focus:ring-[#1a3a6b]/10 text-slate-700 w-72"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["Toutes", "En cours", "Planifiée", "Terminée"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatut(status)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition ${
                filterStatut === status
                  ? status === "Toutes"
                    ? "bg-[#1a3a6b] text-white border-[#1a3a6b]"
                    : `${STATUS_STYLE[status]?.badge} border-transparent`
                  : "bg-white text-slate-500 border-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-800">Liste des activités</span>
          <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            {filtered.length} activité{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {["Nom activité", "Responsable", "Statut", "Période", "Actions"].map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((activite) => {
              const statusStyle =
                STATUS_STYLE[activite.statut] ?? {
                  badge: "bg-slate-100 text-slate-500",
                  dot: "bg-slate-400",
                };

              return (
                <tr key={activite.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-slate-800">{activite.nom_activite}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{activite.responsable}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusStyle.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      {activite.statut}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-400">
                    {toDisplayDate(activite.date_debut)} - {toDisplayDate(activite.date_fin)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => openModal("view", activite)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg transition"
                      >
                        Voir
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            type="button"
                            onClick={() => openModal("edit", activite)}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg transition"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => openModal("delete", activite)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold rounded-lg transition"
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">
                  Aucune activité trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <h2 className="font-['Cinzel',serif] text-[#1a3a6b] text-base font-semibold">
                  {meta.title}
                </h2>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${meta.badge}`}>
                  {meta.label}
                </span>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-400 flex items-center justify-center text-sm transition"
              >
                ×
              </button>
            </div>

            {modalMode === "delete" ? (
              <div className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <p className="text-slate-600 text-sm mb-1">Voulez-vous vraiment supprimer</p>
                  <p className="text-[#1a3a6b] font-bold text-base mb-2">{selectedActivite?.nom_activite}</p>
                  <p className="text-xs text-slate-400">Cette action est irréversible.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto px-6 py-5 space-y-4">
                <Field label="Nom de l'activité">
                  <input
                    className={inputCls}
                    value={form.nom_activite}
                    disabled={isReadOnly}
                    onChange={(e) => setForm((prev) => ({ ...prev, nom_activite: e.target.value }))}
                    placeholder="Ex: Séminaire IA 2026"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date début">
                    <input
                      type="date"
                      className={inputCls}
                      value={form.date_debut}
                      disabled={isReadOnly}
                      onChange={(e) => setForm((prev) => ({ ...prev, date_debut: e.target.value }))}
                    />
                  </Field>
                  <Field label="Date fin">
                    <input
                      type="date"
                      className={inputCls}
                      value={form.date_fin}
                      disabled={isReadOnly}
                      onChange={(e) => setForm((prev) => ({ ...prev, date_fin: e.target.value }))}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Statut">
                    <select
                      className={inputCls}
                      value={form.statut}
                      disabled={isReadOnly}
                      onChange={(e) => setForm((prev) => ({ ...prev, statut: e.target.value }))}
                    >
                      <option>Planifiée</option>
                      <option>En cours</option>
                      <option>Terminée</option>
                    </select>
                  </Field>

                  <Field label="Responsable">
                    <select
                      className={inputCls}
                      value={form.profil_id}
                      disabled={isReadOnly}
                      onChange={handleResponsableChange}
                    >
                      <option value="">Sélectionner...</option>
                      {profils.map((profil) => (
                        <option key={profil.id} value={profil.id}>
                          {profil.nom}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Participants">
                  <div className="border border-slate-200 rounded-xl bg-slate-50 p-3 space-y-2">
                    {form.participants.length === 0 && (
                      <p className="text-xs text-slate-400 italic">Aucun participant ajouté</p>
                    )}

                    {form.participants.map((participant, index) => (
                      <div key={`${participant.nom}-${index}`} className="flex items-center justify-between bg-white border border-slate-100 rounded-lg px-3 py-2">
                        <span className="text-sm text-slate-700">{participant.nom}</span>
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => removeParticipant(index)}
                            className="w-5 h-5 rounded bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center text-xs transition"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}

                    {!isReadOnly && (
                      <div className="flex gap-2 pt-1">
                        <input
                          value={newParticipant}
                          onChange={(e) => setNewParticipant(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addParticipant();
                            }
                          }}
                          placeholder="Nom du participant..."
                          className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-[#1a3a6b] focus:ring-2 focus:ring-[#1a3a6b]/10 transition"
                        />
                        <button
                          type="button"
                          onClick={addParticipant}
                          className="px-4 py-3 bg-[#1a3a6b] text-white text-xs font-bold rounded-xl hover:bg-[#0f2548] transition whitespace-nowrap"
                        >
                          + Ajouter
                        </button>
                      </div>
                    )}
                  </div>
                </Field>

                <Field label="Commentaire">
                  <textarea
                    className={`${inputCls} resize-none h-24`}
                    value={form.commentaire}
                    disabled={isReadOnly}
                    onChange={(e) => setForm((prev) => ({ ...prev, commentaire: e.target.value }))}
                    placeholder="Observations, notes, détails..."
                  />
                </Field>
              </div>
            )}

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-lg transition"
              >
                {modalMode === "view" ? "Fermer" : "Annuler"}
              </button>

              {modalMode === "create" && isAdmin && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-[#1a3a6b] hover:bg-[#0f2548] text-white text-sm font-bold rounded-lg transition"
                >
                  Enregistrer
                </button>
              )}

              {modalMode === "edit" && isAdmin && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-[#1a3a6b] hover:bg-[#0f2548] text-white text-sm font-bold rounded-lg transition"
                >
                  Mettre à jour
                </button>
              )}

              {modalMode === "delete" && isAdmin && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition"
                >
                  Confirmer la suppression
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
