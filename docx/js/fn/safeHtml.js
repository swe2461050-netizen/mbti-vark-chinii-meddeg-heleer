export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

export function listMarkup(value) {
  const items = Array.isArray(value) ? value : value ? [value] : [];
  return items.map((item) => "<li>" + escapeHtml(item) + "</li>").join("");
}
