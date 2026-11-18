export function renderPageLayout({ title, eyebrow = "", content, className = "" }) {
  return '<main class="page-wrap ' + className + '">' +
      (title || eyebrow ? '<div class="page-heading">' +
        (eyebrow ? '<p class="eyebrow">' + eyebrow + '</p>' : "") +
        '<h1>' + title + '</h1></div>' : "") +
    content +
  '</main>';
}
