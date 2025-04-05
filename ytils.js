class Log {
  static ERROR_LEVEL = 0;
  static WARN_LEVEL = 1;
  static INFO_LEVEL = 2;
  static LOG_LEVEL = 3;
  static DEBUG_LEVEL = 4;
  static TRACE_LEVEL = 5;

  static _MAP = { 0: "error", 1: "warn", 2: "info", 3: "log", 4: "debug", 5: "trace" };

  constructor({ level = Log.LOG_LEVEL, timestamp = false } = {}) {
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
}
