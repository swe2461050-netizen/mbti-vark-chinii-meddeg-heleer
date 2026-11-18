export function renderNavbar(language, activePath, labels) {
  const links = [
    ["home", labels.home],
    ["test", labels.test],
    ["types", labels.types]
  ];
  return '<header class="site-header"><a class="brand" href="#/home" aria-label="' + labels.home + '">' +
    '<span class="brand-mark">T</span><span>' + labels.brand + '</span></a>' +
    '<nav class="main-nav" aria-label="Main navigation">' +
      links.map(([path, label]) => '<a href="#/' + path + '" class="' + (activePath === path ? "active" : "") + '">' + label + '</a>').join("") +
    '</nav>' +
    '<button class="language-toggle" type="button" data-language="' + (language === "mn" ? "en" : "mn") + '">' + labels.language + '</button>' +
  '</header>';
}
