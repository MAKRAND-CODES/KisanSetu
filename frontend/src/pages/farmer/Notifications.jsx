import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FarmerLayout from "../../components/common/FarmerLayout";
import API from "../../services/api";

const priorityStyle = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const typeStyle = {
  weather: "Weather",
  market: "Market",
  insurance: "Insurance",
  scheme: "Scheme",
  satellite: "Satellite",
  disease: "Disease",
  system: "System",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications/my");
      setNotifications(res.data.notifications || []);
    } catch {
      toast.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      toast.success("Marked as read");
      fetchNotifications();
    } catch {
      toast.error("Failed to update notification");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      toast.success("Notification deleted");
      fetchNotifications();
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <FarmerLayout title="Notifications">
      <div className="mb-6 rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-green-950">
          Smart Notification Center
        </h1>
        <p className="mt-2 text-gray-600">
          View important alerts about satellite reports, market prices,
          insurance, schemes and system updates.
        </p>

        <div className="mt-4 inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
          {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-green-100 bg-white p-6 text-gray-500 shadow-sm">
            No notifications yet.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item._id}
              className={`rounded-3xl border p-6 shadow-sm ${
                item.isRead
                  ? "border-gray-100 bg-white"
                  : "border-green-200 bg-green-50/70"
              }`}
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                      {typeStyle[item.type] || item.type}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        priorityStyle[item.priority] || priorityStyle.medium
                      }`}
                    >
                      {item.priority}
                    </span>

                    {!item.isRead && (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                        Unread
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-green-950">
                    {item.title}
                  </h2>

                  <p className="mt-2 leading-6 text-gray-600">
                    {item.message}
                  </p>

                  <p className="mt-3 text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!item.isRead && (
                    <button
                      onClick={() => markRead(item._id)}
                      className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                    >
                      Mark Read
                    </button>
                  )}

                  <button
                    onClick={() => deleteNotification(item._id)}
                    className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </FarmerLayout>
  );
};

export default Notifications;