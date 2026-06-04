import { useState } from "react";
import toast from "react-hot-toast";
import FarmerLayout from "../../components/common/FarmerLayout";
import API from "../../services/api";

const WeatherCenter = () => {
  const [city, setCity] = useState("Bhopal");
  const [weather, setWeather] = useState(null);
  const [advice, setAdvice] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.get(`/weather/current?city=${city}`);

      setWeather(res.data.weather);
      setAdvice(res.data.advice || []);

      toast.success("Weather fetched successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FarmerLayout title="Weather Center">
      <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-green-950">
          Weather Intelligence Center
        </h1>

        <p className="mt-2 text-gray-600">
          Check current weather and farming advice for your city.
        </p>

        <form onSubmit={fetchWeather} className="mt-6 flex flex-col gap-4 md:flex-row">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city e.g. Bhopal"
            className="flex-1 rounded-xl border px-4 py-3 outline-none focus:border-green-600"
            required
          />

          <button
            disabled={loading}
            className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
          >
            {loading ? "Fetching..." : "Fetch Weather"}
          </button>
        </form>
      </div>

      {weather && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <h2 className="text-2xl font-bold text-green-950">
                  {weather.city}, {weather.country}
                </h2>
                <p className="mt-1 capitalize text-gray-600">
                  {weather.condition}
                </p>
              </div>

              <div className="rounded-3xl bg-green-50 px-6 py-4 text-center">
                <p className="text-sm font-semibold text-green-700">
                  Temperature
                </p>
                <p className="text-4xl font-bold text-green-900">
                  {weather.temperature}°C
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Feels Like</p>
                <p className="mt-1 text-xl font-bold text-green-950">
                  {weather.feelsLike}°C
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Humidity</p>
                <p className="mt-1 text-xl font-bold text-green-950">
                  {weather.humidity}%
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Pressure</p>
                <p className="mt-1 text-xl font-bold text-green-950">
                  {weather.pressure} hPa
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Wind Speed</p>
                <p className="mt-1 text-xl font-bold text-green-950">
                  {weather.windSpeed} m/s
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5 md:col-span-2">
                <p className="text-sm text-gray-500">Coordinates</p>
                <p className="mt-1 text-xl font-bold text-green-950">
                  {weather.coordinates?.latitude}, {weather.coordinates?.longitude}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-green-950">
              Farming Advice
            </h2>

            {advice.length === 0 ? (
              <p className="mt-4 text-gray-500">No advice available.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {advice.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-yellow-50 p-4 text-sm font-medium leading-6 text-yellow-900"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </FarmerLayout>
  );
};

export default WeatherCenter;