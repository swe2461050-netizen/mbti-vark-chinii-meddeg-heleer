export function navigate(path) {
  const cleanPath = String(path || "").replace(/^#?\/?/, "");
  window.location.hash = "/" + cleanPath;
}

export function startRouter(onRoute) {
  const resolve = () => {
    const raw = window.location.hash.replace(/^#\/?/, "");
    const path = decodeURIComponent(raw).split("?")[0].replace(/\/+$/, "");
    onRoute(path || "home");
  };
  window.addEventListener("hashchange", resolve);
  resolve();
}
