import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "farmer",
    state: "",
    district: "",
    village: "",
    landArea: "",
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

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        state: formData.state.trim(),
        district: formData.district.trim(),
        village: formData.village.trim(),
        landArea: Number(formData.landArea || 0),
      };

      const res = await API.post("/auth/register", payload);

      login(res.data);
      toast.success(
        language === "hi" ? "खाता सफलतापूर्वक बन गया" : "Account created successfully"
      );

      redirectByRole(res.data.user.role);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (language === "hi" ? "पंजीकरण असफल" : "Registration failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg relative min-h-screen px-4 py-8">
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

      <div className="mx-auto mt-14 w-full max-w-3xl rounded-3xl bg-white/95 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-800">
            {language === "hi" ? "किसानसेतु खाता बनाएं" : "Create KisanSetu Account"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {language === "hi"
              ? "किसान, अधिकारी या एडमिन के रूप में पंजीकरण करें"
              : "Register as farmer, officer, or admin"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={language === "hi" ? "पूरा नाम" : "Full Name"}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            required
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={language === "hi" ? "फोन नंबर" : "Phone Number"}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            required
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={language === "hi" ? "ईमेल वैकल्पिक" : "Email Optional"}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={language === "hi" ? "पासवर्ड" : "Password"}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          >
            <option value="farmer">{language === "hi" ? "किसान" : "Farmer"}</option>
            <option value="officer">{language === "hi" ? "अधिकारी" : "Officer"}</option>
            <option value="admin">{language === "hi" ? "एडमिन" : "Admin"}</option>
          </select>

          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder={t.state}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />

          <input
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder={t.district}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />

          <input
            name="village"
            value={formData.village}
            onChange={handleChange}
            placeholder={t.village}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />

          <input
            type="number"
            name="landArea"
            value={formData.landArea}
            onChange={handleChange}
            placeholder={language === "hi" ? "भूमि क्षेत्रफल" : "Land Area"}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 md:col-span-2"
          />

          <button
            disabled={loading}
            className="rounded-xl bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:opacity-60 md:col-span-2"
          >
            {loading
              ? language === "hi"
                ? "खाता बन रहा है..."
                : "Creating account..."
              : t.createAccount}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {language === "hi" ? "पहले से पंजीकृत हैं?" : "Already registered?"}{" "}
          <Link to="/login" className="font-semibold text-green-700">
            {t.login}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;