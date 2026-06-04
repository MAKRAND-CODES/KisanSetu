import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import useAuth from "../../hooks/useAuth";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [schemes, setSchemes] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [insurance, setInsurance] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "income_support",
    benefitAmount: "",
    minLandArea: "0",
  });

  const fetchData = async () => {
    try {
      const [schemesRes, complaintsRes, insuranceRes] = await Promise.all([
        API.get("/schemes"),
        API.get("/complaints"),
        API.get("/insurance"),
      ]);

      setSchemes(schemesRes.data.schemes || []);
      setComplaints(complaintsRes.data.complaints || []);
      setInsurance(insuranceRes.data.insurance || []);
    } catch {
      toast.error("Failed to load admin data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createScheme = async (e) => {
    e.preventDefault();

    try {
      await API.post("/schemes", {
        title: form.title,
        description: form.description,
        category: form.category,
        benefitAmount: Number(form.benefitAmount || 0),
        eligibility: {
          minLandArea: Number(form.minLandArea || 0),
          states: [],
        },
      });

      toast.success("Scheme created");

      setForm({
        title: "",
        description: "",
        category: "income_support",
        benefitAmount: "",
        minLandArea: "0",
      });

      fetchData();
    } catch {
      toast.error("Failed to create scheme");
    }
  };

  const deleteScheme = async (id) => {
    try {
      await API.delete(`/schemes/${id}`);
      toast.success("Scheme deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete scheme");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf5] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-green-950">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl bg-red-50 px-4 py-2 font-semibold text-red-600"
          >
            Logout
          </button>
        </div>

        <div className="mb-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Schemes</p>
            <h2 className="mt-2 text-3xl font-bold text-green-900">
              {schemes.length}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Complaints</p>
            <h2 className="mt-2 text-3xl font-bold text-green-900">
              {complaints.length}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Insurance Records</p>
            <h2 className="mt-2 text-3xl font-bold text-green-900">
              {insurance.length}
            </h2>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <form
            onSubmit={createScheme}
            className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-green-950">
              Create Government Scheme
            </h2>

            <div className="mt-6 space-y-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Scheme Title"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
                required
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Scheme Description"
                className="min-h-28 w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
                required
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
              >
                <option value="income_support">Income Support</option>
                <option value="insurance">Insurance</option>
                <option value="credit">Credit</option>
                <option value="soil">Soil</option>
                <option value="subsidy">Subsidy</option>
                <option value="other">Other</option>
              </select>

              <input
                type="number"
                name="benefitAmount"
                value={form.benefitAmount}
                onChange={handleChange}
                placeholder="Benefit Amount"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
              />

              <input
                type="number"
                name="minLandArea"
                value={form.minLandArea}
                onChange={handleChange}
                placeholder="Minimum Land Area"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
              />

              <button className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800">
                Create Scheme
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-green-950">
              Manage Schemes
            </h2>

            {schemes.length === 0 ? (
              <p className="text-gray-500">No schemes found.</p>
            ) : (
              <div className="space-y-4">
                {schemes.map((scheme) => (
                  <div
                    key={scheme._id}
                    className="rounded-2xl border border-green-100 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-green-900">
                          {scheme.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {scheme.description}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          Category: {scheme.category} • Benefit: ₹
                          {scheme.benefitAmount || 0}
                        </p>
                      </div>

                      <button
                        onClick={() => deleteScheme(scheme._id)}
                        className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-green-950">
              Recent Complaints
            </h2>

            {complaints.slice(0, 5).map((item) => (
              <div key={item._id} className="mb-4 rounded-2xl border p-4">
                <h3 className="font-bold text-green-900">{item.title}</h3>
                <p className="text-sm text-gray-600">
                  Farmer: {item.farmer?.name} • Status: {item.status}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-green-950">
              Recent Insurance
            </h2>

            {insurance.slice(0, 5).map((item) => (
              <div key={item._id} className="mb-4 rounded-2xl border p-4">
                <h3 className="font-bold text-green-900">
                  {item.cropName} Insurance
                </h3>
                <p className="text-sm text-gray-600">
                  Policy: {item.policyNumber} • Status: {item.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;