import { useState } from "react";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const FarmerLayout = ({ title, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f7faf5]">
      <Sidebar />

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-4 top-4 rounded-xl bg-green-50 p-2 text-green-800"
            >
              <X size={20} />
            </button>

            <Sidebar mobile onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />

        <section className="p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default FarmerLayout;