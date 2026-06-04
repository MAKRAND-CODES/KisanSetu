const toRadians = (degrees) => (degrees * Math.PI) / 180;

const calculateDistance = (point1, point2) => {
  const earthRadius = 6371000;

  const lat1 = toRadians(point1.latitude);
  const lat2 = toRadians(point2.latitude);
  const deltaLat = toRadians(point2.latitude - point1.latitude);
  const deltaLon = toRadians(point2.longitude - point1.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

export const calculatePolygonArea = (coordinates) => {
  if (!coordinates || coordinates.length < 3) {
    return { squareMeters: 0, acres: 0, hectares: 0 };
  }

  let area = 0;

  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length;

    area +=
      toRadians(coordinates[j].longitude - coordinates[i].longitude) *
      (2 +
        Math.sin(toRadians(coordinates[i].latitude)) +
        Math.sin(toRadians(coordinates[j].latitude)));
  }

  area = Math.abs((area * 6371000 * 6371000) / 2);

  return {
    squareMeters: Number(area.toFixed(2)),
    acres: Number((area / 4046.8564224).toFixed(2)),
    hectares: Number((area / 10000).toFixed(2)),
  };
};

export const calculateBoundaryLength = (coordinates) => {
  if (!coordinates || coordinates.length < 2) return 0;

  let total = 0;

  for (let i = 0; i < coordinates.length; i++) {
    const nextIndex = (i + 1) % coordinates.length;
    total += calculateDistance(coordinates[i], coordinates[nextIndex]);
  }

  return Number(total.toFixed(2));
};

export const getBoundingBox = (coordinates) => {
  const lats = coordinates.map((point) => point.latitude);
  const lngs = coordinates.map((point) => point.longitude);

  return {
    minLon: Math.min(...lngs),
    minLat: Math.min(...lats),
    maxLon: Math.max(...lngs),
    maxLat: Math.max(...lats),
  };
};

export const convertToGeoJsonPolygon = (coordinates) => {
  const polygon = coordinates.map((point) => [
    point.longitude,
    point.latitude,
  ]);

  const first = polygon[0];
  const last = polygon[polygon.length - 1];

  if (first[0] !== last[0] || first[1] !== last[1]) {
    polygon.push(first);
  }

  return {
    type: "Polygon",
    coordinates: [polygon],
  };
};