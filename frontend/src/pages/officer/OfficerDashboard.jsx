import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import useAuth from "../../hooks/useAuth";

const statusStyle = {
  pending: "bg-yellow-100 text-yellow-800",
  under_review: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  compensation_released: "bg-purple-100 text-purple-800",
};

const OfficerDashboard = () => {
  const { user, logout } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data.complaints || []);
    } catch {
      toast.error("Failed to fetch complaints");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateComplaint = async (id, status) => {
    const officerRemarks =
      status === "approved"
        ? "Damage verified. Compensation approved."
        : status === "rejected"
        ? "Complaint rejected after verification."
        : "Complaint is under review.";

    const approvedAmount = status === "approved" ? 18000 : 0;

    try {
      setUpdatingId(id);

      await API.put(`/complaints/${id}/status`, {
        status,
        officerRemarks,
        approvedAmount,
      });

      toast.success("Complaint updated");
      fetchComplaints();
    } catch {
      toast.error("Failed to update complaint");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf5] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-green-950">
              Officer Dashboard
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

        <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-green-950">
            Crop Damage Complaints
          </h2>

          {complaints.length === 0 ? (
            <p className="text-gray-500">No complaints found.</p>
          ) : (
            <div className="space-y-4">
              {complaints.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-green-100 p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <h3 className="text-lg font-bold text-green-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Farmer: {item.farmer?.name} • Phone:{" "}
                        {item.farmer?.phone}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Farm: {item.farm?.farmName} • {item.farm?.village},{" "}
                        {item.farm?.district}
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

                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>

                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
                    <p>
                      <b>Damage Type:</b> {item.damageType}
                    </p>
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
                      <b>Remarks:</b> {item.officerRemarks}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      disabled={updatingId === item._id}
                      onClick={() => updateComplaint(item._id, "under_review")}
                      className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-60"
                    >
                      Under Review
                    </button>

                    <button
                      disabled={updatingId === item._id}
                      onClick={() => updateComplaint(item._id, "approved")}
                      className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
                    >
                      Approve
                    </button>

                    <button
                      disabled={updatingId === item._id}
                      onClick={() => updateComplaint(item._id, "rejected")}
                      className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
                    >
                      Reject
                    </button>

                    <button
                      disabled={updatingId === item._id}
                      onClick={() =>
                        updateComplaint(item._id, "compensation_released")
                      }
                      className="rounded-xl bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100 disabled:opacity-60"
                    >
                      Release Compensation
                    </button>
                  </div>

                  <p className="mt-4 text-xs text-gray-400">
                    Submitted on {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;