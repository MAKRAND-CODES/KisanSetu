import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FarmerLayout from "../../components/common/FarmerLayout";
import API from "../../services/api";

const categoryStyle = {
  income_support: "bg-green-100 text-green-800",
  insurance: "bg-blue-100 text-blue-800",
  credit: "bg-purple-100 text-purple-800",
  soil: "bg-yellow-100 text-yellow-800",
  subsidy: "bg-orange-100 text-orange-800",
  other: "bg-gray-100 text-gray-800",
};

const GovernmentSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [eligibility, setEligibility] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSchemes = async () => {
    try {
      const res = await API.get("/schemes");
      setSchemes(res.data.schemes || []);
    } catch {
      toast.error("Failed to fetch schemes");
    }
  };

  const checkEligibility = async () => {
    try {
      setLoading(true);
      const res = await API.post("/schemes/check-eligibility");
      setEligibility(res.data.results || []);
      toast.success("Eligibility checked");
    } catch {
      toast.error("Failed to check eligibility");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
    checkEligibility();
  }, []);

  const getEligibility = (schemeId) => {
    return eligibility.find((item) => item.schemeId === schemeId);
  };

  return (
    <FarmerLayout title="Government Schemes">
      <div className="mb-6 rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-green-950">
          Government Schemes
        </h1>

        <p className="mt-2 text-gray-600">
          View farmer welfare schemes and check your eligibility.
        </p>

        <button
          onClick={checkEligibility}
          disabled={loading}
          className="mt-5 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check Eligibility"}
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {schemes.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 text-gray-500 shadow-sm">
            No schemes found.
          </div>
        ) : (
          schemes.map((scheme) => {
            const result = getEligibility(scheme._id);

            return (
              <div
                key={scheme._id}
                className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      categoryStyle[scheme.category] || categoryStyle.other
                    }`}
                  >
                    {scheme.category}
                  </span>

                  {result && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        result.eligible
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.eligible ? "Eligible" : "Not Eligible"}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-green-950">
                  {scheme.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {scheme.description}
                </p>

                <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm">
                  <p>
                    <b>Benefit Amount:</b>{" "}
                    {scheme.benefitAmount > 0
                      ? `₹${scheme.benefitAmount}`
                      : "Information / Support"}
                  </p>

                  <p className="mt-1">
                    <b>Minimum Land:</b>{" "}
                    {scheme.eligibility?.minLandArea || 0} acres
                  </p>
                </div>

                {result?.reasons?.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-semibold text-green-900">
                      Eligibility Reasons:
                    </p>

                    <ul className="space-y-1 text-sm text-gray-600">
                      {result.reasons.map((reason, index) => (
                        <li key={index}>• {reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </FarmerLayout>
  );
};

export default GovernmentSchemes;