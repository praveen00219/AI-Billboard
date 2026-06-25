export function normalizeReports(reports) {
  return reports.map((r) => {
    let lat = r.latitude;
    let lng = r.longitude;

    if ((!lat || !lng) && r.location && r.location.includes(",")) {
      const parts = r.location.split(",").map((p) => p.trim());
      if (parts.length === 2) {
        lat = parts[0];
        lng = parts[1];
      }
    }

    let risk_level = "low";
    if (r.status === "rejected") risk_level = "medium";
    if (r.status === "critical") risk_level = "high"; 

    return {
      id: r.id,
      citizenId: r.citizenId,
      title: r.title,
      category: r.category,
      description: r.description,
      status: r.status,
      risk_level,
      date: r.date,
      createdAt: r.createdAt,
      latitude: lat ? parseFloat(lat) : null,
      longitude: lng ? parseFloat(lng) : null,
    };
  });
}
