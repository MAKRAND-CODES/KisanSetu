import { createContext, useEffect, useState } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (data) => {
    localStorage.setItem("kisansetu_token", data.token);
    localStorage.setItem("kisansetu_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("kisansetu_token");
    localStorage.removeItem("kisansetu_user");
    setUser(null);
  };

  const loadUser = async () => {
    try {
      const savedUser = localStorage.getItem("kisansetu_user");
      const token = localStorage.getItem("kisansetu_token");

      if (!token || !savedUser) {
        setLoading(false);
        return;
      }

      const res = await API.get("/auth/profile");
      setUser(res.data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};