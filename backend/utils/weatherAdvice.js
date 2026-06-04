export const generateWeatherAdvice = (weather) => {
  const advice = [];

  const temp = weather.temperature;
  const humidity = weather.humidity;
  const windSpeed = weather.windSpeed;
  const condition = weather.condition.toLowerCase();

  if (condition.includes("rain")) {
    advice.push("Rain expected. Avoid pesticide spraying for next 24 hours.");
    advice.push("Check field drainage to avoid waterlogging.");
  }

  if (temp > 35) {
    advice.push("High temperature alert. Irrigate crops early morning or evening.");
  }

  if (temp < 10) {
    advice.push("Low temperature alert. Protect sensitive crops from cold stress.");
  }

  if (humidity > 80) {
    advice.push("High humidity may increase fungal disease risk. Monitor crop leaves.");
  }

  if (windSpeed > 8) {
    advice.push("High wind speed. Avoid fertilizer and pesticide spraying.");
  }

  if (advice.length === 0) {
    advice.push("Weather looks normal. Continue regular crop monitoring.");
  }

  return advice;
};