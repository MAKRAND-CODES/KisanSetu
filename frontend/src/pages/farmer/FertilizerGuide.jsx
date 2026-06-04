import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FarmerLayout from "../../components/common/FarmerLayout";
import API from "../../services/api";

const FertilizerGuide = () => {
  const [recommendation, setRecommendation] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    cropName: "Soybean",
    soilType: "black",
    growthStage: "sowing",
  });

  const fetchHistory = async () => {
    try {
      const res = await API.get("/fertilizer/history");
      setHistory(res.data.history || []);
    } catch {
      toast.error("Failed to fetch fertilizer history");
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

      const res = await API.post("/fertilizer/recommend", form);

      setRecommendation(res.data.recommendation);
      toast.success("Fertilizer recommendation generated");

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
    <FarmerLayout title="Fertilizer Guide">
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={generateRecommendation}
          className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm"
        >
          <h1 className="text-2xl font-bold text-green-950">
            Fertilizer Recommendation
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Get NPK and fertilizer guidance based on crop, soil and growth stage.
          </p>

          <div className="mt-6 space-y-4">
            <input
              name="cropName"
              value={form.cropName}
              onChange={handleChange}
              placeholder="Crop Name e.g. Soybean"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
              required
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
              name="growthStage"
              value={form.growthStage}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
            >
              <option value="sowing">Sowing</option>
              <option value="vegetative">Vegetative</option>
              <option value="flowering">Flowering</option>
              <option value="tillering">Tillering</option>
              <option value="transplanting">Transplanting</option>
              <option value="panicle">Panicle</option>
              <option value="knee-high">Knee-high</option>
              <option value="tasseling">Tasseling</option>
              <option value="boll">Boll</option>
            </select>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
            >
              {loading ? "Generating..." : "Recommend Fertilizer"}
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-green-950">
            Recommendation Result
          </h2>

          {!recommendation ? (
            <p className="text-gray-500">
              Fill the form and generate fertilizer guidance.
            </p>
          ) : (
            <div className="space-y-5">
              <div className="rounded-2xl bg-green-50 p-5">
                <h3 className="text-lg font-bold text-green-900">
                  {recommendation.cropName}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Suitability Score: {recommendation.suitabilityScore}/100
                </p>
                <p className="mt-3 text-2xl font-bold text-green-800">
                  NPK: {recommendation.npk}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-green-950">
                  Recommended Fertilizers
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recommendation.fertilizers?.map((item, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {recommendation.reasons?.length > 0 && (
                <div>
                  <h4 className="font-bold text-green-950">Reasons</h4>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    {recommendation.reasons.map((reason, index) => (
                      <li key={index}>• {reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendation.tips?.length > 0 && (
                <div className="rounded-2xl bg-blue-50 p-4">
                  <h4 className="font-bold text-blue-900">Tips</h4>
                  <ul className="mt-2 space-y-1 text-sm text-blue-800">
                    {recommendation.tips.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendation.warnings?.length > 0 && (
                <div className="rounded-2xl bg-orange-50 p-4">
                  <h4 className="font-bold text-orange-900">Warnings</h4>
                  <ul className="mt-2 space-y-1 text-sm text-orange-800">
                    {recommendation.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-green-950">
          Fertilizer History
        </h2>

        {history.length === 0 ? (
          <p className="text-gray-500">No fertilizer history yet.</p>
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
                      {item.cropName} • {item.growthStage}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Soil: {item.soilType} • NPK:{" "}
                      {item.recommendation?.npk || "N/A"}
                    </p>
                  </div>

                  <p className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.recommendation?.fertilizers?.map((fertilizer, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-800"
                    >
                      {fertilizer}
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

export default FertilizerGuide;