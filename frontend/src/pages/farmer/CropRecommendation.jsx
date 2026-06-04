import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FarmerLayout from "../../components/common/FarmerLayout";
import API from "../../services/api";

const suitabilityStyle = {
  High: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-red-100 text-red-800",
};

const CropRecommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    state: "Madhya Pradesh",
    district: "Bhopal",
    soilType: "black",
    season: "kharif",
    waterAvailability: "medium",
  });

  const fetchHistory = async () => {
    try {
      const res = await API.get("/crops/history");
      setHistory(res.data.history || []);
    } catch {
      toast.error("Failed to fetch crop history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const generateRecommendation = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/crops/recommend", form);

      setRecommendations(res.data.recommendations || []);
      toast.success("Crop recommendations generated");

      fetchHistory();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate recommendation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FarmerLayout title="Crop Recommendation">
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={generateRecommendation}
          className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm"
        >
          <h1 className="text-2xl font-bold text-green-950">
            Crop Recommendation
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Get crop suggestions based on your soil, season and water
            availability.
          </p>

          <div className="mt-6 space-y-4">
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
              required
            />

            <input
              name="district"
              value={form.district}
              onChange={handleChange}
              placeholder="District"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
            />

            <select
              name="soilType"
              value={form.soilType}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
            >
              <option value="black">Black Soil</option>
              <option value="red">Red Soil</option>
              <option value="alluvial">Alluvial Soil</option>
              <option value="sandy">Sandy Soil</option>
              <option value="clay">Clay Soil</option>
              <option value="loamy">Loamy Soil</option>
              <option value="other">Other</option>
            </select>

            <select
              name="season"
              value={form.season}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
            >
              <option value="kharif">Kharif</option>
              <option value="rabi">Rabi</option>
              <option value="zaid">Zaid</option>
              <option value="none">None</option>
            </select>

            <select
              name="waterAvailability"
              value={form.waterAvailability}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
            >
              <option value="low">Low Water</option>
              <option value="medium">Medium Water</option>
              <option value="high">High Water</option>
            </select>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
            >
              {loading ? "Generating..." : "Recommend Crops"}
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-green-950">
            Recommendations
          </h2>

          {recommendations.length === 0 ? (
            <p className="text-gray-500">
              Fill the form and generate recommendations.
            </p>
          ) : (
            <div className="space-y-4">
              {recommendations.map((item, index) => (
                <div
                  key={`${item.crop}-${index}`}
                  className="rounded-2xl border border-green-100 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-green-900">
                        {item.crop}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Suitability Score: {item.score}/100
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        suitabilityStyle[item.suitability] ||
                        suitabilityStyle.Medium
                      }`}
                    >
                      {item.suitability}
                    </span>
                  </div>

                  {item.reasons?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-green-900">
                        Reasons:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600">
                        {item.reasons.map((reason, i) => (
                          <li key={i}>• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.tips?.length > 0 && (
                    <div className="mt-4 rounded-xl bg-green-50 p-4">
                      <p className="text-sm font-semibold text-green-900">
                        Tips:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-gray-700">
                        {item.tips.map((tip, i) => (
                          <li key={i}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-green-950">
          Recommendation History
        </h2>

        {history.length === 0 ? (
          <p className="text-gray-500">No history yet.</p>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-green-100 p-5"
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row">
                  <div>
                    <h3 className="font-bold text-green-900">
                      {item.soilType} soil • {item.season} season
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.district}, {item.state} • Water:{" "}
                      {item.waterAvailability}
                    </p>
                  </div>

                  <p className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.recommendations?.slice(0, 5).map((rec, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-800"
                    >
                      {rec.crop} ({rec.suitability})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FarmerLayout>
  );
};

export default CropRecommendation;