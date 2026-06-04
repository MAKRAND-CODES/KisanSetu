import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FarmerLayout from "../../components/common/FarmerLayout";
import API from "../../services/api";

const statusStyle = {
  pending: "bg-yellow-100 text-yellow-800",
  verified: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  active: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  claim_requested: "bg-purple-100 text-purple-800",
  claim_approved: "bg-indigo-100 text-indigo-800",
  claim_released: "bg-teal-100 text-teal-800",
};

const InsurancePortal = () => {
  const [farms, setFarms] = useState([]);
  const [insuranceList, setInsuranceList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    farm: "",
    cropName: "",
    season: "kharif",
    area: "",
    areaUnit: "acre",
    sumInsured: "",
    premiumAmount: "",
  });

  const fetchFarms = async () => {
    try {
      const res = await API.get("/farms/my");
      const farmList = res.data.farms || [];
      setFarms(farmList);

      if (farmList.length > 0) {
        const firstFarm = farmList[0];

        setForm((prev) => ({
          ...prev,
          farm: firstFarm._id,
          cropName: firstFarm.currentCrop || "",
          area: firstFarm.area || "",
          areaUnit: firstFarm.areaUnit || "acre",
        }));
      }
    } catch {
      toast.error("Failed to fetch farms");
    }
  };

  const fetchInsurance = async () => {
    try {
      const res = await API.get("/insurance/my");
      setInsuranceList(res.data.insurance || []);
    } catch {
      toast.error("Failed to fetch insurance records");
    }
  };

  useEffect(() => {
    fetchFarms();
    fetchInsurance();
  }, []);

  const handleFarmChange = (e) => {
    const farmId = e.target.value;
    const selectedFarm = farms.find((farm) => farm._id === farmId);

    setForm((prev) => ({
      ...prev,
      farm: farmId,
      cropName: selectedFarm?.currentCrop || prev.cropName,
      area: selectedFarm?.area || prev.area,
      areaUnit: selectedFarm?.areaUnit || prev.areaUnit,
    }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const applyInsurance = async (e) => {
    e.preventDefault();

    if (!form.farm) {
      toast.error("Please add/select a farm first");
      return;
    }

    try {
      setLoading(true);

      await API.post("/insurance/apply", {
        farm: form.farm,
        cropName: form.cropName,
        season: form.season,
        area: Number(form.area),
        areaUnit: form.areaUnit,
        sumInsured: Number(form.sumInsured),
        premiumAmount: Number(form.premiumAmount),
      });

      toast.success("Insurance application submitted");

      setForm((prev) => ({
        ...prev,
        sumInsured: "",
        premiumAmount: "",
      }));

      fetchInsurance();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to apply for insurance"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FarmerLayout title="Crop Insurance">
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={applyInsurance}
          className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm"
        >
          <h1 className="text-2xl font-bold text-green-950">
            Apply for Crop Insurance
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Submit crop insurance application for your registered farm.
          </p>

          <div className="mt-6 space-y-4">
            <select
              name="farm"
              value={form.farm}
              onChange={handleFarmChange}
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

            <input
              name="cropName"
              value={form.cropName}
              onChange={handleChange}
              placeholder="Crop Name"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
              required
            />

            <select
              name="season"
              value={form.season}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
            >
              <option value="kharif">Kharif</option>
              <option value="rabi">Rabi</option>
              <option value="zaid">Zaid</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="Area"
                className="rounded-xl border px-4 py-3 outline-none focus:border-green-600"
                required
              />

              <select
                name="areaUnit"
                value={form.areaUnit}
                onChange={handleChange}
                className="rounded-xl border px-4 py-3 outline-none focus:border-green-600"
              >
                <option value="acre">Acre</option>
                <option value="hectare">Hectare</option>
                <option value="bigha">Bigha</option>
              </select>
            </div>

            <input
              type="number"
              name="sumInsured"
              value={form.sumInsured}
              onChange={handleChange}
              placeholder="Sum Insured Amount"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
              required
            />

            <input
              type="number"
              name="premiumAmount"
              value={form.premiumAmount}
              onChange={handleChange}
              placeholder="Premium Amount"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
              required
            />

            <button
              disabled={loading || farms.length === 0}
              className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Apply Insurance"}
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-green-950">
            My Insurance Policies
          </h2>

          {insuranceList.length === 0 ? (
            <p className="text-gray-500">No insurance applications yet.</p>
          ) : (
            <div className="space-y-4">
              {insuranceList.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-green-100 p-5"
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <h3 className="font-bold text-green-900">
                        {item.cropName} Insurance
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Policy No: {item.policyNumber}
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

                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                    <p>
                      <b>Farm:</b> {item.farm?.farmName || "N/A"}
                    </p>
                    <p>
                      <b>Season:</b> {item.season}
                    </p>
                    <p>
                      <b>Area:</b> {item.area} {item.areaUnit}
                    </p>
                    <p>
                      <b>Sum Insured:</b> ₹{item.sumInsured}
                    </p>
                    <p>
                      <b>Premium:</b> ₹{item.premiumAmount}
                    </p>
                    <p>
                      <b>Claim:</b> ₹{item.claimAmount || 0}
                    </p>
                  </div>

                  {item.remarks && (
                    <div className="mt-4 rounded-xl bg-green-50 p-4 text-sm text-green-900">
                      <b>Remarks:</b> {item.remarks}
                    </div>
                  )}

                  <p className="mt-3 text-xs text-gray-400">
                    Applied on {new Date(item.createdAt).toLocaleString()}
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

export default InsurancePortal;