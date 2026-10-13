document.addEventListener("DOMContentLoaded", () => {
  const tabs = [...document.querySelectorAll(".tab-btn")];
  const listPanel = document.getElementById("danh-sach");
  const detailsGrid = document.querySelector(".grid-2-col");
  const searchInput = document.getElementById("search-input");
  const statusFilter = document.getElementById("status-filter");
  const rows = [...document.querySelectorAll("#danh-sach tbody tr")];
  const emptyState = document.querySelector(".empty-state");
  const toast = document.getElementById("toast");
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3200);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const showSchedule = tab.dataset.target === "lich-tuan";

      tabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", String(isActive));
        item.tabIndex = isActive ? 0 : -1;
      });

      if (listPanel) listPanel.hidden = showSchedule;
      if (detailsGrid) detailsGrid.classList.toggle("schedule-focus", showSchedule);
    });

    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const currentIndex = tabs.indexOf(tab);
      const nextIndex = event.key === "ArrowRight"
        ? (currentIndex + 1) % tabs.length
        : (currentIndex - 1 + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    });
  });

  const filterRows = () => {
    const query = searchInput?.value.trim().toLocaleLowerCase("vi") ?? "";
    const status = statusFilter?.value ?? "all";
    let visibleCount = 0;

    rows.forEach((row) => {
      const matchesQuery = row.textContent.toLocaleLowerCase("vi").includes(query);
      const badge = row.querySelector(".status-badge");
      const matchesStatus = status === "all" || badge?.classList.contains(status);
      const isVisible = matchesQuery && matchesStatus;
      row.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount > 0;
  };

  searchInput?.addEventListener("input", filterRows);
  statusFilter?.addEventListener("change", filterRows);

  document.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.scrollTarget);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      target?.querySelector("input, select")?.focus({ preventScroll: true });
    });
  });

  const sidebar = document.getElementById("sidebar");
  const menuButton = document.querySelector(".mobile-menu-btn");
  menuButton?.addEventListener("click", () => {
    const isOpen = sidebar?.classList.toggle("is-open") ?? false;
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng",
    );
  });

  document.querySelectorAll(".menu-item").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar?.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelector(".icon-btn")?.addEventListener("click", () => {
    showToast("Thông báo chưa được kết nối với máy chủ.");
  });

  document.querySelectorAll(".btn-primary").forEach((button) => {
    if (button.hasAttribute("data-scroll-target")) return;
    button.addEventListener("click", () => {
      showToast(`Chức năng "${button.textContent.trim()}" chưa được kết nối với máy chủ.`);
    });
  });

  document.querySelectorAll(".btn-outline").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(`Chức năng "${button.textContent.trim()}" chưa được kết nối với máy chủ.`);
    });
  });

  document.querySelectorAll(".action-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast(`Chức năng "${link.textContent.trim()}" chưa được kết nối với máy chủ.`);
    });
  });
});
