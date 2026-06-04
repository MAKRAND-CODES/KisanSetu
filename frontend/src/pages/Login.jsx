import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const redirectByRole = (role) => {
    if (role === "farmer") navigate("/farmer/dashboard");
    else if (role === "officer") navigate("/officer/dashboard");
    else if (role === "admin") navigate("/admin/dashboard");
    else navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", formData);

      login(res.data);
      toast.success(language === "hi" ? "लॉगिन सफल" : "Login successful");

      redirectByRole(res.data.user.role);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (language === "hi" ? "लॉगिन असफल" : "Login failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute right-5 top-5 overflow-hidden rounded-xl border border-white/30 bg-white/20 p-1 backdrop-blur">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            language === "en"
              ? "bg-white text-green-800"
              : "text-white hover:bg-white/10"
          }`}
        >
          English
        </button>

        <button
          type="button"
          onClick={() => setLanguage("hi")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            language === "hi"
              ? "bg-white text-green-800"
              : "text-white hover:bg-white/10"
          }`}
        >
          हिन्दी
        </button>
      </div>

      <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-800">{t.appName}</h1>
          <p className="mt-2 text-sm text-gray-600">{t.tagline}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {language === "hi" ? "फोन नंबर" : "Phone Number"}
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9999999996"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {language === "hi" ? "पासवर्ड" : "Password"}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:opacity-60"
          >
            {loading
              ? language === "hi"
                ? "लॉगिन हो रहा है..."
                : "Logging in..."
              : t.login}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {language === "hi" ? "नया किसान?" : "New farmer?"}{" "}
          <Link to="/register" className="font-semibold text-green-700">
            {t.createAccount}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;