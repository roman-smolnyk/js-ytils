class Log {
  static ERROR_LEVEL = 0;
  static WARN_LEVEL = 1;
  static INFO_LEVEL = 2;
  static DEBUG_LEVEL = 3;
  static TRACE_LEVEL = 4;
  // _MAP[0] num always converts to string
  static _MAP = { 0: "error", 1: "warn", 2: "log", 3: "debug", 4: "trace" };

  constructor(level = Log.INFO) {
    this.CURRENT_LEVEL = level;
  }

  _stdout = (level, ...messages) => {
    if (level <= this.CURRENT_LEVEL) {
      console[Log._MAP[this.CURRENT_LEVEL]](...messages);
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
  debug = (...messages) => {
    this._stdout(Log.DEBUG_LEVEL, ...messages);
  };
  trace = (...messages) => {
    this._stdout(Log.TRACE_LEVEL, ...messages);
  };
  // For cases when misswapped .info and .log
  log = (...messages) => {
    this._stdout(Log.INFO_LEVEL, ...messages);
  };
}
