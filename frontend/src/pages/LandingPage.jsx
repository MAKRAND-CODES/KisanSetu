import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

const LandingPage = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const features =
    language === "hi"
      ? [
          "वास्तविक AGMARKNET मंडी भाव",
          "सेंटिनल सैटेलाइट NDVI रिपोर्ट",
          "फसल बीमा एवं शिकायत ट्रैकिंग",
        ]
      : [
          "Real AGMARKNET mandi prices",
          "Sentinel satellite NDVI reports",
          "Crop insurance and complaint tracking",
        ];

  return (
    <div className="auth-bg min-h-screen">
      <div className="flex min-h-screen items-center px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl text-white">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              {t.tagline}
            </p>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              {language === "hi"
                ? "किसानसेतु के साथ बेहतर कृषि निर्णय लें"
                : "KisanSetu for smarter farming decisions"}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-green-50">
              {language === "hi"
                ? "खेत प्रबंधन, फसल सुझाव, फसल बीमा, शिकायतें, सरकारी योजनाएँ, वास्तविक मंडी भाव, मौसम अलर्ट और सैटेलाइट आधारित फसल स्वास्थ्य रिपोर्ट एक ही प्लेटफॉर्म पर प्राप्त करें।"
                : "Manage farms, crop recommendations, insurance, complaints, government schemes, real mandi prices, weather alerts and satellite crop-health insights from one clean platform."}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/login"
                className="rounded-xl bg-white px-6 py-3 font-bold text-green-800"
              >
                {t.login}
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-white/70 px-6 py-3 font-bold text-white backdrop-blur hover:bg-white/10"
              >
                {t.register}
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map((item) => (
              <div
                key={item}
                className="rounded-3xl bg-white/90 p-5 font-semibold text-green-950 shadow-lg"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;