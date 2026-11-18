import { t } from "../i18n/i18n.js";
import { escapeHtml } from "../fn/safeHtml.js";

const DIMENSIONS = [["EI", "E", "I"], ["SN", "S", "N"], ["TF", "T", "F"], ["JP", "J", "P"]];

function loadResult() {
  try { return JSON.parse(sessionStorage.getItem("mbti-spa-result") || "null"); }
  catch { return null; }
}

export function renderResultPage(types, language) {
  const result = loadResult();
  if (!result?.code) {
    return '<section class="empty-result"><div class="empty-mark">?</div><h1>' + t("result.noResult", language) + '</h1><a class="button button-primary" href="#/test">' + t("home.start", language) + ' →</a></section>';
  }
  const profile = types.find((item) => item.type === result.code);
  const meta = t("typesMn." + result.code, language);
  const title = profile?.epithet || (Array.isArray(meta) ? meta[0] : result.code);
  const summary = profile?.summary || (Array.isArray(meta) ? meta[1] : profile?.name || "");
  const bars = DIMENSIONS.map(([key, first, second]) => {
    const score = result.strength[key];
    const firstValue = score.firstCount;
    const secondValue = score.secondCount;
    const total = Math.max(1, firstValue + secondValue);
    const fill = Math.round(firstValue / total * 100);
    return '<article class="dimension-row"><div class="dimension-heading"><strong>' + t("dimensionNames." + key, language) + '</strong>' +
      '<span>' + first + ' ' + firstValue + ' — ' + secondValue + ' ' + second + '</span></div>' +
      '<div class="dimension-track"><span style="width:' + fill + '%"></span></div>' +
      '<div class="dimension-ends"><span>' + first + '</span><span>' + second + '</span></div></article>';
  }).join("");
  const profileText = profile?.description ? '<details class="source-detail"><summary>' + t("result.profile", language) + '</summary>' +
    '<p class="source-note">' + t("result.profileNote", language) + '</p><p class="source-description">' + escapeHtml(profile.description) + '</p></details>' : "";
  const studyTips = result.code.split("").map((letter) => '<li>' + t("result.studyTips." + letter, language) + '</li>').join("");
  return '<section class="result-heading"><p class="eyebrow">' + t("result.eyebrow", language) + '</p><h1>' + t("result.title", language) + '</h1><p>' + t("result.lead", language) + '</p></section>' +
    '<section class="result-card"><div class="result-art"><img src="./assets/icons/' + result.code.toLowerCase() + '.svg" alt="' + result.code + '"></div>' +
    '<div class="result-main"><p class="eyebrow">' + t("result.primary", language) + '</p><div class="result-code">' + result.code + '</div>' +
    '<h2>' + escapeHtml(title) + '</h2><p>' + escapeHtml(summary) + '</p></div></section>' +
    '<section class="dimension-panel"><div class="section-heading"><p class="eyebrow">01 / MBTI</p><h2>' + t("result.dimensions", language) + '</h2></div>' + bars + '</section>' +
    '<section class="study-note"><span class="note-icon">✳</span><div><h2>' + t("result.study", language) + '</h2><p>' + t("result.studyText", language) + '</p><ul class="study-tips">' + studyTips + '</ul></div></section>' +
    profileText +
    '<div class="result-actions"><a class="button button-primary" href="#/test" data-retake="true">' + t("result.retake", language) + ' ↗</a><a class="button button-quiet" href="#/types">' + t("result.catalog", language) + '</a></div>';
}
