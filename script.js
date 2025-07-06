let script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/gh/roman-smolnyk/js-ytils@v0.1.4/ytils.min.js";
script.onload = function () {
  console.log("Script loaded! You can now use the classes from ytils");
  console.log(Log._MAP);
};
document.head.appendChild(script);
