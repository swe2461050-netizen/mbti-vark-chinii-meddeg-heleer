import { t } from "../i18n/i18n.js";
import { navigate } from "../router.js";
import { escapeHtml } from "../fn/safeHtml.js";

const ANSWERS_KEY = "mbti-spa-answers";
const PAGE_KEY = "mbti-spa-test-page";
const PAGE_SIZE = 7;
const DIMENSIONS = [["E", "I"], ["S", "N"], ["T", "F"], ["J", "P"]];

function readAnswers() {
  try { return JSON.parse(sessionStorage.getItem(ANSWERS_KEY) || "{}"); }
  catch { return {}; }
}

function scoreAnswers(questions, answers) {
  const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  questions.forEach((question) => {
    const letter = answers[question.no];
    const option = question.answerOptions.find((item) => item.type === letter);
    if (option && counts[option.score] !== undefined) counts[option.score] += 1;
  });
  let code = "";
  const strength = {};
  DIMENSIONS.forEach(([first, second]) => {
    const winner = counts[first] >= counts[second] ? first : second;
    code += winner;
    strength[first + second] = {
      first, second, firstCount: counts[first], secondCount: counts[second],
      winner, winnerPercent: Math.round(counts[winner] / Math.max(1, counts[first] + counts[second]) * 100)
    };
  });
  return { code, counts, strength, questionCount: questions.length, completedAt: new Date().toISOString() };
}

export function renderTestPage(language) {
  return '<section class="quiz-intro"><p class="eyebrow">' + t("test.eyebrow", language) + '</p>' +
    '<h1>' + t("test.title", language) + '</h1><p>' + t("test.lead", language) + '</p></section>' +
    '<section id="quizRoot" class="quiz-panel" aria-live="polite"></section>';
}

export function mountTestPage({ language, data }) {
  const root = document.getElementById("quizRoot");
  if (!root) return;
  const questions = data.questions[language] || data.questions.mn;
  const pageCount = Math.ceil(questions.length / PAGE_SIZE);
  let page = Math.min(Math.max(Number(sessionStorage.getItem(PAGE_KEY) || 0), 0), pageCount - 1);
  let answers = readAnswers();
  let message = "";

  function render() {
    const start = page * PAGE_SIZE;
    const slice = questions.slice(start, start + PAGE_SIZE);
    const answeredCount = Object.keys(answers).length;
    root.innerHTML =
      '<div class="quiz-topline"><span>' + t("test.step", language) + ' ' + (page + 1) + ' ' + t("test.of", language) + ' ' + pageCount + '</span>' +
      '<span>' + answeredCount + ' / ' + questions.length + ' ' + t("test.answered", language) + '</span></div>' +
      '<div class="progress-track"><span style="width:' + Math.round(answeredCount / questions.length * 100) + '%"></span></div>' +
      slice.map((question, offset) => {
        const number = start + offset + 1;
        return '<fieldset class="question-card" data-question="' + question.no + '">' +
          '<legend><span class="question-number">' + String(number).padStart(2, "0") + '</span>' +
          '<span>' + escapeHtml(question.question) + '</span></legend><div class="answer-options">' +
          question.answerOptions.map((option) => '<label class="answer-option ' + (answers[question.no] === option.type ? "is-selected" : "") + '">' +
            '<input class="quiz-answer" type="radio" name="q-' + question.no + '" value="' + escapeHtml(option.type) + '" ' +
            (answers[question.no] === option.type ? "checked" : "") + '><span>' + escapeHtml(option.answer) + '</span></label>').join("") +
          '</div></fieldset>';
      }).join("") +
      (message ? '<p class="quiz-message" role="alert">' + escapeHtml(message) + '</p>' : "") +
      '<div class="quiz-actions">' +
        '<button class="button button-quiet" type="button" data-action="previous" ' + (page === 0 ? "disabled" : "") + '>← ' + t("test.previous", language) + '</button>' +
        '<button class="text-button" type="button" data-action="restart">' + t("test.restart", language) + '</button>' +
        (page < pageCount - 1
          ? '<button class="button button-primary" type="button" data-action="next">' + t("test.next", language) + ' →</button>'
          : '<button class="button button-primary" type="button" data-action="finish">' + t("test.finish", language) + ' →</button>') +
      '</div>';
  }

  root.addEventListener("change", (event) => {
    const input = event.target.closest(".quiz-answer");
    if (!input) return;
    const questionNo = input.name.slice(2);
    answers[questionNo] = input.value;
    sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
    message = "";
    root.querySelectorAll('[data-question="' + questionNo + '"] .answer-option').forEach((label) => {
      label.classList.toggle("is-selected", label.contains(input));
    });
    const answeredCount = Object.keys(answers).length;
    const countLabel = root.querySelector(".quiz-topline span:last-child");
    const progress = root.querySelector(".progress-track span");
    if (countLabel) countLabel.textContent = answeredCount + " / " + questions.length + " " + t("test.answered", language);
    if (progress) progress.style.width = Math.round(answeredCount / questions.length * 100) + "%";
    root.querySelector(".quiz-message")?.remove();
  });

  root.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!action) return;
    if (action === "previous") page = Math.max(0, page - 1);
    if (action === "next" || action === "finish") {
      const start = page * PAGE_SIZE;
      const unanswered = questions.slice(start, start + PAGE_SIZE).filter((question) => !answers[question.no]);
      if (unanswered.length) {
        message = t("test.required", language);
        render();
        root.querySelector('[data-question="' + unanswered[0].no + '"]')?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (action === "next") page = Math.min(pageCount - 1, page + 1);
      else {
        const missing = questions.find((question) => !answers[question.no]);
        if (missing) {
          page = Math.floor((missing.no - 1) / PAGE_SIZE);
          message = t("test.incomplete", language);
          render();
          return;
        }
        sessionStorage.setItem("mbti-spa-result", JSON.stringify(scoreAnswers(questions, answers)));
        navigate("result");
        return;
      }
    }
    if (action === "restart") {
      answers = {};
      page = 0;
      message = "";
      sessionStorage.removeItem(ANSWERS_KEY);
      sessionStorage.removeItem("mbti-spa-result");
    }
    sessionStorage.setItem(PAGE_KEY, String(page));
    render();
    root.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  render();
}
