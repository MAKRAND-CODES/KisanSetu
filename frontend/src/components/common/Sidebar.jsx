import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../translations";

import {
  LayoutDashboard,
  Map,
  Sprout,
  FlaskConical,
  FileWarning,
  ShieldCheck,
  Landmark,
  TrendingUp,
  Satellite,
  Bell,
  CloudSun,
} from "lucide-react";

const Sidebar = ({ mobile = false, onNavigate }) => {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const navItems = [
    { name: t.dashboard, path: "/farmer/dashboard", icon: LayoutDashboard },
    { name: t.myFarm, path: "/farmer/farms", icon: Map },
    { name: t.cropRecommendation, path: "/farmer/crops", icon: Sprout },
    { name: t.fertilizerGuide, path: "/farmer/fertilizer", icon: FlaskConical },
    { name: t.complaints, path: "/farmer/complaints", icon: FileWarning },
    { name: t.insurance, path: "/farmer/insurance", icon: ShieldCheck },
    { name: t.schemes, path: "/farmer/schemes", icon: Landmark },
    { name: t.marketPrices, path: "/farmer/market", icon: TrendingUp },
    { name: t.satelliteNdvi, path: "/farmer/satellite", icon: Satellite },
    { name: t.weather, path: "/farmer/weather", icon: CloudSun },
    { name: t.notifications, path: "/farmer/notifications", icon: Bell },
  ];

  return (
    <aside
      className={`min-h-screen w-72 border-r border-green-100 bg-white p-5 ${
        mobile ? "block" : "hidden lg:block"
      }`}
    >
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-green-800">KisanSetu</h1>
        <p className="text-sm text-gray-500">{t.tagline}</p>
      </div>

      <div className="mb-6 overflow-hidden rounded-xl border border-green-100 bg-green-50 p-1">
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              language === "en"
                ? "bg-green-700 text-white shadow-sm"
                : "text-green-800 hover:bg-white"
            }`}
          >
            English
          </button>

          <button
            type="button"
            onClick={() => setLanguage("hi")}
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              language === "hi"
                ? "bg-green-700 text-white shadow-sm"
                : "text-green-800 hover:bg-white"
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-green-700 text-white"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-800"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;