class Log {
  static ERROR_LEVEL = 0;
  static WARN_LEVEL = 1;
  static INFO_LEVEL = 2;
  static LOG_LEVEL = 3;
  static DEBUG_LEVEL = 4;
  static TRACE_LEVEL = 5;

  static _MAP = { 0: "error", 1: "warn", 2: "info", 3: "log", 4: "debug", 5: "trace" };

  constructor(level = Log.LOG_LEVEL, timestamp = false) {
    // Do not use object passing parametrs {...}
    this.CURRENT_LEVEL = level;
    this.TIMESTAMP = timestamp;
  }

  _stdout = (level, ...messages) => {
    if (level <= this.CURRENT_LEVEL) {
      if (this.TIMESTAMP) {
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        const timestamp = `${hours}:${minutes}:${seconds}`;

        console[Log._MAP[level]](timestamp, ...messages);
      } else {
        console[Log._MAP[level]](...messages);
      }
    }
  };

  error = (...messages) => {
    this._stdout(Log.ERROR_LEVEL, ...messages);
  };
  warn = (...messages) => {
    this._stdout(Log.WARN_LEVEL, ...messages);
  };
  info = (...messages) => {
    this._stdout(Log.INFO_LEVEL, ...messages);
  };
  log = (...messages) => {
    this._stdout(Log.INFO_LEVEL, ...messages);
  };
  debug = (...messages) => {
    this._stdout(Log.DEBUG_LEVEL, ...messages);
  };
  trace = (...messages) => {
    this._stdout(Log.TRACE_LEVEL, ...messages);
  };
  // For cases when you want to mute logs but leave code
  // When using code in console do this `console.placeholder = console.timeStamp` or `console.placeholder = (...m) => {}`
  placeholder = (...messages) => {};
  // timeStamp is a strange console method that can be used instead of the placeholder for backward compability
}

class Ytils {
  static sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  static wait = Ytils.sleep;

  static assert = (condition, message = "Assertion failed") => {
    if (!condition) throw new Error(message);
  };

  static insertAfter = (newNode, referenceNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  };

  static waitForElement = async (selector, timeout = 5 * 1000) => {
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) return resolve(element);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Set timeout as fallback
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  };

  static redirectThroughGoogle = (url) => {
    // redirect.me can be used too
    window.open(`https://www.google.com/url?sa=t&url=${url}`, "_blank");
  };

  static isIframe = () => {
    // Checks if current environment is iframe or standalone web page
    // Can also be checked using document.referrer but be aware that if it was redirected so it is not reliable(except one more redirect e.g. from google)
    if (window === window.top) {
      return null;
    } else {
      try {
        const test = window.top.location.href;
        return { origin: "same" };
      } catch (e) {
        return { origin: "cross" };
      }
    }
  };

  static copyToClipboard = async (text) => {
    try {
      // New API
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard!");
    } catch (error) {
      // Old technik
      console.error("Failed to copy: ", error);
      const textarea = document.createElement("textarea");
      textarea.value = text;

      // Avoid scrolling to bottom
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";

      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      console.log("Text copied to clipboard!");
    }
  };

  static stringToDOM = (htmlString, first = true) => {
    // const parser = new DOMParser();
    // const doc = parser.parseFromString(htmlString, "text/html");
    // return doc.body.children;

    const div = document.createElement("div");
    div.innerHTML = htmlString;

    if (!div?.firstChild) {
      throw new Error("stringToDOM incorrect htmlString");
    }

    if (first === true) {
      return div.firstChild;
    } else {
      return div.children; // HTMLCollection [0]
    }
  };

  static objIsEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) == JSON.stringify(obj2);
  };

  static selectByText = (selector, text, includes = false) => {
    let element = null;
    if (includes === true) {
      element = Array.from(document.querySelectorAll(selector)).find((el) => el.textContent.includes(text));
    } else {
      element = Array.from(document.querySelectorAll(selector)).find((el) => el.textContent.trim() === text);
    }
    return element;
  };
}

class Sort {
  static deepSort = (obj) => {
    // value can be array or obj
    if (Array.isArray(obj)) {
      // Recursively sort array elements
      const sortedArray = obj.map(deepSort);

      // If elements are objects, sort them for consistent output
      if (sortedArray.every((item) => typeof item === "object" && item !== null && !Array.isArray(item))) {
        // Try to sort by a common key if possible (like 'id' or 'name')
        const firstKeys = Object.keys(sortedArray[0]);
        const sortKey = firstKeys.find(
          (k) => typeof sortedArray[0][k] === "string" || typeof sortedArray[0][k] === "number"
        );

        if (sortKey) {
          sortedArray.sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return -1;
            if (a[sortKey] > b[sortKey]) return 1;
            return 0;
          });
        }
      }

      return sortedArray;
    } else if (typeof obj === "object" && obj !== null) {
      // Recursively sort object keys
      const sortedEntries = Object.entries(obj)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, val]) => [key, deepSort(val)]);

      return Object.fromEntries(sortedEntries);
    }

    // Primitives
    return obj;
  };
}
