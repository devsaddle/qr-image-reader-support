(() => {
  const key = "qr-image-reader-support.locale";
  const links = new Map(
    Array.from(document.querySelectorAll(".language-nav a[hreflang]"), link => [link.hreflang, link])
  );
  const automatic = document.querySelector("[data-language-auto]");
  automatic.hidden = false;

  for (const [language, link] of links) {
    link.addEventListener("click", () => {
      try { localStorage.setItem(key, language); } catch { /* The link still works. */ }
    });
  }

  // Links with a language directory always keep their selected language.
  if (document.documentElement.lang !== "zh-CN") return;
  const current = new URL(location.href);
  const mode = current.searchParams.get("lang");
  if (mode === "zh-CN") return;

  let saved;
  try {
    if (mode === "auto") localStorage.removeItem(key);
    else saved = localStorage.getItem(key);
  } catch { /* Use the browser language if storage is unavailable. */ }

  function match(tag) {
    const [language, ...subtags] = tag.toLowerCase().split("-");
    if (language === "en") return "en";
    if (language !== "zh") return undefined;
    if (subtags.includes("hans")) return "zh-CN";
    if (subtags.includes("hant") || ["tw", "hk", "mo"].includes(subtags[0])) return "zh-TW";
    return "zh-CN";
  }

  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language || ""];
  const selected = links.has(saved) ? saved : preferred.map(match).find(Boolean) || "en";
  current.searchParams.delete("lang");
  if (selected === "zh-CN") {
    if (mode === "auto") history.replaceState(null, "", current);
    return;
  }

  const target = new URL(links.get(selected).href);
  target.search = current.search;
  target.hash = current.hash;
  location.replace(target);
})();
