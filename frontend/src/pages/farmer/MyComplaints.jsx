import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FarmerLayout from "../../components/common/FarmerLayout";
import API from "../../services/api";

const statusStyle = {
  pending: "bg-yellow-100 text-yellow-800",
  under_review: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  compensation_released: "bg-purple-100 text-purple-800",
};

const MyComplaints = () => {
  const [farms, setFarms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    farm: "",
    damageType: "flood",
    title: "",
    description: "",
    estimatedLoss: "",
    damagePercentage: "",
  });

  const fetchFarms = async () => {
    try {
      const res = await API.get("/farms/my");
      const farmList = res.data.farms || [];
      setFarms(farmList);

      if (farmList.length > 0) {
        setForm((prev) => ({ ...prev, farm: farmList[0]._id }));
      }
    } catch {
      toast.error("Failed to fetch farms");
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/my");
      setComplaints(res.data.complaints || []);
    } catch {
      toast.error("Failed to fetch complaints");
    }
  };

  useEffect(() => {
    fetchFarms();
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitComplaint = async (e) => {
    e.preventDefault();

    if (!form.farm) {
      toast.error("Please add/select a farm first");
      return;
    }

    try {
      setLoading(true);

      await API.post("/complaints", {
        farm: form.farm,
        damageType: form.damageType,
        title: form.title,
        description: form.description,
        estimatedLoss: Number(form.estimatedLoss || 0),
        damagePercentage: Number(form.damagePercentage || 0),
      });

      toast.success("Complaint submitted successfully");

      setForm((prev) => ({
        ...prev,
        damageType: "flood",
        title: "",
        description: "",
        estimatedLoss: "",
        damagePercentage: "",
      }));

      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FarmerLayout title="Muaavja Complaints">
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={submitComplaint}
          className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm"
        >
          <h1 className="text-2xl font-bold text-green-950">
            Submit Crop Damage Complaint
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Apply for compensation support by submitting crop damage details.
          </p>

          <div className="mt-6 space-y-4">
            <select
              name="farm"
              value={form.farm}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
              required
            >
              {farms.length === 0 ? (
                <option value="">No farm found</option>
              ) : (
                farms.map((farm) => (
                  <option key={farm._id} value={farm._id}>
                    {farm.farmName} — {farm.currentCrop || "No crop"}
                  </option>
                ))
              )}
            </select>

            <select
              name="damageType"
              value={form.damageType}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
            >
              <option value="flood">Flood</option>
              <option value="drought">Drought</option>
              <option value="hailstorm">Hailstorm</option>
              <option value="pest">Pest Attack</option>
              <option value="disease">Disease</option>
              <option value="fire">Fire</option>
              <option value="other">Other</option>
            </select>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Complaint title"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
              required
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe crop damage"
              className="min-h-28 w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
              required
            />

            <input
              type="number"
              name="estimatedLoss"
              value={form.estimatedLoss}
              onChange={handleChange}
              placeholder="Estimated loss amount"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
            />

            <input
              type="number"
              name="damagePercentage"
              value={form.damagePercentage}
              onChange={handleChange}
              placeholder="Damage percentage"
              min="0"
              max="100"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
            />

            <button
              disabled={loading || farms.length === 0}
              className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-green-950">
            My Complaint History
          </h2>

          {complaints.length === 0 ? (
            <p className="text-gray-500">No complaints submitted yet.</p>
          ) : (
            <div className="space-y-4">
              {complaints.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-green-100 p-5"
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <h3 className="font-bold text-green-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.farm?.farmName} • {item.damageType}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        statusStyle[item.status] || statusStyle.pending
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>

                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                    <p>
                      <b>Estimated Loss:</b> ₹{item.estimatedLoss || 0}
                    </p>
                    <p>
                      <b>Damage:</b> {item.damagePercentage || 0}%
                    </p>
                    <p>
                      <b>Approved:</b> ₹{item.approvedAmount || 0}
                    </p>
                  </div>

                  {item.officerRemarks && (
                    <div className="mt-4 rounded-xl bg-green-50 p-4 text-sm text-green-900">
                      <b>Officer Remarks:</b> {item.officerRemarks}
                    </div>
                  )}

                  <p className="mt-3 text-xs text-gray-400">
                    Submitted on {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FarmerLayout>
  );
};

export default MyComplaints;