import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FarmerLayout from "../../components/common/FarmerLayout";
import API from "../../services/api";

const SatelliteFarmView = () => {
  const [farms, setFarms] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    farm: "",
    dateFrom: "2026-05-01",
    dateTo: "2026-05-31",
    cloudCoverageLimit: 30,
    notes: "Generated from KisanSetu Satellite Intelligence",
  });

  const fetchFarms = async () => {
    const res = await API.get("/farms/my");
    setFarms(res.data.farms || []);
    if (res.data.farms?.length > 0) {
      setForm((prev) => ({ ...prev, farm: res.data.farms[0]._id }));
    }
  };

  const fetchReports = async () => {
    const res = await API.get("/satellite/my");
    setReports(res.data.reports || []);
  };

  useEffect(() => {
    fetchFarms();
    fetchReports();
  }, []);

  const selectedFarm = farms.find((farm) => farm._id === form.farm);

  const generateReport = async (e) => {
    e.preventDefault();

    if (!selectedFarm) {
      toast.error("Please select a farm");
      return;
    }

    const lat = selectedFarm.coordinates?.latitude;
    const lon = selectedFarm.coordinates?.longitude;

    if (!lat || !lon) {
      toast.error("Selected farm does not have coordinates");
      return;
    }

    const boundaryCoordinates = [
      { latitude: lat + 0.001, longitude: lon - 0.001 },
      { latitude: lat + 0.001, longitude: lon + 0.001 },
      { latitude: lat - 0.001, longitude: lon + 0.001 },
      { latitude: lat - 0.001, longitude: lon - 0.001 },
    ];

    try {
      setLoading(true);

      await API.post("/satellite/live-ndvi", {
        farm: form.farm,
        boundaryCoordinates,
        dateFrom: form.dateFrom,
        dateTo: form.dateTo,
        cloudCoverageLimit: Number(form.cloudCoverageLimit),
        notes: form.notes,
      });

      toast.success("Live NDVI report generated");
      fetchReports();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate NDVI report"
      );
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    healthy: "bg-green-100 text-green-800",
    moderate: "bg-yellow-100 text-yellow-800",
    stressed: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
    unknown: "bg-gray-100 text-gray-700",
  };

  return (
    <FarmerLayout title="Satellite NDVI">
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={generateReport}
          className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm"
        >
          <h1 className="text-2xl font-bold text-green-950">
            Generate Live NDVI Report
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Uses your farm coordinates to analyze crop health with Sentinel
            satellite data.
          </p>

          <div className="mt-6 space-y-4">
            <select
              value={form.farm}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, farm: e.target.value }))
              }
              className="w-full rounded-xl border px-4 py-3"
              required
            >
              {farms.map((farm) => (
                <option key={farm._id} value={farm._id}>
                  {farm.farmName} — {farm.currentCrop || "No crop"}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.dateFrom}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dateFrom: e.target.value }))
              }
              className="w-full rounded-xl border px-4 py-3"
              required
            />

            <input
              type="date"
              value={form.dateTo}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dateTo: e.target.value }))
              }
              className="w-full rounded-xl border px-4 py-3"
              required
            />

            <input
              type="number"
              value={form.cloudCoverageLimit}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  cloudCoverageLimit: e.target.value,
                }))
              }
              placeholder="Cloud coverage limit"
              className="w-full rounded-xl border px-4 py-3"
            />

            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Notes"
              className="min-h-24 w-full rounded-xl border px-4 py-3"
            />

            <button
              disabled={loading}
              className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate NDVI Report"}
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-green-950">
            Satellite Reports
          </h2>

          {reports.length === 0 ? (
            <p className="text-gray-500">No satellite reports generated yet.</p>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="rounded-2xl border border-green-100 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-green-900">
                        {report.farm?.farmName || "Farm Report"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        statusColor[report.cropHealthStatus] ||
                        statusColor.unknown
                      }`}
                    >
                      {report.cropHealthStatus}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                    <p>
                      <b>NDVI Avg:</b>{" "}
                      {report.ndvi?.average ?? "N/A"}
                    </p>
                    <p>
                      <b>NDVI Min:</b> {report.ndvi?.min ?? "N/A"}
                    </p>
                    <p>
                      <b>NDVI Max:</b> {report.ndvi?.max ?? "N/A"}
                    </p>
                    <p>
                      <b>Area:</b> {report.calculatedArea?.acres} acres
                    </p>
                    <p>
                      <b>Boundary:</b> {report.boundaryLengthMeters} m
                    </p>
                    <p>
                      <b>Provider:</b> {report.satelliteProvider}
                    </p>
                  </div>

                  <p className="mt-3 text-sm text-gray-600">
                    {report.notes}
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

export default SatelliteFarmView;