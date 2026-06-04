import FarmerLayout from "../../components/common/FarmerLayout";
import {
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
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../translations";

const FarmerDashboard = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const cards =
    language === "hi"
      ? [
          {
            title: "मेरा खेत",
            desc: "खेत की जानकारी, मिट्टी, फसल और क्षेत्रफल प्रबंधित करें।",
            path: "/farmer/farms",
            icon: Map,
          },
          {
            title: "फसल सुझाव",
            desc: "मिट्टी, मौसम और पानी के आधार पर फसल सुझाव पाएं।",
            path: "/farmer/crops",
            icon: Sprout,
          },
          {
            title: "खाद मार्गदर्शन",
            desc: "अपनी फसल के लिए खाद और NPK सुझाव देखें।",
            path: "/farmer/fertilizer",
            icon: FlaskConical,
          },
          {
            title: "मुआवजा शिकायतें",
            desc: "फसल नुकसान की शिकायत दर्ज करें और स्थिति देखें।",
            path: "/farmer/complaints",
            icon: FileWarning,
          },
          {
            title: "फसल बीमा",
            desc: "फसल बीमा के लिए आवेदन करें और स्थिति ट्रैक करें।",
            path: "/farmer/insurance",
            icon: ShieldCheck,
          },
          {
            title: "सरकारी योजनाएँ",
            desc: "किसान योजनाओं की पात्रता और लाभ देखें।",
            path: "/farmer/schemes",
            icon: Landmark,
          },
          {
            title: "मंडी भाव",
            desc: "वास्तविक AGMARKNET मंडी भाव देखें।",
            path: "/farmer/market",
            icon: TrendingUp,
          },
          {
            title: "सैटेलाइट NDVI",
            desc: "Sentinel सैटेलाइट डेटा से फसल स्वास्थ्य देखें।",
            path: "/farmer/satellite",
            icon: Satellite,
          },
          {
            title: "मौसम केंद्र",
            desc: "मौसम जानकारी और कृषि सलाह देखें।",
            path: "/farmer/weather",
            icon: CloudSun,
          },
          {
            title: "सूचनाएँ",
            desc: "महत्वपूर्ण अलर्ट और अपडेट देखें।",
            path: "/farmer/notifications",
            icon: Bell,
          },
        ]
      : [
          {
            title: "My Farm",
            desc: "Manage farm profile, soil, crop and area details.",
            path: "/farmer/farms",
            icon: Map,
          },
          {
            title: "Crop Recommendation",
            desc: "Get crop suggestions based on soil, season and water.",
            path: "/farmer/crops",
            icon: Sprout,
          },
          {
            title: "Fertilizer Guide",
            desc: "View fertilizer and NPK guidance for your crop.",
            path: "/farmer/fertilizer",
            icon: FlaskConical,
          },
          {
            title: "Muaavja Complaints",
            desc: "Submit and track crop damage compensation requests.",
            path: "/farmer/complaints",
            icon: FileWarning,
          },
          {
            title: "Crop Insurance",
            desc: "Apply and track crop insurance policies.",
            path: "/farmer/insurance",
            icon: ShieldCheck,
          },
          {
            title: "Government Schemes",
            desc: "Check eligibility for farmer welfare schemes.",
            path: "/farmer/schemes",
            icon: Landmark,
          },
          {
            title: "Market Prices",
            desc: "View real AGMARKNET mandi prices.",
            path: "/farmer/market",
            icon: TrendingUp,
          },
          {
            title: "Satellite NDVI",
            desc: "Analyze crop health using Sentinel satellite data.",
            path: "/farmer/satellite",
            icon: Satellite,
          },
          {
            title: "Weather Center",
            desc: "View weather forecast and farming advice.",
            path: "/farmer/weather",
            icon: CloudSun,
          },
          {
            title: "Notifications",
            desc: "See important alerts and updates.",
            path: "/farmer/notifications",
            icon: Bell,
          },
        ];

  return (
    <FarmerLayout title={t.farmerDashboard}>
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-green-800 to-green-600 p-6 text-white shadow-sm">
        <h1 className="text-2xl font-bold">
          {language === "hi" ? "किसानसेतु में आपका स्वागत है" : "Welcome to KisanSetu"}
        </h1>

        <p className="mt-2 max-w-2xl text-green-50">
          {language === "hi"
            ? "अपने खेत, फसल स्वास्थ्य, बीमा, शिकायतें, योजनाएँ, सैटेलाइट रिपोर्ट और मंडी भाव एक ही जगह से प्रबंधित करें।"
            : "Manage your farm, crop health, insurance, complaints, schemes, satellite reports and mandi prices from one place."}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              to={card.path}
              className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-800">
                <Icon size={24} />
              </div>

              <h3 className="text-lg font-bold text-green-950">
                {card.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {card.desc}
              </p>
            </Link>
          );
        })}
      </div>
    </FarmerLayout>
  );
};

export default FarmerDashboard;