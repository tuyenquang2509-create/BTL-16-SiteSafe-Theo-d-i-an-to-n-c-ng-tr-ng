const SiteSafeAPI = {
  async get(resource) {
    const response = await fetch(`../../assets/data/${resource}.json`);
    if (!response.ok) throw new Error("Không thể tải dữ liệu");
    return response.json();
  }
};
