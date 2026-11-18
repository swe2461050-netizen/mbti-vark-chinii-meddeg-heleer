import { t } from "../i18n/i18n.js";

export function renderHomePage(language) {
  return '<main><section class="hero-panel">' +
    '<div class="hero-copy"><p class="eyebrow">' + t("home.eyebrow", language) + '</p>' +
    '<h1>' + t("home.title", language) + '</h1><p class="hero-lead">' + t("home.lead", language) + '</p>' +
    '<div class="hero-actions"><a class="button button-primary" href="#/test">' + t("home.start", language) + '<span aria-hidden="true">↗</span></a>' +
    '<a class="button button-quiet" href="#/types">' + t("home.browse", language) + '</a></div></div>' +
    '<div class="hero-art"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>' +
    '<div class="type-sigil">EI<span>·</span>SN<span>·</span>TF<span>·</span>JP</div><div class="hero-stamp">16<br><small>patterns</small></div></div>' +
    '<div class="hero-stats"><div><strong>70</strong><span>' + t("home.statQuestions", language) + '</span></div>' +
    '<div><strong>16</strong><span>' + t("home.statTypes", language) + '</span></div><p>' + (language === "mn" ? "Хариулт бүр өөрийн тухай нэг шинэ асуулт." : "Every answer is another question about you.") + '</p></div></section>' +
    '<section class="steps-section"><div class="section-heading"><p class="eyebrow">' + (language === "mn" ? "ЭНГИЙН ГУРВАН АЛХАМ" : "THREE SIMPLE STEPS") + '</p><h2>' + t("home.howTitle", language) + '</h2></div>' +
    '<div class="steps-grid">' +
      stepCard("01", t("home.howOneTitle", language), t("home.howOne", language)) +
      stepCard("02", t("home.howTwoTitle", language), t("home.howTwo", language)) +
      stepCard("03", t("home.howThreeTitle", language), t("home.howThree", language)) +
    '</div></section>' +
    '<aside class="note-panel"><span class="note-icon">i</span><div><h2>' + t("home.noteTitle", language) + '</h2><p>' + t("home.note", language) + '</p></div></aside></main>';
}

function stepCard(number, title, description) {
  return '<article class="step-card"><span class="step-number">' + number + '</span><h3>' + title + '</h3><p>' + description + '</p></article>';
}
