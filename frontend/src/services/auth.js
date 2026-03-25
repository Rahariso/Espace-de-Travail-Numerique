import api from "./api";

export const login = async (matricule, mot_de_passe) => {
  const res = await api.post("/login", {
    matricule,
    mot_de_passe
  });

  return res.data;
};