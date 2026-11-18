import { translations } from "./translations.js";

const LANGUAGE_KEY = "mbti-spa-language";

export function getLanguage() {
  const value = localStorage.getItem(LANGUAGE_KEY);
  return value === "en" ? "en" : "mn";
}

export function setLanguage(language) {
  localStorage.setItem(LANGUAGE_KEY, language === "en" ? "en" : "mn");
  document.documentElement.lang = language === "en" ? "en" : "mn";
}

export function t(key, language = getLanguage()) {
  return key.split(".").reduce((value, part) => value?.[part], translations[language]) ?? key;
}
