import { useState } from "react";
import toast from "react-hot-toast";
import FarmerLayout from "../../components/common/FarmerLayout";
import API from "../../services/api";

const MarketPrices = () => {
  const [crop, setCrop] = useState("Soyabean");
  const [state, setState] = useState("Madhya Pradesh");
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrices = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.get(
        `/market/real?crop=${crop}&state=${state}&limit=20`
      );

      setPrices(res.data.prices || []);
      toast.success("Live mandi prices fetched");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch prices");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FarmerLayout title="Market Prices">
      <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-green-950">
          Real Mandi Prices
        </h1>
        <p className="mt-2 text-gray-600">
          Live AGMARKNET mandi prices from data.gov.in.
        </p>

        <form onSubmit={fetchPrices} className="mt-6 grid gap-4 md:grid-cols-3">
          <input
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="Crop e.g. Soyabean"
            className="rounded-xl border px-4 py-3 outline-none focus:border-green-600"
            required
          />

          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State e.g. Madhya Pradesh"
            className="rounded-xl border px-4 py-3 outline-none focus:border-green-600"
          />

          <button
            disabled={loading}
            className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
          >
            {loading ? "Fetching..." : "Fetch Prices"}
          </button>
        </form>
      </div>

      <div className="mt-6 rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-green-950">
          Price Results
        </h2>

        {prices.length === 0 ? (
          <p className="text-gray-500">No prices loaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead>
                <tr className="border-b bg-green-50 text-sm text-green-900">
                  <th className="px-4 py-3">Market</th>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">Commodity</th>
                  <th className="px-4 py-3">Variety</th>
                  <th className="px-4 py-3">Min Price</th>
                  <th className="px-4 py-3">Max Price</th>
                  <th className="px-4 py-3">Modal Price</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {prices.map((item, index) => (
                  <tr key={index} className="border-b text-sm hover:bg-green-50/50">
                    <td className="px-4 py-3 font-semibold text-green-900">
                      {item.market}
                    </td>
                    <td className="px-4 py-3">{item.district}</td>
                    <td className="px-4 py-3">{item.commodity}</td>
                    <td className="px-4 py-3">{item.variety || "N/A"}</td>
                    <td className="px-4 py-3">₹{item.minPrice}</td>
                    <td className="px-4 py-3">₹{item.maxPrice}</td>
                    <td className="px-4 py-3 font-bold text-green-800">
                      ₹{item.modalPrice}
                    </td>
                    <td className="px-4 py-3">{item.arrivalDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </FarmerLayout>
  );
};

export default MarketPrices;