export function injectScript(file) {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file);

  document.head.appendChild(script);
}
