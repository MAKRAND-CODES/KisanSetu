import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FarmerLayout from "../../components/common/FarmerLayout";
import API from "../../services/api";

const MyFarm = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    farmName: "",
    state: "",
    district: "",
    village: "",
    soilType: "black",
    currentCrop: "",
    season: "kharif",
    area: "",
    areaUnit: "acre",
    latitude: "",
    longitude: "",
    irrigationType: "rainfed",
  });

  const fetchFarms = async () => {
    try {
      const res = await API.get("/farms/my");
      setFarms(res.data.farms);
    } catch {
      toast.error("Failed to fetch farms");
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addFarm = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/farms", {
        farmName: form.farmName,
        state: form.state,
        district: form.district,
        village: form.village,
        soilType: form.soilType,
        currentCrop: form.currentCrop,
        season: form.season,
        area: Number(form.area),
        areaUnit: form.areaUnit,
        coordinates: {
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        },
        irrigationType: form.irrigationType,
      });

      toast.success("Farm added successfully");
      setForm({
        farmName: "",
        state: "",
        district: "",
        village: "",
        soilType: "black",
        currentCrop: "",
        season: "kharif",
        area: "",
        areaUnit: "acre",
        latitude: "",
        longitude: "",
        irrigationType: "rainfed",
      });

      fetchFarms();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add farm");
    } finally {
      setLoading(false);
    }
  };

  const deleteFarm = async (id) => {
    try {
      await API.delete(`/farms/${id}`);
      toast.success("Farm deleted");
      fetchFarms();
    } catch {
      toast.error("Failed to delete farm");
    }
  };

  return (
    <FarmerLayout title="My Farm">
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={addFarm}
          className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-xl font-bold text-green-950">
            Add Farm Details
          </h2>

          <div className="space-y-4">
            <input name="farmName" value={form.farmName} onChange={handleChange} placeholder="Farm Name" className="w-full rounded-xl border px-4 py-3" required />
            <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="w-full rounded-xl border px-4 py-3" required />
            <input name="district" value={form.district} onChange={handleChange} placeholder="District" className="w-full rounded-xl border px-4 py-3" required />
            <input name="village" value={form.village} onChange={handleChange} placeholder="Village" className="w-full rounded-xl border px-4 py-3" required />

            <select name="soilType" value={form.soilType} onChange={handleChange} className="w-full rounded-xl border px-4 py-3">
              <option value="black">Black Soil</option>
              <option value="red">Red Soil</option>
              <option value="alluvial">Alluvial Soil</option>
              <option value="sandy">Sandy Soil</option>
              <option value="clay">Clay Soil</option>
              <option value="loamy">Loamy Soil</option>
              <option value="other">Other</option>
            </select>

            <input name="currentCrop" value={form.currentCrop} onChange={handleChange} placeholder="Current Crop" className="w-full rounded-xl border px-4 py-3" />

            <select name="season" value={form.season} onChange={handleChange} className="w-full rounded-xl border px-4 py-3">
              <option value="kharif">Kharif</option>
              <option value="rabi">Rabi</option>
              <option value="zaid">Zaid</option>
              <option value="none">None</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <input type="number" name="area" value={form.area} onChange={handleChange} placeholder="Area" className="rounded-xl border px-4 py-3" required />
              <select name="areaUnit" value={form.areaUnit} onChange={handleChange} className="rounded-xl border px-4 py-3">
                <option value="acre">Acre</option>
                <option value="hectare">Hectare</option>
                <option value="bigha">Bigha</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input type="number" step="any" name="latitude" value={form.latitude} onChange={handleChange} placeholder="Latitude" className="rounded-xl border px-4 py-3" />
              <input type="number" step="any" name="longitude" value={form.longitude} onChange={handleChange} placeholder="Longitude" className="rounded-xl border px-4 py-3" />
            </div>

            <select name="irrigationType" value={form.irrigationType} onChange={handleChange} className="w-full rounded-xl border px-4 py-3">
              <option value="rainfed">Rainfed</option>
              <option value="canal">Canal</option>
              <option value="borewell">Borewell</option>
              <option value="drip">Drip</option>
              <option value="sprinkler">Sprinkler</option>
              <option value="other">Other</option>
            </select>

            <button disabled={loading} className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60">
              {loading ? "Adding..." : "Add Farm"}
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-green-950">My Farms</h2>

          <div className="space-y-4">
            {farms.length === 0 ? (
              <p className="text-gray-500">No farms added yet.</p>
            ) : (
              farms.map((farm) => (
                <div key={farm._id} className="rounded-2xl border border-green-100 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-green-900">{farm.farmName}</h3>
                      <p className="text-sm text-gray-600">
                        {farm.village}, {farm.district}, {farm.state}
                      </p>
                    </div>

                    <button onClick={() => deleteFarm(farm._id)} className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
                      Delete
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                    <p><b>Soil:</b> {farm.soilType}</p>
                    <p><b>Crop:</b> {farm.currentCrop || "N/A"}</p>
                    <p><b>Season:</b> {farm.season}</p>
                    <p><b>Area:</b> {farm.area} {farm.areaUnit}</p>
                    <p><b>Irrigation:</b> {farm.irrigationType}</p>
                    <p><b>Location:</b> {farm.coordinates?.latitude}, {farm.coordinates?.longitude}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
};

export default MyFarm;