document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-action='demo']").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("SiteSafe: thao tác demo đã được kích hoạt.");
    });
  });
});
