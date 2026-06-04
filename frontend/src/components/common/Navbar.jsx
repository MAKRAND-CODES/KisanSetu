import { Menu, LogOut } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../translations";

const Navbar = ({ title, onMenuClick }) => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <header className="sticky top-0 z-10 border-b border-green-100 bg-white/90 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl bg-green-50 p-2 text-green-800 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-green-950 md:text-xl">
              {title}
            </h2>
            <p className="truncate text-sm text-gray-500">
              {language === "hi" ? "स्वागत है" : "Welcome"},{" "}
              {user?.name || (language === "hi" ? "किसान" : "Farmer")}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 md:px-4"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">{t.logout}</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;