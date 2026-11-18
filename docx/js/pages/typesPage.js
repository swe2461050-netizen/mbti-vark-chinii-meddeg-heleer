import { t } from "../i18n/i18n.js";
import { escapeHtml } from "../fn/safeHtml.js";

function metaFor(code, language) {
  return t("typesMn." + code, language);
}

function card(type, language) {
  const meta = metaFor(type.type, language);
  const title = type.epithet || (Array.isArray(meta) ? meta[0] : type.type);
  const summary = type.summary || (Array.isArray(meta) ? meta[1] : type.name);
  return '<a class="type-card" href="#/types/' + type.type + '" data-search="' +
    escapeHtml((type.type + " " + title + " " + summary).toLowerCase()) + '">' +
    '<img src="./assets/icons/' + type.type.toLowerCase() + '.svg" alt="" loading="lazy">' +
    '<span class="type-code">' + type.type + '</span><strong>' + escapeHtml(title) + '</strong>' +
    '<p>' + escapeHtml(summary) + '</p><span class="card-arrow" aria-hidden="true">↗</span></a>';
}

export function renderTypesPage(types, language) {
  return '<section class="types-intro"><p class="eyebrow">' + t("types.eyebrow", language) + '</p>' +
    '<h1>' + t("types.title", language) + '</h1><p>' + t("types.lead", language) + '</p>' +
    '<label class="type-search"><span aria-hidden="true">⌕</span><input id="typeSearch" type="search" placeholder="' + t("types.search", language) + '"></label></section>' +
    '<div id="typeGrid" class="type-grid">' + types.map((type) => card(type, language)).join("") + '</div>' +
    '<p id="typeEmpty" class="empty-state" hidden>' + t("types.none", language) + '</p>';
}

export function mountTypesPage() {
  const input = document.getElementById("typeSearch");
  if (!input) return;
  input.addEventListener("input", () => {
    const query = input.value.trim().toLocaleLowerCase();
    let visible = 0;
    document.querySelectorAll(".type-card").forEach((item) => {
      const show = item.dataset.search.includes(query);
      item.hidden = !show;
      if (show) visible += 1;
    });
    document.getElementById("typeEmpty").hidden = visible > 0;
  });
}
