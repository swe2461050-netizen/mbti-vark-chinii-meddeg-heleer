import { t } from "../i18n/i18n.js";
import { escapeHtml, listMarkup } from "../fn/safeHtml.js";

export function renderTypePage(code, types, language) {
  const profile = types.find((item) => item.type === code);
  if (!profile) return '<section class="empty-state"><a href="#/types">← ' + t("types.back", language) + '</a></section>';
  const meta = t("typesMn." + code, language);
  const title = profile.epithet || (Array.isArray(meta) ? meta[0] : code);
  const summary = profile.summary || (Array.isArray(meta) ? meta[1] : profile.name);
  const detail = (label, value, className) => {
    if (!value) return "";
    const content = Array.isArray(value) ? '<ul>' + listMarkup(value.slice(0, 5)) + '</ul>' : '<p>' + escapeHtml(value) + '</p>';
    return '<section class="detail-card ' + (className || "") + '"><h2>' + label + '</h2>' + content + '</section>';
  };
  return '<a class="back-link" href="#/types">← ' + t("types.back", language) + '</a>' +
    '<section class="profile-hero"><img src="./assets/icons/' + code.toLowerCase() + '.svg" alt="' + code + ' icon">' +
    '<div><p class="eyebrow">MBTI · ' + code + '</p><h1>' + escapeHtml(title) + '</h1><p class="profile-summary">' + escapeHtml(summary) + '</p></div></section>' +
    '<div class="details-grid">' +
      detail(t("types.trait", language), profile.generalTraits, "wide") +
      detail(t("types.strengths", language), profile.strengths) +
      detail(t("types.challenges", language), profile.potentialProblemAreas) +
      detail(t("types.tips", language), profile.livingHappilyTips, "wide") +
    '</div><details class="source-detail"><summary>' + t("result.profile", language) + ' (' + escapeHtml(profile.name) + ')</summary>' +
    '<p class="source-description">' + escapeHtml(profile.description) + '</p></details>';
}
