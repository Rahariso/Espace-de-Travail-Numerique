import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const inputCls =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50 focus:border-[#1a3a6b] focus:bg-white outline-none transition font-['Lato',sans-serif]";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

const Modal = ({ title, onClose, children, footer }) => (
  <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="font-['Cinzel',serif] text-[#1a3a6b] text-base font-semibold">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-400 flex items-center justify-center text-sm transition"
        >
          ×
        </button>
      </div>
      <div className="px-6 py-5 space-y-3">{children}</div>
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
        {footer}
      </div>
    </div>
  </div>
);

const InfoRow = ({ label, value, mono, onEdit }) => (
  <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50 last:border-0">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
        {label}
      </p>
      <p className={`text-sm font-semibold text-slate-800 ${mono ? "font-mono" : ""}`}>
        {value || "-"}
      </p>
    </div>
    <button
      onClick={onEdit}
      className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 flex items-center justify-center transition"
    >
      <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>
  </div>
);

export default function Profil() {
  const { user, refreshUser } = useAuth();
  const isAdmin = user?.role === "Administrateur";
  const [profil, setProfil] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    nom: "",
    fonction: "",
    telephone: "",
    matricule: "",
    role: "",
  });
  const [passwords, setPasswords] = useState({ nouveau: "", confirmation: "" });

  const fetchProfil = async (profilId = user?.id) => {
    if (!profilId) return;

    const res = await api.get(`/profils/${profilId}`);
    setProfil(res.data);
    setForm({
      nom: res.data.nom ?? "",
      fonction: res.data.fonction ?? "",
      telephone: res.data.telephone ?? "",
      matricule: res.data.matricule ?? "",
      role: res.data.role ?? "",
    });
    setPreview(res.data.image ? `data:image/png;base64,${res.data.image}` : null);
    setImage(null);
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfil(user.id);
    }
  }, [user?.id]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result !== "string") {
          reject(new Error("Conversion image impossible"));
          return;
        }
        resolve(result.split(",")[1] ?? "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const showToastMessage = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const updateProfil = async () => {
    try {
      const payload = { ...form };

      if (image) {
        payload.image = await fileToBase64(image);
      }

      await api.put(`/profils/${profil.id}`, payload);

      await refreshUser();
      await fetchProfil(profil.id);
      setShowEdit(false);
      showToastMessage("Profil mis a jour avec succes");
    } catch (e) {
      console.error(e);
    }
  };

  const updatePassword = async () => {
    if (passwords.nouveau !== passwords.confirmation) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await api.put(`/profils/${profil.id}`, {
        matricule: profil.matricule,
        nom: profil.nom,
        role: profil.role,
        fonction: profil.fonction,
        telephone: profil.telephone,
        mot_de_passe: passwords.nouveau,
      });

      await refreshUser();
      setPasswords({ nouveau: "", confirmation: "" });
      setShowPassword(false);
      showToastMessage("Mot de passe modifie");
    } catch (e) {
      console.error(e);
    }
  };

  if (!profil) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400 text-sm">
        Chargement...
      </div>
    );
  }

  return (
    <div className="space-y-5 font-['Lato',sans-serif]">
      <div>
        <h1 className="font-['Cinzel',serif] text-xl text-[#1a3a6b] font-semibold">
          Mon profil
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Gerez vos informations personnelles et parametres de compte
        </p>
      </div>

      <div className="grid grid-cols-[240px_1fr_200px] gap-4 items-start">
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src={preview || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt="profil"
              className="w-24 h-24 rounded-full object-cover border-3 border-slate-200"
            />
            <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#1a3a6b] border-2 border-white flex items-center justify-center cursor-pointer">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
              <input type="file" className="hidden" onChange={handleImage} accept="image/*" />
            </label>
          </div>

          <p className="font-['Cinzel',serif] text-sm text-[#1a3a6b] font-semibold text-center">
            {profil.nom}
          </p>

          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
            {profil.role}
          </span>

          <span className="text-[11px] text-slate-400 font-mono">{profil.matricule}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-800">Informations personnelles</span>
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold transition"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Tout modifier
            </button>
          </div>
          <InfoRow label="Nom complet" value={profil.nom} onEdit={() => setShowEdit(true)} />
          <InfoRow label="Fonction" value={profil.fonction} onEdit={() => setShowEdit(true)} />
          <InfoRow label="Telephone" value={profil.telephone} onEdit={() => setShowEdit(true)} />
          <InfoRow label="Matricule" value={profil.matricule} mono onEdit={() => setShowEdit(true)} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3.5 border-b border-slate-100">
            <svg className="w-3.5 h-3.5 text-[#1a3a6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="text-xs font-bold text-slate-800">Parametres du compte</span>
          </div>

          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-50">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Role</p>
              <p className="text-[11px] text-slate-400">{profil.role}</p>
            </div>
          </div>

          <button
            onClick={() => setShowPassword(true)}
            className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-slate-50 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Mot de passe</p>
              <p className="text-[11px] text-slate-400">Modifier le mot de passe</p>
            </div>
          </button>
        </div>
      </div>

      {showEdit && (
        <Modal
          title="Modifier le profil"
          onClose={() => setShowEdit(false)}
          footer={
            <>
              <button
                onClick={() => setShowEdit(false)}
                className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-lg transition"
              >
                Annuler
              </button>
              <button
                onClick={updateProfil}
                className="px-6 py-2 bg-[#1a3a6b] hover:bg-[#0f2548] text-white text-sm font-bold rounded-lg transition"
              >
                Enregistrer
              </button>
            </>
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nom complet">
              <input name="nom" className={inputCls} value={form.nom} onChange={handleChange} />
            </Field>
            <Field label="Matricule">
              <input name="matricule" className={inputCls} value={form.matricule} onChange={handleChange} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fonction">
              <input name="fonction" className={inputCls} value={form.fonction} onChange={handleChange} />
            </Field>
            <Field label="Telephone">
              <input name="telephone" className={inputCls} value={form.telephone} onChange={handleChange} />
            </Field>
          </div>
          <Field label="Role">
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
          <Field label="Photo de profil">
            <input
              type="file"
              className={inputCls}
              style={{ padding: "6px 12px" }}
              accept="image/*"
              onChange={handleImage}
            />
          </Field>
        </Modal>
      )}

      {showPassword && (
        <Modal
          title="Changer le mot de passe"
          onClose={() => setShowPassword(false)}
          footer={
            <>
              <button
                onClick={() => setShowPassword(false)}
                className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-lg transition"
              >
                Annuler
              </button>
              <button
                onClick={updatePassword}
                className="px-6 py-2 bg-[#1a3a6b] hover:bg-[#0f2548] text-white text-sm font-bold rounded-lg transition"
              >
                Modifier
              </button>
            </>
          }
        >
          <Field label="Nouveau mot de passe">
            <input
              type="password"
              className={inputCls}
              placeholder="********"
              value={passwords.nouveau}
              onChange={(e) => setPasswords((p) => ({ ...p, nouveau: e.target.value }))}
            />
          </Field>
          <Field label="Confirmer le mot de passe">
            <input
              type="password"
              className={inputCls}
              placeholder="********"
              value={passwords.confirmation}
              onChange={(e) => setPasswords((p) => ({ ...p, confirmation: e.target.value }))}
            />
          </Field>
        </Modal>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 bg-[#1a3a6b] text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-xl z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
