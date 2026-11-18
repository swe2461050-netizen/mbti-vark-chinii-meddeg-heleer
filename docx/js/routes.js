import { renderHomePage } from "./pages/homePage.js";
import { mountTestPage, renderTestPage } from "./pages/testPage.js";
import { mountTypesPage, renderTypesPage } from "./pages/typesPage.js";
import { renderTypePage } from "./pages/typePage.js";
import { renderResultPage } from "./pages/resultPage.js";
import { renderNotFoundPage } from "./pages/notFoundPage.js";

export function resolveRoute(path, context) {
  const types = context.data.types[context.language] || context.data.types.en;
  if (path === "home") return { titleKey: "nav.home", render: () => renderHomePage(context.language) };
  if (path === "test") return { titleKey: "nav.test", render: () => renderTestPage(context.language), mount: () => mountTestPage(context) };
  if (path === "types") return { titleKey: "nav.types", render: () => renderTypesPage(types, context.language), mount: () => mountTypesPage(context) };
  if (path === "result") return { titleKey: "result.title", render: () => renderResultPage(types, context.language) };
  const match = path.match(/^types\/([A-Z]{4})$/);
  if (match) return { titleKey: "nav.types", render: () => renderTypePage(match[1], types, context.language) };
  return { titleKey: "notFound", render: () => renderNotFoundPage(context.language) };
}
