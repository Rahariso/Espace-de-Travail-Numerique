import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const createInitialForm = () => ({
  nom: "",
  matricule: "",
  telephone: "",
  fonction: "",
  role: "Simple utilisateur",
  mot_de_passe: "",
});

const MODAL_META = {
  create: {
    title: "Créer un personnel",
    badge: "Nouveau",
    badgeCls: "bg-green-100 text-green-700",
  },
  view: {
    title: "Fiche personnel",
    badge: "Lecture seule",
    badgeCls: "bg-blue-100 text-blue-700",
  },
  edit: {
    title: "Modifier le profil",
    badge: "Modification",
    badgeCls: "bg-amber-100 text-amber-700",
  },
  delete: {
    title: "Supprimer le profil",
    badge: "Suppression",
    badgeCls: "bg-red-100 text-red-700",
  },
};

const getInitials = (nom = "") =>
  nom
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const AV_COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-amber-100 text-amber-800",
  "bg-pink-100 text-pink-800",
  "bg-cyan-100 text-cyan-800",
];

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
      {label}
    </label>
    {children}
  </div>
);

export default function Personnes() {
  const { user, refreshUser } = useAuth();
  const isAdmin = user?.role === "Administrateur";

  const [profils, setProfils] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(createInitialForm);

  useEffect(() => {
    fetchProfils();
  }, []);

  const fetchProfils = async () => {
    try {
      const response = await api.get("/profils");
      setProfils(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = useMemo(() => {
    return profils.filter((profil) => {
      const query = search.toLowerCase();
      return (
        profil.nom?.toLowerCase().includes(query) ||
        profil.matricule?.toLowerCase().includes(query) ||
        profil.fonction?.toLowerCase().includes(query)
      );
    });
  }, [profils, search]);

  const inputCls =
    "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white outline-none transition focus:border-[#1a3a6b] focus:ring-2 focus:ring-[#1a3a6b]/10";

  const openModal = (mode, profil = null) => {
    setSelected(profil);
    setForm(
      profil ? { ...createInitialForm(), ...profil, mot_de_passe: "" } : createInitialForm()
    );
    setModal(mode);
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setForm(createInitialForm());
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const createProfil = async () => {
    try {
      await api.post("/profils", form);
      await fetchProfils();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création du profil.");
    }
  };

  const updateProfil = async () => {
    try {
      const payload = { ...form };

      if (!payload.mot_de_passe) {
        delete payload.mot_de_passe;
      }

      if (!isAdmin) {
        payload.role = selected.role;
      }

      await api.put(`/profils/${selected.id}`, payload);
      await fetchProfils();

      if (user?.id === selected.id) {
        await refreshUser();
      }

      closeModal();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour du profil.");
    }
  };

  const deleteProfil = async () => {
    try {
      await api.delete(`/profils/${selected.id}`);
      await fetchProfils();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du profil.");
    }
  };

  const meta = modal ? MODAL_META[modal] : null;
  const selectedColor =
    selected ? AV_COLORS[profils.findIndex((p) => p.id === selected.id) % AV_COLORS.length] : AV_COLORS[0];

  return (
    <div className="space-y-5 font-['Lato',sans-serif]">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-['Cinzel',serif] text-xl text-[#1a3a6b] font-semibold">
            Liste des personnels
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestion des comptes et profils des agents
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
            Nouveau personnel
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
            placeholder="Rechercher par nom, matricule ou fonction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-[#1a3a6b] focus:ring-2 focus:ring-[#1a3a6b]/10 text-slate-700 w-80"
          />
        </div>

        <span className="text-xs text-slate-400 bg-slate-200 px-3 py-1 rounded-full">
          {filtered.length} personnel{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-800">Personnels enregistrés</span>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {["Personnel", "Matricule", "Fonction", "Téléphone", "Rôle", "Actions"].map((heading) => (
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
            {filtered.map((profil, index) => (
              <tr key={profil.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        AV_COLORS[index % AV_COLORS.length]
                      }`}
                    >
                      {getInitials(profil.nom)}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{profil.nom}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs font-mono text-slate-500">{profil.matricule}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{profil.fonction}</td>
                <td className="px-5 py-3 text-sm text-slate-500">{profil.telephone || "-"}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      profil.role === "Administrateur"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {profil.role}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => openModal("view", profil)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg transition"
                    >
                      Voir
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => openModal("edit", profil)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg transition"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => openModal("delete", profil)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold rounded-lg transition"
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">
                  Aucun personnel trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <h2 className="font-['Cinzel',serif] text-[#1a3a6b] text-base font-semibold">
                  {meta.title}
                </h2>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${meta.badgeCls}`}>
                  {meta.badge}
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

            {modal === "view" && selected && (
              <div className="px-6 py-5 overflow-y-auto">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-5 ${selectedColor}`}>
                  {getInitials(selected.nom)}
                </div>
                {[
                  { label: "Nom", value: selected.nom },
                  { label: "Matricule", value: selected.matricule, mono: true },
                  { label: "Fonction", value: selected.fonction },
                  { label: "Téléphone", value: selected.telephone || "-" },
                  { label: "Rôle", value: selected.role },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {item.label}
                    </span>
                    <span className={`text-sm font-semibold text-slate-800 ${item.mono ? "font-mono" : ""}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {(modal === "create" || modal === "edit") && (
              <div className="px-6 py-5 overflow-y-auto space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nom complet">
                    <input
                      name="nom"
                      className={inputCls}
                      placeholder="Ex: Jean Rakoto"
                      value={form.nom}
                      onChange={handleChange}
                    />
                  </Field>
                  <Field label="Matricule">
                    <input
                      name="matricule"
                      className={inputCls}
                      placeholder="MAT-2024-001"
                      value={form.matricule}
                      onChange={handleChange}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Téléphone">
                    <input
                      name="telephone"
                      className={inputCls}
                      placeholder="+509 ..."
                      value={form.telephone}
                      onChange={handleChange}
                    />
                  </Field>
                  <Field label="Fonction">
                    <input
                      name="fonction"
                      className={inputCls}
                      placeholder="Ex: Directeur"
                      value={form.fonction}
                      onChange={handleChange}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Rôle">
                    <select
                      name="role"
                      className={`${inputCls} ${!isAdmin ? "bg-slate-100 text-slate-400 cursor-not-allowed" : ""}`}
                      value={form.role}
                      onChange={handleChange}
                      disabled={!isAdmin}
                    >
                      <option>Simple utilisateur</option>
                      <option>Administrateur</option>
                    </select>
                  </Field>

                  <Field label={modal === "edit" ? "Nouveau mot de passe" : "Mot de passe"}>
                    <input
                      type="password"
                      name="mot_de_passe"
                      className={inputCls}
                      placeholder="••••••••"
                      value={form.mot_de_passe}
                      onChange={handleChange}
                    />
                  </Field>
                </div>
              </div>
            )}

            {modal === "delete" && selected && (
              <div className="px-6 py-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm mb-1">Voulez-vous vraiment supprimer</p>
                <p className="text-[#1a3a6b] font-bold text-base mb-2">{selected.nom}</p>
                <p className="text-xs text-slate-400">Cette action est irréversible.</p>
              </div>
            )}

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-lg transition"
              >
                {modal === "view" ? "Fermer" : "Annuler"}
              </button>

              {modal === "create" && isAdmin && (
                <button
                  type="button"
                  onClick={createProfil}
                  className="px-6 py-2 bg-[#1a3a6b] hover:bg-[#0f2548] text-white text-sm font-bold rounded-lg transition"
                >
                  Enregistrer
                </button>
              )}

              {modal === "edit" && isAdmin && (
                <button
                  type="button"
                  onClick={updateProfil}
                  className="px-6 py-2 bg-[#1a3a6b] hover:bg-[#0f2548] text-white text-sm font-bold rounded-lg transition"
                >
                  Mettre à jour
                </button>
              )}

              {modal === "delete" && isAdmin && (
                <button
                  type="button"
                  onClick={deleteProfil}
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
