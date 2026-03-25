import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function Login() {
  const [matricule, setMatricule] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const matriculeRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setMatricule("");
    setMotDePasse("");

    if (matriculeRef.current) {
      matriculeRef.current.value = "";
    }

    if (passwordRef.current) {
      passwordRef.current.value = "";
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      const response = await api.post("/login", {
        matricule,
        mot_de_passe,
      });

      const { profil, token } = response.data;

      await login(profil, token);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Matricule ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-['Lato',sans-serif]">
      <div className="hidden md:flex w-[420px] shrink-0 bg-[#1a3a6b] flex-col items-center justify-center px-10 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/[0.04]" />
        <div className="absolute -bottom-20 -right-10 w-56 h-56 rounded-full bg-white/[0.04]" />

        <div className="w-28 h-28 rounded-full border border-white/20 bg-white/10 flex items-center justify-center mb-6 z-10">
          <img
            src="/mesupres.jpeg"
            alt="MESUPRES"
            className="w-20 h-20 object-contain rounded-full"
          />
        </div>

        <p className="text-white/90 text-xs tracking-[3px] uppercase text-center mb-3 z-10">
          MESUPRES
        </p>

        <div className="w-10 h-px bg-white/20 mb-4 z-10" />

        <p className="text-white/50 text-xs text-center leading-relaxed max-w-[180px] z-10">
          Ministère de l'Enseignement Supérieur et de la Recherche Scientifique
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
          <p className="text-[10px] tracking-[3px] font-bold text-[#1a3a6b] uppercase mb-2">
            Portail Interne
          </p>

          <h1 className="text-2xl font-semibold text-slate-800 mb-1">
            Espace numérique
          </h1>

          <p className="text-sm text-slate-500 mb-8">
            Plateforme de gestion et de suivi des activités institutionnelles.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
            <input
              type="text"
              name="fake-username"
              autoComplete="username"
              className="hidden"
              tabIndex={-1}
            />
            <input
              type="password"
              name="fake-password"
              autoComplete="current-password"
              className="hidden"
              tabIndex={-1}
            />

            <div>
              <label className="block text-[10px] font-bold tracking-[1.5px] text-slate-400 uppercase mb-2">
                Identifiant
              </label>
              <input
                ref={matriculeRef}
                type="text"
                name="etn-login-id"
                autoComplete="off"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                placeholder="Votre matricule"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#1a3a6b] focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-[1.5px] text-slate-400 uppercase mb-2">
                Mot de passe
              </label>
              <input
                ref={passwordRef}
                type="password"
                name="etn-login-password"
                autoComplete="new-password"
                value={mot_de_passe}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#1a3a6b] focus:bg-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#1a3a6b] hover:bg-[#0f2548] disabled:opacity-60 text-white text-xs font-bold tracking-[2px] uppercase rounded-lg transition"
            >
              {loading ? "Connexion..." : "Connexion"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
