import { t } from "../i18n/i18n.js";

export function renderNotFoundPage(language) {
  return '<section class="empty-result"><div class="empty-mark">404</div><h1>' +
    (language === "mn" ? "Хуудас олдсонгүй" : "Page not found") +
    '</h1><a class="button button-primary" href="#/home">' + t("nav.home", language) + ' →</a></section>';
}
