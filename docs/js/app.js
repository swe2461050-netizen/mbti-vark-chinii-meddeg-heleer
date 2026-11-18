import { startRouter } from "./router.js";
import { resolveRoute } from "./routes.js";
import { renderNavbar } from "./components/navbar.js";
import { renderPageLayout } from "./layouts/pageLayout.js";
import { getLanguage, setLanguage, t } from "./i18n/i18n.js";
import { loadMbtiData } from "./data/mbtiData.js";

const root = document.getElementById("app");

async function start() {
  try {
    const data = await loadMbtiData();
    setLanguage(getLanguage());
    startRouter((path) => renderRoute(path, data));
    root.addEventListener("click", (event) => {
      const button = event.target.closest("[data-language]");
      const retake = event.target.closest("[data-retake]");
      if (retake) {
        sessionStorage.removeItem("mbti-spa-answers");
        sessionStorage.removeItem("mbti-spa-test-page");
        sessionStorage.removeItem("mbti-spa-result");
        return;
      }
      if (!button) return;
      setLanguage(button.dataset.language);
      const path = window.location.hash.replace(/^#\/?/, "") || "home";
      renderRoute(path, data);
    });
  } catch (error) {
    root.innerHTML = '<main class="load-error"><p>Өгөгдөл ачаалж чадсангүй.</p><p>' + String(error.message || error) + '</p></main>';
  }
}

function renderRoute(path, data) {
  const language = getLanguage();
  const route = resolveRoute(path, { data, language });
  const content = route.render();
  const isLanding = path === "home";
  const page = isLanding ? content : renderPageLayout({ content });
  root.innerHTML = renderNavbar(language, path.split("/")[0], {
    home: t("nav.home", language), test: t("nav.test", language), types: t("nav.types", language),
    brand: t("brand", language), language: t("language", language)
  }) + page + '<footer class="site-footer"><span>' + t("footer", language) + '</span><a href="#/home">↑</a></footer>';
  if (route.mount) route.mount({ data, language });
  document.title = (path === "home" ? "Өөрийгөө таних MBTI" : "MBTI · " + t(route.titleKey, language));
}

start();
