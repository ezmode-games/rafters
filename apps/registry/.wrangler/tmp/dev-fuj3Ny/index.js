const __defProp = Object.defineProperty;
const __name = (target, value) => __defProp(target, 'name', { value, configurable: true });

// ../../node_modules/.pnpm/unenv@2.0.0-rc.19/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, 'createNotImplementedError');
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, 'fn');
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, 'notImplemented');
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, 'notImplementedClass');

// ../../node_modules/.pnpm/unenv@2.0.0-rc.19/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
const _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
const _performanceNow = globalThis.performance?.now
  ? globalThis.performance.now.bind(globalThis.performance)
  : () => Date.now() - _timeOrigin;
const nodeTiming = {
  name: 'node',
  entryType: 'node',
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0,
  },
  detail: void 0,
  toJSON() {
    return this;
  },
};
const PerformanceEntry = class {
  static {
    __name(this, 'PerformanceEntry');
  }
  __unenv__ = true;
  detail;
  entryType = 'event';
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail,
    };
  }
};
const PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(PerformanceMark2, 'PerformanceMark');
  }
  entryType = 'mark';
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
const PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, 'PerformanceMeasure');
  }
  entryType = 'measure';
};
const PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, 'PerformanceResourceTiming');
  }
  entryType = 'resource';
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = '';
  name = '';
  nextHopProtocol = '';
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
const PerformanceObserverEntryList = class {
  static {
    __name(this, 'PerformanceObserverEntryList');
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
const Performance = class {
  static {
    __name(this, 'Performance');
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError('Performance.timerify');
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming('');
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName
      ? this._entries.filter((e) => e.name !== markName)
      : this._entries.filter((e) => e.entryType !== 'mark');
  }
  clearMeasures(measureName) {
    this._entries = measureName
      ? this._entries.filter((e) => e.name !== measureName)
      : this._entries.filter((e) => e.entryType !== 'measure');
  }
  clearResourceTimings() {
    this._entries = this._entries.filter(
      (e) => e.entryType !== 'resource' || e.entryType !== 'navigation'
    );
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === 'string') {
      start = this.getEntriesByName(startOrMeasureOptions, 'mark')[0]?.startTime;
      end = this.getEntriesByName(endMark, 'mark')[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end,
      },
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError('Performance.addEventListener');
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError('Performance.removeEventListener');
  }
  dispatchEvent(event) {
    throw createNotImplementedError('Performance.dispatchEvent');
  }
  toJSON() {
    return this;
  }
};
const PerformanceObserver = class {
  static {
    __name(this, 'PerformanceObserver');
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError('PerformanceObserver.disconnect');
  }
  observe(options) {
    throw createNotImplementedError('PerformanceObserver.observe');
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
const performance =
  globalThis.performance && 'addEventListener' in globalThis.performance
    ? globalThis.performance
    : new Performance();

// ../../node_modules/.pnpm/@cloudflare+unenv-preset@2.5.0_unenv@2.0.0-rc.19_workerd@1.20250726.0/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../node_modules/.pnpm/unenv@2.0.0-rc.19/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from 'node:stream';

// ../../node_modules/.pnpm/unenv@2.0.0-rc.19/node_modules/unenv/dist/runtime/mock/noop.mjs
const noop_default = Object.assign(() => {}, { __unenv__: true });

// ../../node_modules/.pnpm/unenv@2.0.0-rc.19/node_modules/unenv/dist/runtime/node/console.mjs
const _console = globalThis.console;
const _ignoreErrors = true;
const _stderr = new Writable();
const _stdout = new Writable();
const log = _console?.log ?? noop_default;
const info = _console?.info ?? log;
const trace = _console?.trace ?? info;
const debug = _console?.debug ?? log;
const table = _console?.table ?? log;
const error = _console?.error ?? log;
const warn = _console?.warn ?? error;
const createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented('console.createTask');
const clear = _console?.clear ?? noop_default;
const count = _console?.count ?? noop_default;
const countReset = _console?.countReset ?? noop_default;
const dir = _console?.dir ?? noop_default;
const dirxml = _console?.dirxml ?? noop_default;
const group = _console?.group ?? noop_default;
const groupEnd = _console?.groupEnd ?? noop_default;
const groupCollapsed = _console?.groupCollapsed ?? noop_default;
const profile = _console?.profile ?? noop_default;
const profileEnd = _console?.profileEnd ?? noop_default;
const time = _console?.time ?? noop_default;
const timeEnd = _console?.timeEnd ?? noop_default;
const timeLog = _console?.timeLog ?? noop_default;
const timeStamp = _console?.timeStamp ?? noop_default;
const Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass('console.Console');
const _times = /* @__PURE__ */ new Map();
const _stdoutErrorHandler = noop_default;
const _stderrErrorHandler = noop_default;

// ../../node_modules/.pnpm/@cloudflare+unenv-preset@2.5.0_unenv@2.0.0-rc.19_workerd@1.20250726.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
const workerdConsole = globalThis.console;
const {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2,
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times,
});
const console_default = workerdConsole;

// ../../node_modules/.pnpm/wrangler@4.26.1_@cloudflare+workers-types@4.20250726.0/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../node_modules/.pnpm/unenv@2.0.0-rc.19/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
const hrtime = /* @__PURE__ */ Object.assign(
  /* @__PURE__ */ __name(function hrtime2(startTime) {
    const now = Date.now();
    const seconds = Math.trunc(now / 1e3);
    const nanos = (now % 1e3) * 1e6;
    if (startTime) {
      let diffSeconds = seconds - startTime[0];
      let diffNanos = nanos - startTime[0];
      if (diffNanos < 0) {
        diffSeconds = diffSeconds - 1;
        diffNanos = 1e9 + diffNanos;
      }
      return [diffSeconds, diffNanos];
    }
    return [seconds, nanos];
  }, 'hrtime'),
  {
    bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, 'bigint'),
  }
);

// ../../node_modules/.pnpm/unenv@2.0.0-rc.19/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from 'node:events';

// ../../node_modules/.pnpm/unenv@2.0.0-rc.19/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
const WriteStream = class {
  static {
    __name(this, 'WriteStream');
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback?.();
    return false;
  }
  clearScreenDown(callback) {
    callback?.();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === 'function' && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback?.();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {}
    cb && typeof cb === 'function' && cb();
    return false;
  }
};

// ../../node_modules/.pnpm/unenv@2.0.0-rc.19/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
const ReadStream = class {
  static {
    __name(this, 'ReadStream');
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../node_modules/.pnpm/unenv@2.0.0-rc.19/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
const NODE_VERSION = '22.14.0';

// ../../node_modules/.pnpm/unenv@2.0.0-rc.19/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
const Process = class _Process extends EventEmitter {
  static {
    __name(_Process, 'Process');
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [
      ...Object.getOwnPropertyNames(_Process.prototype),
      ...Object.getOwnPropertyNames(EventEmitter.prototype),
    ]) {
      const value = this[prop];
      if (typeof value === 'function') {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ''}${type ? `${type}: ` : ''}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return (this.#stdin ??= new ReadStream(0));
  }
  get stdout() {
    return (this.#stdout ??= new WriteStream(1));
  }
  get stderr() {
    return (this.#stderr ??= new WriteStream(2));
  }
  // --- cwd ---
  #cwd = '/';
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = '';
  platform = '';
  argv = [];
  argv0 = '';
  execArgv = [];
  execPath = '';
  title = '';
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {}
  unref() {}
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError('process.umask');
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError('process.getActiveResourcesInfo');
  }
  exit() {
    throw createNotImplementedError('process.exit');
  }
  reallyExit() {
    throw createNotImplementedError('process.reallyExit');
  }
  kill() {
    throw createNotImplementedError('process.kill');
  }
  abort() {
    throw createNotImplementedError('process.abort');
  }
  dlopen() {
    throw createNotImplementedError('process.dlopen');
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError('process.setSourceMapsEnabled');
  }
  loadEnvFile() {
    throw createNotImplementedError('process.loadEnvFile');
  }
  disconnect() {
    throw createNotImplementedError('process.disconnect');
  }
  cpuUsage() {
    throw createNotImplementedError('process.cpuUsage');
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError('process.setUncaughtExceptionCaptureCallback');
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError('process.hasUncaughtExceptionCaptureCallback');
  }
  initgroups() {
    throw createNotImplementedError('process.initgroups');
  }
  openStdin() {
    throw createNotImplementedError('process.openStdin');
  }
  assert() {
    throw createNotImplementedError('process.assert');
  }
  binding() {
    throw createNotImplementedError('process.binding');
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented('process.permission.has') };
  report = {
    directory: '',
    filename: '',
    signal: 'SIGUSR2',
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented('process.report.getReport'),
    writeReport: /* @__PURE__ */ notImplemented('process.report.writeReport'),
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented('process.finalization.register'),
    unregister: /* @__PURE__ */ notImplemented('process.finalization.unregister'),
    registerBeforeExit: /* @__PURE__ */ notImplemented('process.finalization.registerBeforeExit'),
  };
  memoryUsage = Object.assign(
    () => ({
      arrayBuffers: 0,
      rss: 0,
      external: 0,
      heapTotal: 0,
      heapUsed: 0,
    }),
    { rss: /* @__PURE__ */ __name(() => 0, 'rss') }
  );
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../node_modules/.pnpm/@cloudflare+unenv-preset@2.5.0_unenv@2.0.0-rc.19_workerd@1.20250726.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
const globalProcess = globalThis.process;
const getBuiltinModule = globalProcess.getBuiltinModule;
const { exit, platform, nextTick } = getBuiltinModule('node:process');
const unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  nextTick,
});
const {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  finalization,
  features,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  on,
  off,
  once,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding,
} = unenvProcess;
const _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding,
};
const process_default = _process;

// ../../node_modules/.pnpm/wrangler@4.26.1_@cloudflare+workers-types@4.20250726.0/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/compose.js
const compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context2, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context2.req.routeIndex = i;
      } else {
        handler = (i === middleware.length && next) || void 0;
      }
      if (handler) {
        try {
          res = await handler(context2, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context2.error = err;
            res = await onError(err, context2);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context2.finalized === false && onNotFound) {
          res = await onNotFound(context2);
        }
      }
      if (res && (context2.finalized === false || isError)) {
        context2.res = res;
      }
      return context2;
    }
    __name(dispatch, 'dispatch');
  };
}, 'compose');

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/request/constants.js
const GET_MATCH_RESULT = Symbol();

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/utils/body.js
const parseBody = /* @__PURE__ */ __name(
  async (request, options = /* @__PURE__ */ Object.create(null)) => {
    const { all = false, dot = false } = options;
    const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
    const contentType = headers.get('Content-Type');
    if (
      contentType?.startsWith('multipart/form-data') ||
      contentType?.startsWith('application/x-www-form-urlencoded')
    ) {
      return parseFormData(request, { all, dot });
    }
    return {};
  },
  'parseBody'
);
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, 'parseFormData');
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith('[]');
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes('.');
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, 'convertFormDataToBodyData');
const handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith('[]')) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, 'handleParsingAllValues');
const handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  let nestedForm = form;
  const keys = key.split('.');
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (
        !nestedForm[key2] ||
        typeof nestedForm[key2] !== 'object' ||
        Array.isArray(nestedForm[key2]) ||
        nestedForm[key2] instanceof File
      ) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, 'handleParsingNestedValues');

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/utils/url.js
const splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split('/');
  if (paths[0] === '') {
    paths.shift();
  }
  return paths;
}, 'splitPath');
const splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, 'splitRoutingPath');
const extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
}, 'extractGroupsFromPath');
const replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, 'replaceGroupMarks');
const patternCache = {};
const getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === '*') {
    return '*';
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match[2]) {
        patternCache[cacheKey] =
          next && next[0] !== ':' && next[0] !== '*'
            ? [cacheKey, match[1], new RegExp(`^${match[2]}(?=/${next})`)]
            : [label, match[1], new RegExp(`^${match[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, 'getPattern');
const tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
      try {
        return decoder(match);
      } catch {
        return match;
      }
    });
  }
}, 'tryDecode');
const tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), 'tryDecodeURI');
const getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf('/', url.charCodeAt(9) === 58 ? 13 : 8);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf('?', i);
      const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path.includes('%25') ? path.replace(/%25/g, '%2525') : path);
    }
    if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
}, 'getPath');
const getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === '/' ? result.slice(0, -1) : result;
}, 'getPathNoStrict');
const mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === '/' ? '' : '/'}${base}${sub === '/' ? '' : `${base?.at(-1) === '/' ? '' : '/'}${sub?.[0] === '/' ? sub.slice(1) : sub}`}`;
}, 'mergePath');
const checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(':')) {
    return null;
  }
  const segments = path.split('/');
  const results = [];
  let basePath = '';
  segments.forEach((segment) => {
    if (segment !== '' && !/\:/.test(segment)) {
      basePath += `/${segment}`;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === '') {
          results.push('/');
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace('?', '');
        basePath += `/${optionalSegment}`;
        results.push(basePath);
      } else {
        basePath += `/${segment}`;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, 'checkOptionalParameter');
const _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf('+') !== -1) {
    value = value.replace(/\+/g, ' ');
  }
  return value.indexOf('%') !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, '_decodeURI');
const _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf('&', valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      }
      if (trailingKeyCode === 38 || Number.isNaN(trailingKeyCode)) {
        return '';
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf('?', 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf('&', keyIndex + 1);
    let valueIndex = url.indexOf('=', keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? (nextKeyIndex === -1 ? void 0 : nextKeyIndex) : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === '') {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = '';
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, '_getQueryParam');
const getQueryParam = _getQueryParam;
const getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, 'getQueryParams');
const decodeURIComponent_ = decodeURIComponent;

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/request.js
const tryDecodeURIComponent = /* @__PURE__ */ __name(
  (str) => tryDecode(str, decodeURIComponent_),
  'tryDecodeURIComponent'
);
const HonoRequest = class {
  static {
    __name(this, 'HonoRequest');
  }
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = '/', matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param ? (/\%/.test(param) ? tryDecodeURIComponent(param) : param) : void 0;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value && typeof value === 'string') {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return (this.bodyCache.parsedBody ??= await parseBody(this, options));
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === 'json') {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return (bodyCache[key] = raw2[key]());
  }, '#cachedBody');
  json() {
    return this.#cachedBody('text').then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody('text');
  }
  arrayBuffer() {
    return this.#cachedBody('arrayBuffer');
  }
  blob() {
    return this.#cachedBody('blob');
  }
  formData() {
    return this.#cachedBody('formData');
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/utils/html.js
const HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3,
};
const raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, 'raw');
const resolveCallback = /* @__PURE__ */ __name(
  async (str, phase, preserveCallbacks, context2, buffer) => {
    if (typeof str === 'object' && !(str instanceof String)) {
      if (!(str instanceof Promise)) {
        str = str.toString();
      }
      if (str instanceof Promise) {
        str = await str;
      }
    }
    const callbacks = str.callbacks;
    if (!callbacks?.length) {
      return Promise.resolve(str);
    }
    if (buffer) {
      buffer[0] += str;
    } else {
      buffer = [str];
    }
    const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context: context2 }))).then(
      (res) =>
        Promise.all(
          res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context2, buffer))
        ).then(() => buffer[0])
    );
    if (preserveCallbacks) {
      return raw(await resStr, callbacks);
    }
    return resStr;
  },
  'resolveCallback'
);

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/context.js
const TEXT_PLAIN = 'text/plain; charset=UTF-8';
const setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    'Content-Type': contentType,
    ...headers,
  };
}, 'setDefaultContentType');
const Context = class {
  static {
    __name(this, 'Context');
  }
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && 'respondWith' in this.#executionCtx) {
      return this.#executionCtx;
    }
    throw Error('This context has no FetchEvent');
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    }
    throw Error('This context has no ExecutionContext');
  }
  get res() {
    return (this.#res ||= new Response(null, {
      headers: (this.#preparedHeaders ??= new Headers()),
    }));
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === 'content-type') {
          continue;
        }
        if (k === 'set-cookie') {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete('set-cookie');
          for (const cookie of cookies) {
            _res.headers.append('set-cookie', cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, 'render');
  setLayout = /* @__PURE__ */ __name((layout) => (this.#layout = layout), 'setLayout');
  getLayout = /* @__PURE__ */ __name(() => this.#layout, 'getLayout');
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, 'setRenderer');
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : (this.#preparedHeaders ??= new Headers());
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, 'header');
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, 'status');
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, 'set');
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, 'get');
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res
      ? new Headers(this.#res.headers)
      : (this.#preparedHeaders ?? new Headers());
    if (typeof arg === 'object' && 'headers' in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === 'set-cookie') {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === 'string') {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === 'number' ? arg : (arg?.status ?? this.#status);
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), 'newResponse');
  body = /* @__PURE__ */ __name(
    (data, arg, headers) => this.#newResponse(data, arg, headers),
    'body'
  );
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized
      ? new Response(text)
      : this.#newResponse(text, arg, setDefaultContentType(TEXT_PLAIN, headers));
  }, 'text');
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType('application/json', headers)
    );
  }, 'json');
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name(
      (html2) =>
        this.#newResponse(html2, arg, setDefaultContentType('text/html; charset=UTF-8', headers)),
      'res'
    );
    return typeof html === 'object'
      ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res)
      : res(html);
  }, 'html');
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      'Location',
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, 'redirect');
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  }, 'notFound');
};

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/router.js
const METHOD_NAME_ALL = 'ALL';
const METHOD_NAME_ALL_LOWERCASE = 'all';
const METHODS = ['get', 'post', 'put', 'delete', 'options', 'patch'];
const MESSAGE_MATCHER_IS_ALREADY_BUILT = 'Can not add a route since the matcher is already built.';
const UnsupportedPathError = class extends Error {
  static {
    __name(this, 'UnsupportedPathError');
  }
};

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/utils/constants.js
const COMPOSED_HANDLER = '__COMPOSED_HANDLER';

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/hono-base.js
const notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text('404 Not Found', 404);
}, 'notFoundHandler');
const errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ('getResponse' in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text('Internal Server Error', 500);
}, 'errorHandler');
const Hono = class {
  static {
    __name(this, 'Hono');
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = '/';
  #path = '/';
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === 'string') {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === 'string') {
        this.#path = arg1;
      } else {
        this.#path = '*';
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = (strict ?? true) ? (options.getPath ?? getPath) : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath,
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(
          async (c, next) =>
            (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res,
          'handler'
        );
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, 'onError');
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, 'notFound');
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === 'function') {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, 'replaceRequest');
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler
      ? (c) => {
          const options2 = optionHandler(c);
          return Array.isArray(options2) ? options2 : [options2];
        }
      : (c) => {
          let executionContext = void 0;
          try {
            executionContext = c.executionCtx;
          } catch {}
          return [c.env, executionContext];
        };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === '/' ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || '/';
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, 'handler');
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, '*'), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env2, method) {
    if (method === 'HEAD') {
      return (async () =>
        new Response(null, await this.#dispatch(request, executionCtx, env2, 'GET')))();
    }
    const path = this.getPath(request, { env: env2 });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env: env2,
      executionCtx,
      notFoundHandler: this.#notFoundHandler,
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise
        ? res
            .then((resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c)))
            .catch((err) => this.#handleError(err, c))
        : (res ?? this.#notFoundHandler(c));
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context2 = await composed(c);
        if (!context2.finalized) {
          throw new Error(
            'Context is not finalized. Did you forget to return a Response object or `await next()`?'
          );
        }
        return context2.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, 'fetch');
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath('/', input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, 'request');
  fire = /* @__PURE__ */ __name(() => {
    addEventListener('fetch', (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, 'fire');
};

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/router/reg-exp-router/node.js
const LABEL_REG_EXP_STR = '[^/]+';
const ONLY_WILDCARD_REG_EXP_STR = '.*';
const TAIL_WILDCARD_REG_EXP_STR = '(?:|/.*)';
const PATH_ERROR = Symbol();
const regExpMetaChars = new Set('.\\+*[^]$()');
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? (a < b ? -1 : 1) : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  }
  if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  }
  if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? (a < b ? -1 : 1) : b.length - a.length;
}
__name(compareKey, 'compareKey');
const Node = class {
  static {
    __name(this, 'Node');
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context2, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern =
      token === '*'
        ? restTokens.length === 0
          ? ['', '', ONLY_WILDCARD_REG_EXP_STR]
          : ['', '', LABEL_REG_EXP_STR]
        : token === '/*'
          ? ['', '', TAIL_WILDCARD_REG_EXP_STR]
          : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, '(?:');
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (
          Object.keys(this.#children).some(
            (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
          )
        ) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new Node();
        if (name !== '') {
          node.#varIndex = context2.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== '') {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (
          Object.keys(this.#children).some(
            (k) =>
              k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
          )
        ) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context2, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (
        (typeof c.#varIndex === 'number'
          ? `(${k})@${c.#varIndex}`
          : regExpMetaChars.has(k)
            ? `\\${k}`
            : k) + c.buildRegExpStr()
      );
    });
    if (typeof this.#index === 'number') {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return '';
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return `(?:${strList.join('|')})`;
  }
};

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/router/reg-exp-router/trie.js
const Trie = class {
  static {
    __name(this, 'Trie');
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === '') {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return '$()';
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return '';
      }
      return '';
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/router/reg-exp-router/router.js
const emptyParam = [];
const nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
let wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return (wildcardRegExpCache[path] ??= new RegExp(
    path === '*'
      ? ''
      : `^${path.replace(/\/\*$|([.\\+*[^\]$()])/g, (_, metaChar) =>
          metaChar ? `\\${metaChar}` : '(?:|/.*)'
        )}$`
  ));
}
__name(buildWildcardRegExp, 'buildWildcardRegExp');
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, 'clearWildcardRegExpCache');
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes
    .map((route) => [!/\*|\/:/.test(route[0]), ...route])
    .sort(([isStaticA, pathA], [isStaticB, pathB]) =>
      isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
    );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [
        handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]),
        emptyParam,
      ];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, 'buildMatcherFromPreprocessedRoutes');
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, 'findMiddleware');
const RegExpRouter = class {
  static {
    __name(this, 'RegExpRouter');
  }
  name = 'RegExpRouter';
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === '/*') {
      path = '*';
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||=
            findMiddleware(middleware[m], path) ||
            findMiddleware(middleware[METHOD_NAME_ALL], path) ||
            [];
        });
      } else {
        middleware[method][path] ||=
          findMiddleware(middleware[method], path) ||
          findMiddleware(middleware[METHOD_NAME_ALL], path) ||
          [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...(findMiddleware(middleware[m], path2) ||
              findMiddleware(middleware[METHOD_NAME_ALL], path2) ||
              []),
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.#buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf('', 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path);
  }
  #buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes)
      .concat(Object.keys(this.#middleware))
      .forEach((method) => {
        matchers[method] ||= this.#buildMatcher(method);
      });
    this.#middleware = this.#routes = void 0;
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method]
        ? Object.keys(r[method]).map((path) => [path, r[method][path]])
        : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    }
    return buildMatcherFromPreprocessedRoutes(routes);
  }
};

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/router/smart-router/router.js
const SmartRouter = class {
  static {
    __name(this, 'SmartRouter');
  }
  name = 'SmartRouter';
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error('Fatal error');
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error('Fatal error');
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error('No active router has been determined yet.');
    }
    return this.#routers[0];
  }
};

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/router/trie-router/node.js
const emptyParams = /* @__PURE__ */ Object.create(null);
const Node2 = class {
  static {
    __name(this, 'Node');
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order,
      },
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || (params && params !== emptyParams)) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] =
              params?.[key] && !processed ? params[key] : (nodeParams[key] ?? params?.[key]);
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    let curNodes = [this];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children['*']) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children['*'], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === '*') {
            const astNode = node.#children['*'];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          if (!part) {
            continue;
          }
          const [key, name, matcher] = pattern;
          const child = node.#children[key];
          const restPathString = parts.slice(i).join('/');
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = (curNodesQueue[componentCount] ||= []);
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children['*']) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children['*'], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/router/trie-router/router.js
const TrieRouter = class {
  static {
    __name(this, 'TrieRouter');
  }
  name = 'TrieRouter';
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/hono.js
const Hono2 = class extends Hono {
  static {
    __name(this, 'Hono');
  }
  constructor(options = {}) {
    super(options);
    this.router =
      options.router ??
      new SmartRouter({
        routers: [new RegExpRouter(), new TrieRouter()],
      });
  }
};

// ../../node_modules/.pnpm/hono@4.8.9/node_modules/hono/dist/middleware/cors/index.js
const cors = /* @__PURE__ */ __name((options) => {
  const defaults = {
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowHeaders: [],
    exposeHeaders: [],
  };
  const opts = {
    ...defaults,
    ...options,
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === 'string') {
      if (optsOrigin === '*') {
        return () => optsOrigin;
      }
      return (origin) => (optsOrigin === origin ? origin : null);
    }
    if (typeof optsOrigin === 'function') {
      return optsOrigin;
    }
    return (origin) => (optsOrigin.includes(origin) ? origin : null);
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === 'function') {
      return optsAllowMethods;
    }
    if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    }
    return () => [];
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, 'set');
    const allowOrigin = findAllowOrigin(c.req.header('origin') || '', c);
    if (allowOrigin) {
      set('Access-Control-Allow-Origin', allowOrigin);
    }
    if (opts.origin !== '*') {
      const existingVary = c.req.header('Vary');
      if (existingVary) {
        set('Vary', existingVary);
      } else {
        set('Vary', 'Origin');
      }
    }
    if (opts.credentials) {
      set('Access-Control-Allow-Credentials', 'true');
    }
    if (opts.exposeHeaders?.length) {
      set('Access-Control-Expose-Headers', opts.exposeHeaders.join(','));
    }
    if (c.req.method === 'OPTIONS') {
      if (opts.maxAge != null) {
        set('Access-Control-Max-Age', opts.maxAge.toString());
      }
      const allowMethods = findAllowMethods(c.req.header('origin') || '', c);
      if (allowMethods.length) {
        set('Access-Control-Allow-Methods', allowMethods.join(','));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header('Access-Control-Request-Headers');
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set('Access-Control-Allow-Headers', headers.join(','));
        c.res.headers.append('Vary', 'Access-Control-Request-Headers');
      }
      c.res.headers.delete('Content-Length');
      c.res.headers.delete('Content-Type');
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: 'No Content',
      });
    }
    await next();
  }, 'cors2');
}, 'cors');

// registry-manifest.json
const registry_manifest_default = {
  components: [
    {
      name: 'badge',
      path: 'components/ui/Badge.tsx',
      type: 'registry:component ',
      description: '',
      content: `/**
 * Status badge component with multi-sensory communication patterns
 *
 * @registry-name badge
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Badge.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 2/10 - Optimized for peripheral scanning with minimal cognitive overhead
 * @attention-economics Secondary/tertiary support: Maximum 1 high-attention badge per section, unlimited subtle badges
 * @trust-building Low trust informational display with optional interaction patterns
 * @accessibility Multi-sensory communication: Color + Icon + Text + Pattern prevents single-point accessibility failure
 * @semantic-meaning Status communication with semantic variants: success=completion, warning=caution, error=problems, info=neutral information
 *
 * @usage-patterns
 * DO: Use for status indicators with multi-sensory communication
 * DO: Navigation badges for notification counts and sidebar status
 * DO: Category labels with semantic meaning over arbitrary colors
 * DO: Interactive badges with enhanced touch targets for removal/expansion
 * NEVER: Primary actions, complex information, critical alerts requiring immediate action
 *
 * @design-guides
 * - Status Communication: https://rafters.realhandy.tech/docs/llm/status-communication
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Multi-Sensory Design: https://rafters.realhandy.tech/docs/llm/accessibility-excellence
 *
 * @dependencies lucide-react
 *
 * @example
 * \`\`\`tsx
 * // Status badge with icon and semantic meaning
 * <Badge variant="success" emphasis="default">
 *   Completed
 * </Badge>
 * 
 * // Interactive badge for removal
 * <Badge variant="info" interactive onRemove={() => {}}>
 *   Category
 * </Badge>
 * \`\`\`
 */
import { AlertTriangle, CheckCircle, Info, Minus, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Chip } from './Chip';
import type { ChipPosition, ChipVariant } from './Chip';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeEmphasis = 'subtle' | 'default' | 'prominent';
// Use Chip component types for backward compatibility
export type BadgeChipVariant = ChipVariant;
export type BadgeChipPosition = ChipPosition;

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  // Core semantic variants for status communication
  variant?: BadgeVariant;

  // Size based on attention hierarchy
  size?: BadgeSize;

  // Visual emphasis level for attention economics
  emphasis?: BadgeEmphasis;

  // Interaction capabilities
  interactive?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: React.MouseEventHandler<HTMLElement>;

  // Content enhancement
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';

  // Enhanced accessibility
  'aria-live'?: 'polite' | 'assertive';

  // Context awareness
  animate?: boolean;
  loading?: boolean;

  // High visibility chip indicator (uses independent Chip component)
  chip?: ChipVariant;
  chipPosition?: ChipPosition;
  chipValue?: string | number; // For count badges or custom text

  ref?: React.Ref<HTMLElement>;
}

// Status indicators with multi-sensory communication
const STATUS_INDICATORS = {
  success: {
    icon: CheckCircle,
    ariaLabel: 'Success status',
    cognitiveLoad: 3,
    attentionWeight: 'low',
    psychology: 'confidence_building',
  },
  warning: {
    icon: AlertTriangle,
    ariaLabel: 'Warning status',
    cognitiveLoad: 6,
    attentionWeight: 'medium',
    psychology: 'awareness_needed',
  },
  error: {
    icon: XCircle,
    ariaLabel: 'Error status',
    cognitiveLoad: 8,
    attentionWeight: 'high',
    psychology: 'immediate_attention_required',
  },
  info: {
    icon: Info,
    ariaLabel: 'Information status',
    cognitiveLoad: 2,
    attentionWeight: 'minimal',
    psychology: 'helpful_context',
  },
  neutral: {
    icon: Minus,
    ariaLabel: 'Neutral status',
    cognitiveLoad: 1,
    attentionWeight: 'background',
    psychology: 'invisible_organization',
  },
} as const;

export function Badge({
  variant = 'neutral',
  size = 'md',
  emphasis = 'default',
  interactive = false,
  removable = false,
  onRemove,
  icon: CustomIcon,
  iconPosition = 'left',
  animate = false,
  loading = false,
  chip,
  chipPosition = 'top-right',
  chipValue,
  children,
  className,
  onClick,
  onKeyDown,
  ref,
  ...props
}: BadgeProps) {
  const statusInfo = STATUS_INDICATORS[variant];
  const Icon = CustomIcon || statusInfo.icon;
  const isInteractive = interactive || removable || !!onClick;

  // Chip rendering using independent Chip component
  const renderChip = () => {
    if (!chip) return null;

    return <Chip variant={chip} position={chipPosition} value={chipValue} size={size} />;
  };

  // Handle keyboard navigation for interactive badges
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!isInteractive) return;

    switch (event.key) {
      case ' ':
      case 'Enter':
        event.preventDefault();
        if (onClick) {
          // Directly call the onClick handler to avoid double firing
          onClick(event as unknown as React.MouseEvent<HTMLElement>);
        }
        break;
      case 'Delete':
      case 'Backspace':
        if (removable && onRemove) {
          event.preventDefault();
          onRemove();
        }
        break;
      case 'Escape':
        // Allow parent components to handle escape
        break;
    }

    if (onKeyDown) {
      onKeyDown(event as React.KeyboardEvent<HTMLElement>);
    }
  };

  if (isInteractive && removable && onRemove) {
    // Single button solution with separated interaction zones (Sally's recommendation)
    return (
      <div
        ref={ref as React.ForwardedRef<HTMLDivElement>}
        // biome-ignore lint/a11y/useSemanticElements: div with role="group" is more appropriate than fieldset for badge interaction grouping
        role="group"
        aria-label={\`\${statusInfo.ariaLabel}\${children ? \`: \${children}\` : ''} - clickable badge with remove option\`}
        className={cn(
          'relative inline-flex items-center rounded-md text-xs font-medium select-none',
          'border transition-all duration-150',

          // Motion respect
          animate && 'motion-reduce:transition-none',

          // Size variants with attention hierarchy
          {
            'text-xs': size === 'sm' || size === 'md',
            'text-sm': size === 'lg',
          },

          // Emphasis levels for attention economics
          {
            'opacity-75 border-0': emphasis === 'subtle',
            'opacity-100 border': emphasis === 'default',
            'opacity-100 border-2 shadow-sm': emphasis === 'prominent',
          },

          // Variant styles with multi-sensory communication
          {
            // Success: Confidence building through subtle confirmation
            'bg-success/20 border-success/30 text-success': variant === 'success',

            // Warning: Balanced visibility for awareness
            'bg-warning/20 border-warning/30 text-warning': variant === 'warning',

            // Error: Strong contrast for immediate attention
            'bg-destructive/20 border-destructive/30 text-destructive': variant === 'error',

            // Info: Supportive context without competition
            'bg-info/20 border-info/30 text-info': variant === 'info',

            // Neutral: Invisible organization
            'bg-muted border-muted-foreground/20 text-muted-foreground': variant === 'neutral',
          },

          className
        )}
        {...props}
      >
        <button
          type="button"
          tabIndex={0}
          className={cn(
            'inline-flex items-center gap-1 w-full',
            // Enhanced touch targets for interactive badges (WCAG AAA)
            'min-h-11 min-w-11 touch-manipulation cursor-pointer',
            'hover:opacity-hover focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'active:scale-active rounded-md',

            // Loading state feedback
            loading && 'opacity-75 cursor-wait',

            // Size variants with attention hierarchy
            {
              'px-1.5 py-0.5': size === 'sm',
              'px-2 py-0.5': size === 'md',
              'px-2.5 py-1': size === 'lg',
            }
          )}
          onClick={(e) => {
            // Check if click was on remove zone
            const target = e.target as HTMLElement;
            const removeZone = target.closest('[data-remove-zone]');
            if (removeZone) {
              e.stopPropagation();
              onRemove();
            } else if (onClick) {
              onClick(e);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
              e.preventDefault();
              onRemove();
            } else {
              handleKeyDown(e);
            }
          }}
          aria-label={\`\${statusInfo.ariaLabel}\${children ? \`: \${children}\` : ''} - removable badge\`}
          aria-busy={loading}
        >
          {/* Main content zone */}
          <span className="pointer-events-none inline-flex items-center gap-1 flex-1">
            {/* Icon for multi-sensory status communication */}
            {Icon && iconPosition === 'left' && (
              <Icon
                className={cn(
                  'flex-shrink-0',
                  size === 'sm' && 'w-3 h-3',
                  size === 'md' && 'w-3 h-3',
                  size === 'lg' && 'w-4 h-4'
                )}
                aria-hidden="true"
              />
            )}

            {/* Loading indicator */}
            {loading && (
              <div
                className={cn(
                  'animate-spin rounded-full border-2 border-current border-t-transparent',
                  size === 'sm' && 'w-3 h-3',
                  size === 'md' && 'w-3 h-3',
                  size === 'lg' && 'w-4 h-4'
                )}
                aria-hidden="true"
              />
            )}

            {/* Content */}
            {children && <span className="truncate">{children}</span>}

            {/* Right-positioned icon */}
            {Icon && iconPosition === 'right' && (
              <Icon
                className={cn(
                  'flex-shrink-0',
                  size === 'sm' && 'w-3 h-3',
                  size === 'md' && 'w-3 h-3',
                  size === 'lg' && 'w-4 h-4'
                )}
                aria-hidden="true"
              />
            )}
          </span>

          {/* Remove zone - visually separate but part of same button */}
          <span
            data-remove-zone="true"
            className={cn(
              'ml-2 pl-1 border-l border-current/20',
              'hover:bg-current/10 rounded-r-md cursor-pointer',
              'inline-flex items-center justify-center',
              {
                'p-0.5': size === 'sm',
                'p-1': size === 'md',
                'p-1.5': size === 'lg',
              }
            )}
            aria-hidden="true"
          >
            <XCircle
              className={cn(
                size === 'sm' && 'w-3 h-3',
                size === 'md' && 'w-3 h-3',
                size === 'lg' && 'w-4 h-4'
              )}
              aria-hidden="true"
            />
          </span>
        </button>
        {renderChip()}
      </div>
    );
  }

  if (isInteractive) {
    return (
      <div className="relative inline-block">
        <button
          ref={ref as React.ForwardedRef<HTMLButtonElement>}
          type="button"
          tabIndex={0}
          aria-label={
            props['aria-label'] || \`\${statusInfo.ariaLabel}\${children ? \`: \${children}\` : ''}\`
          }
          aria-live={props['aria-live']}
          aria-busy={loading}
          className={cn(
            // Base styles with semantic tokens
            'inline-flex items-center gap-1 rounded-md text-xs font-medium select-none',
            'border transition-all duration-150',

            // Enhanced touch targets for interactive badges (WCAG AAA)
            'min-h-11 min-w-11 touch-manipulation cursor-pointer',
            'hover:opacity-hover focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'active:scale-active',

            // Loading state feedback
            loading && 'opacity-75 cursor-wait',

            // Motion respect
            animate && 'motion-reduce:transition-none',

            // Size variants with attention hierarchy
            {
              'px-1.5 py-0.5 text-xs': size === 'sm',
              'px-2 py-0.5 text-xs': size === 'md',
              'px-2.5 py-1 text-sm': size === 'lg',
            },

            // Emphasis levels for attention economics
            {
              'opacity-75 border-0': emphasis === 'subtle',
              'opacity-100 border': emphasis === 'default',
              'opacity-100 border-2 shadow-sm': emphasis === 'prominent',
            },

            // Variant styles with multi-sensory communication
            {
              // Success: Confidence building through subtle confirmation
              'bg-success/20 border-success/30 text-success': variant === 'success',

              // Warning: Balanced visibility for awareness
              'bg-warning/20 border-warning/30 text-warning': variant === 'warning',

              // Error: Strong contrast for immediate attention
              'bg-destructive/20 border-destructive/30 text-destructive': variant === 'error',

              // Info: Supportive context without competition
              'bg-info/20 border-info/30 text-info': variant === 'info',

              // Neutral: Invisible organization
              'bg-muted border-muted-foreground/20 text-muted-foreground': variant === 'neutral',
            },

            className
          )}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {/* Icon for multi-sensory status communication */}
          {Icon && iconPosition === 'left' && (
            <Icon
              className={cn(
                'flex-shrink-0',
                size === 'sm' && 'w-3 h-3',
                size === 'md' && 'w-3 h-3',
                size === 'lg' && 'w-4 h-4'
              )}
              aria-hidden="true"
            />
          )}

          {/* Loading indicator */}
          {loading && (
            <div
              className={cn(
                'animate-spin rounded-full border-2 border-current border-t-transparent',
                size === 'sm' && 'w-3 h-3',
                size === 'md' && 'w-3 h-3',
                size === 'lg' && 'w-4 h-4'
              )}
              aria-hidden="true"
            />
          )}

          {/* Content */}
          {children && <span className="truncate">{children}</span>}

          {/* Right-positioned icon */}
          {Icon && iconPosition === 'right' && (
            <Icon
              className={cn(
                'flex-shrink-0',
                size === 'sm' && 'w-3 h-3',
                size === 'md' && 'w-3 h-3',
                size === 'lg' && 'w-4 h-4'
              )}
              aria-hidden="true"
            />
          )}
        </button>
        {renderChip()}
      </div>
    );
  }

  // Semantic element selection based on Sally's recommendations
  const getSemanticProps = () => {
    // Use status role for status communication variants
    if (['success', 'warning', 'error', 'info'].includes(variant)) {
      return {
        role: 'status',
        'aria-live': props['aria-live'] || (variant === 'error' ? 'assertive' : 'polite'),
        'aria-label':
          props['aria-label'] || \`\${statusInfo.ariaLabel}\${children ? \`: \${children}\` : ''}\`,
      };
    }

    // Use generic span for labels/categories
    return {
      'aria-label':
        props['aria-label'] || \`\${statusInfo.ariaLabel}\${children ? \`: \${children}\` : ''}\`,
      'aria-live': props['aria-live'],
    };
  };

  const semanticProps = getSemanticProps();

  return (
    <div className="relative inline-block">
      <span
        ref={ref as React.ForwardedRef<HTMLSpanElement>}
        aria-busy={loading}
        className={cn(
          // Base styles with semantic tokens
          'inline-flex items-center gap-1 rounded-md text-xs font-medium select-none',
          'border transition-all duration-150',

          // Loading state feedback
          loading && 'opacity-75 cursor-wait',

          // Motion respect
          animate && 'motion-reduce:transition-none',

          // Size variants with attention hierarchy
          {
            'px-1.5 py-0.5 text-xs': size === 'sm',
            'px-2 py-0.5 text-xs': size === 'md',
            'px-2.5 py-1 text-sm': size === 'lg',
          },

          // Emphasis levels for attention economics
          {
            'opacity-75 border-0': emphasis === 'subtle',
            'opacity-100 border': emphasis === 'default',
            'opacity-100 border-2 shadow-sm': emphasis === 'prominent',
          },

          // Variant styles with multi-sensory communication
          {
            // Success: Confidence building through subtle confirmation
            'bg-success/20 border-success/30 text-success': variant === 'success',

            // Warning: Balanced visibility for awareness
            'bg-warning/20 border-warning/30 text-warning': variant === 'warning',

            // Error: Strong contrast for immediate attention
            'bg-destructive/20 border-destructive/30 text-destructive': variant === 'error',

            // Info: Supportive context without competition
            'bg-info/20 border-info/30 text-info': variant === 'info',

            // Neutral: Invisible organization
            'bg-muted border-muted-foreground/20 text-muted-foreground': variant === 'neutral',
          },

          className
        )}
        {...semanticProps}
        {...props}
      >
        {/* Icon for multi-sensory status communication */}
        {Icon && iconPosition === 'left' && (
          <Icon
            className={cn(
              'flex-shrink-0',
              size === 'sm' && 'w-3 h-3',
              size === 'md' && 'w-3 h-3',
              size === 'lg' && 'w-4 h-4'
            )}
            aria-hidden="true"
          />
        )}

        {/* Loading indicator */}
        {loading && (
          <div
            className={cn(
              'animate-spin rounded-full border-2 border-current border-t-transparent',
              size === 'sm' && 'w-3 h-3',
              size === 'md' && 'w-3 h-3',
              size === 'lg' && 'w-4 h-4'
            )}
            aria-hidden="true"
          />
        )}

        {/* Content */}
        {children && <span className="truncate">{children}</span>}

        {/* Right-positioned icon */}
        {Icon && iconPosition === 'right' && (
          <Icon
            className={cn(
              'flex-shrink-0',
              size === 'sm' && 'w-3 h-3',
              size === 'md' && 'w-3 h-3',
              size === 'lg' && 'w-4 h-4'
            )}
            aria-hidden="true"
          />
        )}
      </span>
      {renderChip()}
    </div>
  );
}
`,
      dependencies: ['lucide-react'],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-badge--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 2,
            attentionEconomics:
              'Secondary/tertiary support: Maximum 1 high-attention badge per section, unlimited subtle badges',
            accessibility:
              'Multi-sensory communication: Color + Icon + Text + Pattern prevents single-point accessibility failure',
            trustBuilding: 'Low trust informational display with optional interaction patterns',
            semanticMeaning:
              'Status communication with semantic variants: success=completion, warning=caution, error=problems, info=neutral information ',
          },
          usagePatterns: {
            dos: [
              'Use for status indicators with multi-sensory communication',
              'Navigation badges for notification counts and sidebar status',
              'Category labels with semantic meaning over arbitrary colors',
              'Interactive badges with enhanced touch targets for removal/expansion',
            ],
            nevers: [
              'Primary actions, complex information, critical alerts requiring immediate action',
            ],
          },
          designGuides: [
            {
              name: 'Status Communication',
              url: 'https://rafters.realhandy.tech/docs/llm/status-communication',
            },
            {
              name: 'Attention Economics',
              url: 'https://rafters.realhandy.tech/docs/llm/attention-economics',
            },
            {
              name: 'Multi-Sensory Design',
              url: 'https://rafters.realhandy.tech/docs/llm/accessibility-excellence',
            },
          ],
          examples: [
            {
              code: '// Status badge with icon and semantic meaning\n<Badge variant="success" emphasis="default">\nCompleted\n</Badge>\n\n// Interactive badge for removal\n<Badge variant="info" interactive onRemove={() => {}}>\nCategory\n</Badge>',
            },
          ],
        },
      },
    },
    {
      name: 'breadcrumb',
      path: 'components/ui/Breadcrumb.tsx',
      type: 'registry:component ',
      description: '',
      content: `/**
 * Navigation breadcrumb component for wayfinding and location context
 *
 * @registry-name breadcrumb
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Breadcrumb.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 2/10 - Optimized for peripheral navigation aid with minimal cognitive overhead
 * @attention-economics Tertiary support: Never competes with primary content, provides spatial context only
 * @trust-building Low trust routine navigation with predictable, reliable wayfinding patterns
 * @accessibility Complete ARIA support with aria-current="page", aria-hidden separators, and keyboard navigation
 * @semantic-meaning Wayfinding system with spatial context and navigation hierarchy indication
 *
 * @usage-patterns
 * DO: Provide spatial context and navigation hierarchy
 * DO: Use clear current page indication with aria-current="page"
 * DO: Implement truncation strategies for long paths (Miller's Law)
 * DO: Configure separators with proper accessibility attributes
 * NEVER: Use for primary actions, complex information, or critical alerts
 *
 * @design-guides
 * - Wayfinding Intelligence: https://rafters.realhandy.tech/docs/llm/wayfinding-intelligence
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Navigation Integration: https://rafters.realhandy.tech/docs/llm/navigation-integration
 *
 * @dependencies lucide-react
 *
 * @example
 * \`\`\`tsx
 * // Basic breadcrumb with navigation
 * <Breadcrumb separator="chevron-right">
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbItem href="/products">Products</BreadcrumbItem>
 *   <BreadcrumbItem current>Product Detail</BreadcrumbItem>
 * </Breadcrumb>
 * 
 * // Breadcrumb with truncation for long paths
 * <Breadcrumb maxItems={3} collapseFrom="middle">
 *   // Long navigation path automatically truncated
 * </Breadcrumb>
 * \`\`\`
 */
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '../lib/utils';

export type BreadcrumbSeparator =
  | 'chevron-right' // ChevronRight icon (default)
  | 'slash' // / character
  | 'angle' // > character
  | 'arrow' // \u2192 character (U+2192)
  | 'pipe' // | character
  | 'dot' // \xB7 character (U+00B7)
  | React.ComponentType<{ className?: string; 'aria-hidden': true }>;

export type TruncationMode = 'smart' | 'end' | 'start';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  // Navigation intelligence
  maxItems?: number;
  truncationMode?: TruncationMode;

  // Separator intelligence
  separator?: BreadcrumbSeparator;
  separatorProps?: {
    className?: string;
    size?: number;
  };

  // Context optimization
  showHome?: boolean;
  homeIcon?: React.ComponentType<{ className?: string }>;
  homeLabel?: string;

  // Visual customization
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';

  // Progressive enhancement
  expandable?: boolean;
  responsive?: boolean;

  // Enhanced accessibility
  'aria-describedby'?: string;

  ref?: React.Ref<HTMLElement>;
}

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  truncated?: boolean;
  ref?: React.Ref<HTMLLIElement>;
}

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLAnchorElement>;
}

export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
}

// Separator intelligence with cognitive load ratings
const SEPARATOR_INTELLIGENCE = {
  'chevron-right': {
    cognitiveLoad: 2,
    contexts: ['general', 'admin', 'dashboard'],
    trustLevel: 'high',
    accessibility: 'excellent',
  },
  slash: {
    cognitiveLoad: 2,
    contexts: ['web', 'file-system', 'url-path'],
    trustLevel: 'high',
    accessibility: 'excellent',
  },
  angle: {
    cognitiveLoad: 2,
    contexts: ['command-line', 'technical', 'developer'],
    trustLevel: 'high',
    accessibility: 'excellent',
  },
  arrow: {
    cognitiveLoad: 3,
    contexts: ['editorial', 'storytelling', 'process-flow'],
    trustLevel: 'medium',
    accessibility: 'good',
  },
  pipe: {
    cognitiveLoad: 3,
    contexts: ['structured-data', 'admin', 'technical'],
    trustLevel: 'medium',
    accessibility: 'excellent',
  },
  dot: {
    cognitiveLoad: 2,
    contexts: ['minimal', 'mobile', 'compact'],
    trustLevel: 'medium',
    accessibility: 'excellent',
  },
} as const;

// Safe character separators with Unicode support
const SAFE_SEPARATORS = {
  slash: '/',
  angle: '>',
  arrow: '\u2192', // U+2192
  pipe: '|',
  dot: '\xB7', // U+00B7
} as const;

// Context for sharing separator configuration
const BreadcrumbContext = createContext<{
  separator: BreadcrumbSeparator;
  separatorProps?: { className?: string; size?: number };
}>({
  separator: 'chevron-right',
  separatorProps: undefined,
});

export function Breadcrumb({
  maxItems = 5,
  truncationMode = 'smart',
  separator = 'chevron-right',
  separatorProps,
  showHome = true,
  homeIcon: HomeIcon = Home,
  homeLabel = 'Home',
  size = 'md',
  variant = 'default',
  expandable = true,
  responsive = true,
  className,
  children,
  ref,
  ...props
}: BreadcrumbProps) {
  const [expanded, setExpanded] = useState(false);

  const renderSeparator = useCallback(() => {
    if (typeof separator === 'string') {
      const separatorMap = {
        'chevron-right': <ChevronRight className="w-4 h-4" aria-hidden="true" />,
        slash: SAFE_SEPARATORS.slash,
        angle: SAFE_SEPARATORS.angle,
        arrow: SAFE_SEPARATORS.arrow,
        pipe: SAFE_SEPARATORS.pipe,
        dot: SAFE_SEPARATORS.dot,
      };

      const separatorContent = separatorMap[separator];

      if (typeof separatorContent === 'string') {
        return (
          <span aria-hidden="true" className="select-none text-muted-foreground">
            {separatorContent}
          </span>
        );
      }

      return separatorContent;
    }

    // Custom Lucide icon
    const CustomIcon = separator;
    return (
      <CustomIcon
        aria-hidden={true}
        className="w-4 h-4 text-muted-foreground"
        {...separatorProps}
      />
    );
  }, [separator, separatorProps]);

  return (
    <BreadcrumbContext.Provider value={{ separator, separatorProps }}>
      <nav
        ref={ref}
        aria-label="Breadcrumb navigation"
        aria-describedby={props['aria-describedby']}
        className={cn(
          // Base styles with semantic tokens
          'flex items-center text-sm text-muted-foreground',

          // Size variants
          {
            'text-xs': size === 'sm',
            'text-sm': size === 'md',
            'text-base': size === 'lg',
          },

          // Variant styles
          {
            'opacity-100': variant === 'default',
            'opacity-75': variant === 'minimal',
          },

          className
        )}
        {...props}
      >
        <ol className="flex items-center space-x-2">{children}</ol>
      </nav>
    </BreadcrumbContext.Provider>
  );
}

export function BreadcrumbItem({ children, className, ref, ...props }: BreadcrumbItemProps) {
  return (
    <li ref={ref} className={cn('flex items-center', className)} {...props}>
      {children}
    </li>
  );
}

export function BreadcrumbLink({ children, className, ref, ...props }: BreadcrumbLinkProps) {
  return (
    <a
      ref={ref}
      className={cn(
        // Base interactive styles with semantic tokens
        'text-muted-foreground hover:text-foreground transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

        // Enhanced touch targets (WCAG AAA)
        'min-h-11 min-w-11 flex items-center justify-center rounded px-2 py-1',
        'touch-manipulation',

        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function BreadcrumbPage({ children, className, ref, ...props }: BreadcrumbPageProps) {
  return (
    <span
      ref={ref}
      aria-current="page"
      className={cn('text-foreground font-medium', className)}
      {...props}
    >
      {children}
    </span>
  );
}

export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  ref?: React.Ref<HTMLSpanElement>;
}

export function BreadcrumbSeparator({
  children,
  className,
  ref,
  ...props
}: BreadcrumbSeparatorProps) {
  const { separator, separatorProps } = useContext(BreadcrumbContext);

  const renderSeparatorContent = () => {
    if (children) return children;

    if (typeof separator === 'string') {
      const separatorMap = {
        'chevron-right': <ChevronRight className="w-4 h-4" aria-hidden="true" />,
        slash: SAFE_SEPARATORS.slash,
        angle: SAFE_SEPARATORS.angle,
        arrow: SAFE_SEPARATORS.arrow,
        pipe: SAFE_SEPARATORS.pipe,
        dot: SAFE_SEPARATORS.dot,
      };

      const separatorContent = separatorMap[separator];

      if (typeof separatorContent === 'string') {
        return (
          <span
            className={cn('text-muted-foreground', separatorProps?.className)}
            aria-hidden="true"
          >
            {separatorContent}
          </span>
        );
      }

      return separatorContent;
    }

    // Custom separator component
    const CustomIcon = separator;
    return (
      <CustomIcon
        aria-hidden={true}
        className="w-4 h-4 text-muted-foreground"
        {...separatorProps}
      />
    );
  };

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn('text-muted-foreground mx-2 select-none', className)}
      {...props}
    >
      {renderSeparatorContent()}
    </span>
  );
}

export interface BreadcrumbEllipsisProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
}

export function BreadcrumbEllipsis({ className, onClick, ref, ...props }: BreadcrumbEllipsisProps) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex items-center justify-center w-9 h-9 rounded-md',
        'text-muted-foreground hover:text-foreground',
        'hover:bg-accent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      aria-label="Show more navigation levels"
      onClick={onClick}
      {...props}
    >
      <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
    </button>
  );
}
`,
      dependencies: ['lucide-react'],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-breadcrumb--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 2,
            attentionEconomics:
              'Tertiary support: Never competes with primary content, provides spatial context only',
            accessibility:
              'Complete ARIA support with aria-current="page", aria-hidden separators, and keyboard navigation',
            trustBuilding:
              'Low trust routine navigation with predictable, reliable wayfinding patterns',
            semanticMeaning:
              'Wayfinding system with spatial context and navigation hierarchy indication ',
          },
          usagePatterns: {
            dos: [
              'Provide spatial context and navigation hierarchy',
              'Use clear current page indication with aria-current="page"',
              "Implement truncation strategies for long paths (Miller's Law)",
              'Configure separators with proper accessibility attributes',
            ],
            nevers: ['Use for primary actions, complex information, or critical alerts'],
          },
          designGuides: [
            {
              name: 'Wayfinding Intelligence',
              url: 'https://rafters.realhandy.tech/docs/llm/wayfinding-intelligence',
            },
            {
              name: 'Attention Economics',
              url: 'https://rafters.realhandy.tech/docs/llm/attention-economics',
            },
            {
              name: 'Navigation Integration',
              url: 'https://rafters.realhandy.tech/docs/llm/navigation-integration',
            },
          ],
          examples: [
            {
              code: '// Basic breadcrumb with navigation\n<Breadcrumb separator="chevron-right">\n<BreadcrumbItem href="/">Home</BreadcrumbItem>\n<BreadcrumbItem href="/products">Products</BreadcrumbItem>\n<BreadcrumbItem current>Product Detail</BreadcrumbItem>\n</Breadcrumb>\n\n// Breadcrumb with truncation for long paths\n<Breadcrumb maxItems={3} collapseFrom="middle">\n// Long navigation path automatically truncated\n</Breadcrumb>',
            },
          ],
        },
      },
    },
    {
      name: 'button',
      path: 'components/ui/Button.tsx',
      type: 'registry:component ',
      description: '',
      content: `/**
 * Interactive button component for user actions
 *
 * @registry-name button
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Button.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 3/10 - Simple action trigger with clear visual hierarchy
 * @attention-economics Size hierarchy: sm=tertiary actions, md=secondary interactions, lg=primary calls-to-action. Primary variant commands highest attention - use sparingly (maximum 1 per section)
 * @trust-building Destructive actions require confirmation patterns. Loading states prevent double-submission. Visual feedback reinforces user actions.
 * @accessibility WCAG AAA compliant with 44px minimum touch targets, high contrast ratios, and screen reader optimization
 * @semantic-meaning Variant mapping: primary=main actions, secondary=supporting actions, destructive=irreversible actions with safety patterns
 *
 * @usage-patterns
 * DO: Primary: Main user goal, maximum 1 per section  
 * DO: Secondary: Alternative paths, supporting actions
 * DO: Destructive: Permanent actions, requires confirmation patterns
 * NEVER: Multiple primary buttons competing for attention
 *
 * @design-guides
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 * - Component Patterns: https://rafters.realhandy.tech/docs/llm/component-patterns
 *
 * @dependencies @radix-ui/react-slot, @rafters/design-tokens/motion
 *
 * @example
 * \`\`\`tsx
 * // Primary action - highest attention, use once per section
 * <Button variant="primary">Save Changes</Button>
 * 
 * // Destructive action - requires confirmation UX
 * <Button variant="destructive" destructiveConfirm>Delete Account</Button>
 * 
 * // Loading state - prevents double submission
 * <Button loading>Processing...</Button>
 * \`\`\`
 */
import { Slot } from '@radix-ui/react-slot';
import { contextEasing, contextTiming } from '@rafters/design-tokens/motion';
import { cn } from '../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'info'
    | 'outline'
    | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'full';
  asChild?: boolean;
  loading?: boolean;
  destructiveConfirm?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export function Button({
  variant = 'primary',
  size = 'md',
  asChild = false,
  className,
  disabled,
  loading = false,
  destructiveConfirm = false,
  children,
  ref,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  // Trust-building: Show confirmation requirement for destructive actions
  const isDestructiveAction = variant === 'destructive';
  const shouldShowConfirmation = isDestructiveAction && destructiveConfirm;
  const isInteractionDisabled = disabled || loading;

  return (
    <Comp
      ref={ref}
      className={cn(
        // Base styles - using semantic tokens with proper interactive states
        'inline-flex items-center justify-center rounded-md text-sm font-medium',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-disabled',
        'transition-all',
        contextTiming.hover,
        contextEasing.hover,
        'hover:opacity-hover active:scale-active',

        // Loading state reduces opacity for trust-building
        loading && 'opacity-75 cursor-wait',

        // Attention economics: Destructive actions get visual weight
        isDestructiveAction && 'font-semibold shadow-sm',

        // Variants - all grayscale, using semantic tokens
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90':
            variant === 'destructive',
          'bg-success text-success-foreground hover:bg-success/90': variant === 'success',
          'bg-warning text-warning-foreground hover:bg-warning/90': variant === 'warning',
          'bg-info text-info-foreground hover:bg-info/90': variant === 'info',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground':
            variant === 'outline',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
        },

        // Attention economics: Size hierarchy for cognitive load
        {
          'h-8 px-3 text-xs': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-base': size === 'lg',
          'h-12 px-6 text-base w-full': size === 'full',
        },

        className
      )}
      disabled={isInteractionDisabled}
      aria-busy={loading}
      aria-label={shouldShowConfirmation ? \`Confirm to \${children}\` : undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {shouldShowConfirmation && !loading && (
            <span className="mr-1 text-xs font-bold" aria-hidden="true">
              !
            </span>
          )}
          {children}
        </>
      )}
    </Comp>
  );
}
`,
      dependencies: [
        '@radix-ui/react-slot',
        '@rafters/design-tokens/motion',
        '@rafters/design-tokens',
      ],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-button--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 3,
            attentionEconomics:
              'Size hierarchy: sm=tertiary actions, md=secondary interactions, lg=primary calls-to-action. Primary variant commands highest attention - use sparingly (maximum 1 per section)',
            accessibility:
              'WCAG AAA compliant with 44px minimum touch targets, high contrast ratios, and screen reader optimization',
            trustBuilding:
              'Destructive actions require confirmation patterns. Loading states prevent double-submission. Visual feedback reinforces user actions.',
            semanticMeaning:
              'Variant mapping: primary=main actions, secondary=supporting actions, destructive=irreversible actions with safety patterns ',
          },
          usagePatterns: {
            dos: [
              'Primary: Main user goal, maximum 1 per section',
              'Secondary: Alternative paths, supporting actions',
              'Destructive: Permanent actions, requires confirmation patterns',
            ],
            nevers: ['Multiple primary buttons competing for attention'],
          },
          designGuides: [
            {
              name: 'Attention Economics',
              url: 'https://rafters.realhandy.tech/docs/llm/attention-economics',
            },
            {
              name: 'Trust Building',
              url: 'https://rafters.realhandy.tech/docs/llm/trust-building',
            },
            {
              name: 'Component Patterns',
              url: 'https://rafters.realhandy.tech/docs/llm/component-patterns',
            },
          ],
          examples: [
            {
              code: '// Primary action - highest attention, use once per section\n<Button variant="primary">Save Changes</Button>\n\n// Destructive action - requires confirmation UX\n<Button variant="destructive" destructiveConfirm>Delete Account</Button>\n\n// Loading state - prevents double submission\n<Button loading>Processing...</Button>',
            },
          ],
        },
      },
    },
    {
      name: 'card',
      path: 'components/ui/Card.tsx',
      type: 'registry:component ',
      description: '',
      content:
        "/**\n * Flexible container component for grouping related content with semantic structure\n *\n * @registry-name card\n * @registry-version 0.1.0\n * @registry-status published\n * @registry-path components/ui/Card.tsx\n * @registry-type registry:component\n *\n * @cognitive-load 2/10 - Simple container with clear boundaries and minimal cognitive overhead\n * @attention-economics Neutral container: Content drives attention, elevation hierarchy for interactive states\n * @trust-building Consistent spacing, predictable interaction patterns, clear content boundaries\n * @accessibility Proper heading structure, landmark roles, keyboard navigation for interactive cards\n * @semantic-meaning Structural roles: article=standalone content, section=grouped content, aside=supplementary information\n *\n * @usage-patterns\n * DO: Group related information with clear visual boundaries\n * DO: Create interactive cards with hover states and focus management\n * DO: Establish information hierarchy with header, content, actions\n * DO: Implement responsive scaling with consistent proportions\n * NEVER: Use decorative containers without semantic purpose\n *\n * @design-guides\n * - Content Grouping: https://rafters.realhandy.tech/docs/llm/content-grouping\n * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics\n * - Spatial Relationships: https://rafters.realhandy.tech/docs/llm/spatial-relationships\n *\n * @dependencies @rafters/design-tokens/motion\n *\n * @example\n * ```tsx\n * // Basic card with content structure\n * <Card>\n *   <CardHeader>\n *     <CardTitle>Card Title</CardTitle>\n *     <CardDescription>Supporting description</CardDescription>\n *   </CardHeader>\n *   <CardContent>\n *     Main card content\n *   </CardContent>\n *   <CardFooter>\n *     <Button>Action</Button>\n *   </CardFooter>\n * </Card>\n * ```\n */\nimport { contextEasing, contextTiming } from '@rafters/design-tokens/motion';\nimport { cn } from '../lib/utils';\n\nexport interface CardProps extends React.HTMLAttributes<HTMLDivElement> {\n  /** Cognitive load: Card density for information hierarchy */\n  density?: 'compact' | 'comfortable' | 'spacious';\n  /** Cognitive load: Interaction affordance */\n  interactive?: boolean;\n  /** Scanability: Visual prominence for important cards */\n  prominence?: 'subtle' | 'default' | 'elevated';\n  ref?: React.Ref<HTMLDivElement>;\n}\n\nexport function Card({\n  className,\n  density = 'comfortable',\n  interactive = false,\n  prominence = 'default',\n  ref,\n  ...props\n}: CardProps) {\n  return (\n    <div\n      ref={ref}\n      className={cn(\n        'rounded-lg border bg-card text-card-foreground transition-all',\n        contextTiming.hover,\n        contextEasing.hover,\n        // Cognitive load: Information density controls\n        {\n          'border-border shadow-sm': prominence === 'subtle',\n          'border-border shadow-md': prominence === 'default',\n          'border-border shadow-lg': prominence === 'elevated',\n        },\n        // Interaction affordance: Clear hover states for interactive cards\n        interactive &&\n          'cursor-pointer hover:shadow-md hover:border-accent-foreground/20 hover:scale-[1.02] active:scale-[0.98]',\n        // Motor accessibility: Ensure adequate touch targets for interactive cards\n        interactive && 'min-h-[44px]',\n        className\n      )}\n      role={interactive ? 'button' : undefined}\n      tabIndex={interactive ? 0 : undefined}\n      {...props}\n    />\n  );\n}\n\nexport interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {\n  /** Cognitive load: Header density for information hierarchy */\n  density?: 'compact' | 'comfortable' | 'spacious';\n  ref?: React.Ref<HTMLDivElement>;\n}\n\nexport function CardHeader({ className, density = 'comfortable', ref, ...props }: CardHeaderProps) {\n  return (\n    <div\n      ref={ref}\n      className={cn(\n        'flex flex-col space-y-1.5',\n        // Cognitive load: Adaptive spacing based on information density\n        {\n          'p-4': density === 'compact',\n          'p-6': density === 'comfortable',\n          'p-8': density === 'spacious',\n        },\n        className\n      )}\n      {...props}\n    />\n  );\n}\n\nexport interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {\n  /** Information hierarchy: Semantic heading level */\n  level?: 1 | 2 | 3 | 4 | 5 | 6;\n  /** Scanability: Visual weight for content hierarchy */\n  weight?: 'normal' | 'medium' | 'semibold';\n  ref?: React.Ref<HTMLHeadingElement>;\n}\n\nexport function CardTitle({\n  className,\n  level = 3,\n  weight = 'semibold',\n  ref,\n  ...props\n}: CardTitleProps) {\n  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';\n\n  return (\n    <HeadingTag\n      ref={ref}\n      className={cn(\n        'leading-none tracking-tight',\n        // Information hierarchy: Semantic sizing based on heading level\n        {\n          'text-3xl': level === 1,\n          'text-2xl': level === 2,\n          'text-xl': level === 3,\n          'text-lg': level === 4,\n          'text-base': level === 5,\n          'text-sm': level === 6,\n        },\n        // Scanability: Visual weight options\n        {\n          'font-normal': weight === 'normal',\n          'font-medium': weight === 'medium',\n          'font-semibold': weight === 'semibold',\n        },\n        className\n      )}\n      {...props}\n    />\n  );\n}\n\nexport interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {\n  /** Cognitive load: Text length awareness for readability */\n  truncate?: boolean;\n  /** Information hierarchy: Subtle vs prominent descriptions */\n  prominence?: 'subtle' | 'default';\n  ref?: React.Ref<HTMLParagraphElement>;\n}\n\nexport function CardDescription({\n  className,\n  truncate = false,\n  prominence = 'default',\n  ref,\n  ...props\n}: CardDescriptionProps) {\n  return (\n    <p\n      ref={ref}\n      className={cn(\n        'text-sm leading-relaxed',\n        // Cognitive load: Truncation for long descriptions\n        truncate && 'line-clamp-2',\n        // Information hierarchy: Prominence levels\n        {\n          'text-muted-foreground/70': prominence === 'subtle',\n          'text-muted-foreground': prominence === 'default',\n        },\n        className\n      )}\n      {...props}\n    />\n  );\n}\n\nexport interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {\n  /** Cognitive load: Content density for information hierarchy */\n  density?: 'compact' | 'comfortable' | 'spacious';\n  /** Scanability: Content organization patterns */\n  layout?: 'default' | 'grid' | 'list';\n  ref?: React.Ref<HTMLDivElement>;\n}\n\nexport function CardContent({\n  className,\n  density = 'comfortable',\n  layout = 'default',\n  ref,\n  ...props\n}: CardContentProps) {\n  return (\n    <div\n      ref={ref}\n      className={cn(\n        'pt-0',\n        // Cognitive load: Adaptive spacing\n        {\n          'p-4': density === 'compact',\n          'p-6': density === 'comfortable',\n          'p-8': density === 'spacious',\n        },\n        // Scanability: Layout patterns\n        {\n          '': layout === 'default',\n          'grid grid-cols-1 gap-4': layout === 'grid',\n          'space-y-3': layout === 'list',\n        },\n        className\n      )}\n      {...props}\n    />\n  );\n}\n\nexport interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {\n  /** Cognitive load: Footer density and action clarity */\n  density?: 'compact' | 'comfortable' | 'spacious';\n  /** Scanability: Action hierarchy in footer */\n  justify?: 'start' | 'center' | 'end' | 'between';\n  ref?: React.Ref<HTMLDivElement>;\n}\n\nexport function CardFooter({\n  className,\n  density = 'comfortable',\n  justify = 'start',\n  ref,\n  ...props\n}: CardFooterProps) {\n  return (\n    <div\n      ref={ref}\n      className={cn(\n        'flex items-center pt-0',\n        // Cognitive load: Adaptive spacing\n        {\n          'p-4': density === 'compact',\n          'p-6': density === 'comfortable',\n          'p-8': density === 'spacious',\n        },\n        // Scanability: Action layout\n        {\n          'justify-start': justify === 'start',\n          'justify-center': justify === 'center',\n          'justify-end': justify === 'end',\n          'justify-between': justify === 'between',\n        },\n        className\n      )}\n      {...props}\n    />\n  );\n}\n",
      dependencies: ['@rafters/design-tokens/motion', '@rafters/design-tokens'],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-card--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 2,
            attentionEconomics:
              'Neutral container: Content drives attention, elevation hierarchy for interactive states',
            accessibility:
              'Proper heading structure, landmark roles, keyboard navigation for interactive cards',
            trustBuilding:
              'Consistent spacing, predictable interaction patterns, clear content boundaries',
            semanticMeaning:
              'Structural roles: article=standalone content, section=grouped content, aside=supplementary information ',
          },
          usagePatterns: {
            dos: [
              'Group related information with clear visual boundaries',
              'Create interactive cards with hover states and focus management',
              'Establish information hierarchy with header, content, actions',
              'Implement responsive scaling with consistent proportions',
            ],
            nevers: ['Use decorative containers without semantic purpose'],
          },
          designGuides: [
            {
              name: 'Content Grouping',
              url: 'https://rafters.realhandy.tech/docs/llm/content-grouping',
            },
            {
              name: 'Attention Economics',
              url: 'https://rafters.realhandy.tech/docs/llm/attention-economics',
            },
            {
              name: 'Spatial Relationships',
              url: 'https://rafters.realhandy.tech/docs/llm/spatial-relationships',
            },
          ],
          examples: [
            {
              code: '// Basic card with content structure\n<Card>\n<CardHeader>\n<CardTitle>Card Title</CardTitle>\n<CardDescription>Supporting description</CardDescription>\n</CardHeader>\n<CardContent>\nMain card content\n</CardContent>\n<CardFooter>\n<Button>Action</Button>\n</CardFooter>\n</Card>',
            },
          ],
        },
      },
    },
    {
      name: 'chip',
      path: 'components/ui/Chip.tsx',
      type: 'registry:component ',
      description: '',
      content: `/**
 * Notification chip component for status indicators and count overlays
 *
 * @registry-name chip
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Chip.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 5/10 - High visibility overlay requiring immediate attention (varies by variant)
 * @attention-economics Secondary overlay with maximum visibility without overwhelming primary content
 * @trust-building Critical status and count information builds user awareness and system transparency
 * @accessibility High contrast indicators, screen reader announcements, keyboard navigation support
 * @semantic-meaning Status communication: count=quantity indication, status=state indication, badge=feature marking, dot=simple presence indicator
 *
 * @usage-patterns
 * DO: Use for notification counts (unread messages, alerts, status updates)
 * DO: Provide status indicators (live, new, beta, premium features)
 * DO: Create urgent overlays that break component boundaries for maximum visibility
 * DO: Attach universally to buttons, cards, avatars, badges, any component
 * NEVER: Use for primary actions, complex information, or standalone content
 *
 * @design-guides
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Notification Intelligence: https://rafters.realhandy.tech/docs/llm/notification-intelligence
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 *
 * @dependencies class-variance-authority, clsx
 *
 * @example
 * \`\`\`tsx
 * // Notification count chip
 * <div className="relative">
 *   <Button>Messages</Button>
 *   <Chip variant="count" position="top-right">
 *     3
 *   </Chip>
 * </div>
 * 
 * // Status indicator chip
 * <div className="relative">
 *   <Badge>Premium</Badge>
 *   <Chip variant="dot" position="top-right" color="success" />
 * </div>
 * \`\`\`
 */
 * Accessibility: Full WCAG AAA compliance with screen reader count announcements
 */
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export type ChipVariant = 'urgent' | 'new' | 'live' | 'beta' | 'premium' | 'count';
export type ChipPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  // Core variant for semantic meaning
  variant: ChipVariant;

  // Positioning relative to parent component
  position?: ChipPosition;

  // Custom display value (numbers, text, icons)
  value?: string | number;

  // Size adaptation for parent component context
  size?: ChipSize;

  // Enhanced accessibility
  'aria-label'?: string;
}

// High visibility chip intelligence with attention economics
const CHIP_INTELLIGENCE = {
  urgent: {
    color: 'bg-destructive',
    textColor: 'text-destructive-foreground',
    cognitiveLoad: 9,
    attentionWeight: 'maximum',
    psychology: 'immediate_action_required',
    ariaLabel: 'Urgent notification',
  },
  new: {
    color: 'bg-primary',
    textColor: 'text-primary-foreground',
    cognitiveLoad: 6,
    attentionWeight: 'high',
    psychology: 'discovery_excitement',
    ariaLabel: 'New feature or content',
  },
  live: {
    color: 'bg-success',
    textColor: 'text-success-foreground',
    cognitiveLoad: 7,
    attentionWeight: 'high',
    psychology: 'real_time_awareness',
    ariaLabel: 'Live status indicator',
  },
  beta: {
    color: 'bg-warning',
    textColor: 'text-warning-foreground',
    cognitiveLoad: 4,
    attentionWeight: 'medium',
    psychology: 'experimental_caution',
    ariaLabel: 'Beta feature indicator',
  },
  premium: {
    color: 'bg-accent',
    textColor: 'text-accent-foreground',
    cognitiveLoad: 5,
    attentionWeight: 'medium',
    psychology: 'value_proposition',
    ariaLabel: 'Premium feature indicator',
  },
  count: {
    color: 'bg-destructive',
    textColor: 'text-destructive-foreground',
    cognitiveLoad: 8,
    attentionWeight: 'high',
    psychology: 'quantified_urgency',
    ariaLabel: 'Notification count',
  },
} as const;

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      variant,
      position = 'top-right',
      value,
      size = 'md',
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const chipInfo = CHIP_INTELLIGENCE[variant];
    const displayValue = value || (variant === 'count' ? '1' : '');

    return (
      <span
        ref={ref}
        className={cn(
          // High visibility positioning that breaks parent boundaries
          'absolute z-10 rounded-full font-bold leading-none',
          'min-w-5 h-5 flex items-center justify-center',
          'border-2 border-background', // Creates separation from parent
          chipInfo.color,
          chipInfo.textColor,

          // Position-specific styles (ALL break boundaries with -2px)
          {
            '-top-2 -right-2': position === 'top-right',
            '-top-2 -left-2': position === 'top-left',
            '-bottom-2 -right-2': position === 'bottom-right',
            '-bottom-2 -left-2': position === 'bottom-left',
          },

          // Size responsive
          {
            'text-xs min-w-4 h-4': size === 'sm',
            'text-xs min-w-5 h-5': size === 'md',
            'text-sm min-w-6 h-6': size === 'lg',
          },

          className
        )}
        aria-label={ariaLabel || \`\${chipInfo.ariaLabel}\${value ? \`: \${value}\` : ''}\`}
        aria-hidden="false" // Important for screen readers to announce counts
        {...props}
      >
        {displayValue}
      </span>
    );
  }
);

Chip.displayName = 'Chip';
`,
      dependencies: ['class-variance-authority', 'clsx'],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-chip--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 5,
            attentionEconomics:
              'Secondary overlay with maximum visibility without overwhelming primary content',
            accessibility:
              'High contrast indicators, screen reader announcements, keyboard navigation support',
            trustBuilding:
              'Critical status and count information builds user awareness and system transparency',
            semanticMeaning:
              'Status communication: count=quantity indication, status=state indication, badge=feature marking, dot=simple presence indicator ',
          },
          usagePatterns: {
            dos: [
              'Use for notification counts (unread messages, alerts, status updates)',
              'Provide status indicators (live, new, beta, premium features)',
              'Create urgent overlays that break component boundaries for maximum visibility',
              'Attach universally to buttons, cards, avatars, badges, any component',
            ],
            nevers: ['Use for primary actions, complex information, or standalone content'],
          },
          designGuides: [
            {
              name: 'Attention Economics',
              url: 'https://rafters.realhandy.tech/docs/llm/attention-economics',
            },
            {
              name: 'Notification Intelligence',
              url: 'https://rafters.realhandy.tech/docs/llm/notification-intelligence',
            },
            {
              name: 'Trust Building',
              url: 'https://rafters.realhandy.tech/docs/llm/trust-building',
            },
          ],
          examples: [
            {
              code: '// Notification count chip\n<div className="relative">\n<Button>Messages</Button>\n<Chip variant="count" position="top-right">\n3\n</Chip>\n</div>\n\n// Status indicator chip\n<div className="relative">\n<Badge>Premium</Badge>\n<Chip variant="dot" position="top-right" color="success" />\n</div>',
            },
          ],
        },
      },
    },
    {
      name: 'container',
      path: 'components/ui/Container.tsx',
      type: 'registry:component ',
      description: '',
      content: `/**
 * Layout container component for content width control and semantic structure
 *
 * @registry-name container
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Container.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 0/10 - Invisible structure that reduces visual complexity
 * @attention-economics Neutral structural element: Controls content width and breathing room without competing for attention
 * @trust-building Predictable boundaries and consistent spacing patterns
 * @accessibility Semantic HTML elements with proper landmark roles for screen readers
 * @semantic-meaning Content width control and semantic structure: main=primary content, section=grouped content, article=standalone content
 *
 * @usage-patterns
 * DO: Use padding prop for internal breathing room
 * DO: Control content boundaries with max-w-* classes
 * DO: Apply semantic structure with as="main|section|article"
 * DO: Maintain predictable component boundaries
 * NEVER: Use margins for content spacing (use padding instead)
 * NEVER: Unnecessarily nest containers or use fixed widths
 *
 * @design-guides
 * - Negative Space: https://rafters.realhandy.tech/docs/llm/negative-space
 * - Typography Intelligence: https://rafters.realhandy.tech/docs/llm/typography-intelligence
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies none
 *
 * @example
 * \`\`\`tsx
 * // Basic container with semantic structure
 * <Container as="main" padding="comfortable">
 *   Main page content
 * </Container>
 * 
 * // Article container with prose styling
 * <Container as="article" variant="prose">
 *   Long form content with optimal reading width
 * </Container>
 * \`\`\`
 */
import { cn } from '../lib/utils';
import './article-prose.css';

/**
 * Type map for polymorphic elements
 */
type ElementTypeMap = {
  div: HTMLDivElement;
  main: HTMLElement;
  section: HTMLElement;
  article: HTMLElement;
};

/**
 * Container component props with layout intelligence
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Container size using standard Tailwind max-width utilities
   * sm: max-w-sm (24rem)
   * md: max-w-md (28rem)
   * lg: max-w-lg (32rem)
   * xl: max-w-xl (36rem)
   * 2xl: max-w-2xl (42rem)
   * 3xl: max-w-3xl (48rem)
   * 4xl: max-w-4xl (56rem)
   * 5xl: max-w-5xl (64rem)
   * 6xl: max-w-6xl (72rem)
   * 7xl: max-w-7xl (80rem)
   * full: w-full (100%)
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';

  /**
   * Spacing using Tailwind native spacing tokens from design system
   * Maps to --spacing-* tokens that integrate with Tailwind's spacing scale
   */
  padding?:
    | '0'
    | 'px'
    | '0.5'
    | '1'
    | '1.5'
    | '2'
    | '2.5'
    | '3'
    | '3.5'
    | '4'
    | '5'
    | '6'
    | '8'
    | '10'
    | '12'
    | '16'
    | '20'
    | '24'
    | '32'
    | '40'
    | '48'
    | '56'
    | '64';

  /**
   * CSS Multi-column layout using Tailwind columns utilities
   * Automatically flows content into multiple columns for better readability
   */
  columns?:
    | 'auto'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | '11'
    | '12'
    | '3xs'
    | '2xs'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl';

  /**
   * Aspect ratio using Tailwind utilities and golden ratio
   * Standard ratios: square, video, etc.
   * Golden ratio: phi (1.618:1) and phi-inverse (1:1.618) for harmonious proportions
   */
  aspectRatio?:
    | 'auto'
    | 'square'
    | 'video'
    | '4/3'
    | '3/2'
    | '16/9'
    | '21/9'
    | 'phi'
    | 'phi-inverse';

  /**
   * Box-sizing behavior for predictable layouts
   * border-box: padding and border included in element's total width/height (recommended default)
   * content-box: padding and border added to element's width/height
   */
  boxSizing?: 'border-box' | 'content-box';

  /**
   * Overflow behavior for content that exceeds container bounds
   * Controls how content is handled when it doesn't fit
   */
  overflow?: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto';

  /**
   * Overflow behavior for x-axis (horizontal)
   */
  overflowX?: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto';

  /**
   * Overflow behavior for y-axis (vertical)
   */
  overflowY?: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto';

  /**
   * Overscroll behavior - what happens when user scrolls past boundaries
   * auto: default browser behavior (bounce, glow effects)
   * contain: prevent scroll chaining to parent elements
   * none: disable overscroll effects entirely
   */
  overscrollBehavior?: 'auto' | 'contain' | 'none';

  /**
   * Overscroll behavior for x-axis (horizontal)
   */
  overscrollBehaviorX?: 'auto' | 'contain' | 'none';

  /**
   * Overscroll behavior for y-axis (vertical)
   */
  overscrollBehaviorY?: 'auto' | 'contain' | 'none';

  /**
   * Z-index with semantic AI-friendly values for predictable stacking
   * auto: default stacking context
   * behind: z-[-1] - behind normal flow
   * base: z-0 - base layer
   * raised: z-10 - slightly elevated (dropdowns, tooltips)
   * overlay: z-20 - overlays, popovers
   * modal: z-30 - modal dialogs
   * notification: z-40 - toasts, notifications
   * menu: z-50 - navigation menus, mobile menus
   * tooltip: z-[60] - tooltips that need to be above everything
   * top: z-[9999] - absolutely must be on top
   */
  zIndex?:
    | 'auto'
    | 'behind'
    | 'base'
    | 'raised'
    | 'overlay'
    | 'modal'
    | 'notification'
    | 'menu'
    | 'tooltip'
    | 'top';

  /**
   * Container queries - native Tailwind v4 support
   * Makes this element a container query context for responsive child styling
   * Child elements can use @sm:, @md:, @lg: variants based on THIS container's size
   * containerType controls which dimensions to query: inline-size (width), block-size (height), or both
   */
  containerQuery?: boolean;
  containerType?: 'inline-size' | 'block-size' | 'size' | 'normal';

  /**
   * Semantic HTML element type for accessibility excellence
   * div: generic container (default)
   * main: primary content landmark
   * section: thematic grouping
   * article: standalone content
   */
  as?: 'div' | 'main' | 'section' | 'article';
  ref?: React.Ref<RefType>;
}

/**
 * Get the ref type for a given element
 */
type RefType = HTMLDivElement | HTMLElement;

/**
 * Container component with layout intelligence
 *
 * Provides responsive layout foundation using design system tokens:
 * - Uses design system container utilities (container-reading, container-golden)
 * - Phi-based spacing following golden ratio principles
 * - Semantic HTML support for accessibility
 * - Builds on existing Tailwind utilities and design tokens
 */
export function Container({
  size,
  padding,
  columns,
  aspectRatio,
  boxSizing,
  overflow,
  overflowX,
  overflowY,
  overscrollBehavior,
  overscrollBehaviorX,
  overscrollBehaviorY,
  zIndex,
  containerQuery,
  containerType = 'inline-size',
  as = 'div',
  className,
  children,
  ref,
  ...props
}: ContainerProps) {
  // Polymorphic component - render as specified element
  const Component = as;

  // Semantic defaults based on HTML element type
  const getSemanticDefaults = (element: string) => {
    switch (element) {
      case 'main':
        return {
          size: size ?? 'full', // Main content takes full width
          padding: padding ?? '8', // Comfortable breathing room
          overflow: overflow ?? 'auto', // Handle long content gracefully
          boxSizing: boxSizing ?? 'border-box',
          zIndex: zIndex ?? 'base', // Standard document flow
          containerQuery: containerQuery ?? true, // Enable container queries for responsive children
          containerType: containerType ?? 'inline-size',
        };

      case 'article':
        return {
          size: size ?? '4xl', // Optimal reading width ~65 characters
          padding: padding ?? '6', // Article breathing room
          overflow: overflow ?? 'visible', // Let content flow naturally
          boxSizing: boxSizing ?? 'border-box',
          zIndex: zIndex ?? 'base', // Standard document flow
          articleProse: true, // Enable automatic prose styling
          containerQuery: containerQuery ?? true, // Enable container queries for responsive children
          containerType: containerType ?? 'inline-size',
        };

      case 'section':
        return {
          size: size ?? '5xl', // Section container width
          padding: padding ?? '4', // Moderate section spacing
          overflow: overflow ?? 'visible', // Sections don't typically scroll
          boxSizing: boxSizing ?? 'border-box',
          zIndex: zIndex ?? 'base', // Standard document flow
          containerQuery: containerQuery ?? true, // Enable container queries for responsive children
          containerType: containerType ?? 'inline-size',
        };

      default: // div
        return {
          size: size ?? '4xl', // Generic container default
          padding: padding ?? '4', // Standard padding
          overflow: overflow, // No overflow default for divs
          boxSizing: boxSizing ?? 'border-box',
          zIndex: zIndex, // No z-index default for divs
          containerQuery: containerQuery ?? true, // Enable container queries for responsive children
          containerType: containerType ?? 'inline-size',
        };
    }
  };

  const defaults = getSemanticDefaults(as);

  // Container sizes using standard Tailwind max-width utilities
  const sizeVariants = {
    sm: 'max-w-sm mx-auto', // 24rem
    md: 'max-w-md mx-auto', // 28rem
    lg: 'max-w-lg mx-auto', // 32rem
    xl: 'max-w-xl mx-auto', // 36rem
    '2xl': 'max-w-2xl mx-auto', // 42rem
    '3xl': 'max-w-3xl mx-auto', // 48rem
    '4xl': 'max-w-4xl mx-auto', // 56rem
    '5xl': 'max-w-5xl mx-auto', // 64rem
    '6xl': 'max-w-6xl mx-auto', // 72rem
    '7xl': 'max-w-7xl mx-auto', // 80rem
    full: 'w-full', // 100%
  };

  // Spacing variants using Tailwind native spacing tokens from design system
  const paddingVariants = {
    '0': 'p-0', // --spacing-0
    px: 'p-px', // --spacing-px
    '0.5': 'p-0.5', // --spacing-0.5
    '1': 'p-1', // --spacing-1
    '1.5': 'p-1.5', // --spacing-1.5
    '2': 'p-2', // --spacing-2
    '2.5': 'p-2.5', // --spacing-2.5
    '3': 'p-3', // --spacing-3
    '3.5': 'p-3.5', // --spacing-3.5
    '4': 'p-4', // --spacing-4 (default)
    '5': 'p-5', // --spacing-5
    '6': 'p-6', // --spacing-6
    '8': 'p-8', // --spacing-8
    '10': 'p-10', // --spacing-10
    '12': 'p-12', // --spacing-12
    '16': 'p-16', // --spacing-16
    '20': 'p-20', // --spacing-20
    '24': 'p-24', // --spacing-24
    '32': 'p-32', // --spacing-32
    '40': 'p-40', // --spacing-40
    '48': 'p-48', // --spacing-48
    '56': 'p-56', // --spacing-56
    '64': 'p-64', // --spacing-64
  };

  // Column variants using Tailwind columns utilities
  const columnVariants = {
    auto: 'columns-auto',
    '1': 'columns-1',
    '2': 'columns-2',
    '3': 'columns-3',
    '4': 'columns-4',
    '5': 'columns-5',
    '6': 'columns-6',
    '7': 'columns-7',
    '8': 'columns-8',
    '9': 'columns-9',
    '10': 'columns-10',
    '11': 'columns-11',
    '12': 'columns-12',
    '3xs': 'columns-3xs',
    '2xs': 'columns-2xs',
    xs: 'columns-xs',
    sm: 'columns-sm',
    md: 'columns-md',
    lg: 'columns-lg',
    xl: 'columns-xl',
    '2xl': 'columns-2xl',
    '3xl': 'columns-3xl',
    '4xl': 'columns-4xl',
    '5xl': 'columns-5xl',
    '6xl': 'columns-6xl',
    '7xl': 'columns-7xl',
  };

  // Aspect ratio variants using Tailwind utilities and golden ratio
  const aspectRatioVariants = {
    auto: 'aspect-auto',
    square: 'aspect-square',
    video: 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    '16/9': 'aspect-[16/9]',
    '21/9': 'aspect-[21/9]',
    phi: 'aspect-[1.618/1]', // Golden ratio: \u03C6:1 (landscape)
    'phi-inverse': 'aspect-[1/1.618]', // Golden ratio inverse: 1:\u03C6 (portrait)
  };

  // Box-sizing variants for predictable layout behavior
  const boxSizingVariants = {
    'border-box': 'box-border', // padding/border included in width/height
    'content-box': 'box-content', // padding/border added to width/height
  };

  // Overflow variants for content handling
  const overflowVariants = {
    visible: 'overflow-visible',
    hidden: 'overflow-hidden',
    clip: 'overflow-clip',
    scroll: 'overflow-scroll',
    auto: 'overflow-auto',
  };

  const overflowXVariants = {
    visible: 'overflow-x-visible',
    hidden: 'overflow-x-hidden',
    clip: 'overflow-x-clip',
    scroll: 'overflow-x-scroll',
    auto: 'overflow-x-auto',
  };

  const overflowYVariants = {
    visible: 'overflow-y-visible',
    hidden: 'overflow-y-hidden',
    clip: 'overflow-y-clip',
    scroll: 'overflow-y-scroll',
    auto: 'overflow-y-auto',
  };

  // Overscroll behavior variants for scroll boundary handling
  const overscrollBehaviorVariants = {
    auto: 'overscroll-auto',
    contain: 'overscroll-contain',
    none: 'overscroll-none',
  };

  const overscrollBehaviorXVariants = {
    auto: 'overscroll-x-auto',
    contain: 'overscroll-x-contain',
    none: 'overscroll-x-none',
  };

  const overscrollBehaviorYVariants = {
    auto: 'overscroll-y-auto',
    contain: 'overscroll-y-contain',
    none: 'overscroll-y-none',
  };

  // Z-index variants with semantic AI-friendly stacking layers
  const zIndexVariants = {
    auto: 'z-auto', // Default stacking context
    behind: 'z-[-1]', // Behind normal flow
    base: 'z-0', // Base layer
    raised: 'z-10', // Slightly elevated (dropdowns, tooltips)
    overlay: 'z-20', // Overlays, popovers
    modal: 'z-30', // Modal dialogs
    notification: 'z-40', // Toasts, notifications
    menu: 'z-50', // Navigation menus, mobile menus
    tooltip: 'z-[60]', // Tooltips above everything
    top: 'z-[9999]', // Emergency top layer
  };

  // Container query variants for Tailwind v4 native support
  const containerQueryVariants = {
    'inline-size': '@container/inline-size', // Query based on width
    'block-size': '@container/block-size', // Query based on height
    size: '@container', // Query based on both dimensions (default)
    normal: '@container/normal', // Normal container context
  };

  return (
    <Component
      ref={ref as React.ForwardedRef<HTMLDivElement>}
      className={cn(
        // Box-sizing for predictable layout behavior (semantic defaults applied)
        boxSizingVariants[defaults.boxSizing],

        // Container size using Tailwind max-width utilities (semantic defaults)
        sizeVariants[defaults.size],

        // Tailwind native spacing using design system --spacing-* tokens (semantic defaults)
        paddingVariants[defaults.padding],

        // Multi-column layout if specified
        columns && columnVariants[columns],

        // Aspect ratio if specified
        aspectRatio && aspectRatioVariants[aspectRatio],

        // Overflow behavior (semantic defaults applied)
        defaults.overflow && overflowVariants[defaults.overflow],
        overflowX && overflowXVariants[overflowX],
        overflowY && overflowYVariants[overflowY],

        // Overscroll behavior
        overscrollBehavior && overscrollBehaviorVariants[overscrollBehavior],
        overscrollBehaviorX && overscrollBehaviorXVariants[overscrollBehaviorX],
        overscrollBehaviorY && overscrollBehaviorYVariants[overscrollBehaviorY],

        // Z-index stacking layer (semantic defaults applied)
        defaults.zIndex && zIndexVariants[defaults.zIndex],

        // Container query context (Tailwind v4 native support)
        containerQuery && containerQueryVariants[containerType],

        // Article prose styling using design system tokens
        defaults.articleProse && 'article-prose',

        // Custom classes
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
`,
      dependencies: ['none'],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-container--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 0,
            attentionEconomics:
              'Neutral structural element: Controls content width and breathing room without competing for attention',
            accessibility: 'Semantic HTML elements with proper landmark roles for screen readers',
            trustBuilding: 'Predictable boundaries and consistent spacing patterns',
            semanticMeaning:
              'Content width control and semantic structure: main=primary content, section=grouped content, article=standalone content ',
          },
          usagePatterns: {
            dos: [
              'Use padding prop for internal breathing room',
              'Control content boundaries with max-w-',
              'Apply semantic structure with as="main|section|article"',
              'Maintain predictable component boundaries',
            ],
            nevers: [
              'Use margins for content spacing (use padding instead)',
              'Unnecessarily nest containers or use fixed widths',
            ],
          },
          designGuides: [
            {
              name: 'Negative Space',
              url: 'https://rafters.realhandy.tech/docs/llm/negative-space',
            },
            {
              name: 'Typography Intelligence',
              url: 'https://rafters.realhandy.tech/docs/llm/typography-intelligence',
            },
            {
              name: 'Progressive Enhancement',
              url: 'https://rafters.realhandy.tech/docs/llm/progressive-enhancement',
            },
          ],
          examples: [
            {
              code: '// Basic container with semantic structure\n<Container as="main" padding="comfortable">\nMain page content\n</Container>\n\n// Article container with prose styling\n<Container as="article" variant="prose">\nLong form content with optimal reading width\n</Container>',
            },
          ],
        },
      },
    },
    {
      name: 'dialog',
      path: 'components/ui/Dialog.tsx',
      type: 'registry:component ',
      description: '',
      content:
        "/**\n * Modal dialog component with focus management and escape patterns\n *\n * @registry-name dialog\n * @registry-version 0.1.0\n * @registry-status published\n * @registry-path components/ui/Dialog.tsx\n * @registry-type registry:component\n *\n * @cognitive-load 6/10 - Interrupts user flow, requires decision making\n * @attention-economics Attention capture: modal=full attention, drawer=partial attention, popover=contextual attention\n * @trust-building Clear close mechanisms, confirmation for destructive actions, non-blocking for informational content\n * @accessibility Focus trapping, escape key handling, backdrop dismissal, screen reader announcements\n * @semantic-meaning Usage patterns: modal=blocking workflow, drawer=supplementary, alert=urgent information\n *\n * @usage-patterns\n * DO: Low trust - Quick confirmations, save draft (size=sm, minimal friction)\n * DO: Medium trust - Publish content, moderate consequences (clear context)\n * DO: High trust - Payments, significant impact (detailed explanation)\n * DO: Critical trust - Account deletion, permanent loss (progressive confirmation)\n * NEVER: Routine actions, non-essential interruptions\n *\n * @design-guides\n * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building\n * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load\n * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement\n *\n * @dependencies @radix-ui/react-dialog, @rafters/design-tokens/motion\n *\n * @example\n * ```tsx\n * // Critical trust dialog with confirmation\n * <Dialog>\n *   <DialogTrigger asChild>\n *     <Button variant=\"destructive\">Delete Account</Button>\n *   </DialogTrigger>\n *   <DialogContent trustLevel=\"critical\" destructive>\n *     <DialogTitle>Delete Account</DialogTitle>\n *     <DialogDescription>This action cannot be undone.</DialogDescription>\n *   </DialogContent>\n * </Dialog>\n * ```\n */\nimport * as DialogPrimitive from '@radix-ui/react-dialog';\nimport { contextEasing, contextTiming } from '@rafters/design-tokens/motion';\nimport { cn } from '../lib/utils';\n\nexport interface DialogProps {\n  // Trust-building intelligence\n  trustLevel?: 'low' | 'medium' | 'high' | 'critical';\n  destructive?: boolean;\n  requireConfirmation?: boolean;\n\n  // Cognitive load optimization\n  cognitiveComplexity?: 'simple' | 'moderate' | 'complex';\n\n  // Size variants for content hierarchy\n  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';\n}\n\nexport interface DialogOverlayProps\n  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {\n  ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Overlay>>;\n}\n\nexport interface DialogContentProps\n  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,\n    DialogProps {\n  ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Content>>;\n}\n\nexport interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {\n  ref?: React.Ref<HTMLDivElement>;\n}\n\nexport interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {\n  ref?: React.Ref<HTMLDivElement>;\n}\n\nexport interface DialogTitleProps\n  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {\n  ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Title>>;\n}\n\nexport interface DialogDescriptionProps\n  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {\n  ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Description>>;\n}\n\n// Root Dialog component\nexport const Dialog = DialogPrimitive.Root;\n\n// Trigger component\nexport const DialogTrigger = DialogPrimitive.Trigger;\n\n// Portal component for z-index management\nexport const DialogPortal = DialogPrimitive.Portal;\n\n// Overlay with trust-building visual hierarchy\nexport function DialogOverlay({ className, ref, ...props }: DialogOverlayProps) {\n  return (\n    <DialogPrimitive.Overlay\n      ref={ref}\n      className={cn(\n        // Base overlay with trust-building opacity\n        'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',\n        // Trust pattern: Smooth entrance reduces cognitive jarring\n        'data-[state=open]:animate-in data-[state=closed]:animate-out',\n        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',\n        className\n      )}\n      {...props}\n    />\n  );\n}\n\n// Main Content component with intelligence patterns\nexport function DialogContent({\n  className,\n  children,\n  trustLevel = 'medium',\n  destructive = false,\n  size = 'md',\n  cognitiveComplexity = 'moderate',\n  ref,\n  ...props\n}: DialogContentProps) {\n  return (\n    <DialogPortal>\n      <DialogOverlay />\n      <DialogPrimitive.Content\n        ref={ref}\n        className={cn(\n          // Base styles with trust-building visual hierarchy\n          'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',\n          'bg-background border border-border rounded-lg shadow-lg',\n          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',\n\n          // Trust-building: Enhanced borders for high-trust operations\n          trustLevel === 'critical' && 'border-2 border-primary/20 shadow-xl',\n          trustLevel === 'high' && 'border-primary/10 shadow-lg',\n\n          // Destructive actions get visual warning indicators\n          destructive && 'border-destructive/20 shadow-destructive/10',\n\n          // Size variants for cognitive load management\n          {\n            'w-full max-w-sm': size === 'sm',\n            'w-full max-w-md': size === 'md',\n            'w-full max-w-lg': size === 'lg',\n            'w-full max-w-2xl': size === 'xl',\n            'w-[95vw] max-w-none h-[95vh]': size === 'full',\n          },\n\n          // Cognitive complexity affects spacing\n          {\n            'p-4 gap-3': cognitiveComplexity === 'simple',\n            'p-6 gap-4': cognitiveComplexity === 'moderate',\n            'p-8 gap-6': cognitiveComplexity === 'complex',\n          },\n\n          // Trust pattern: Smooth animations reduce cognitive jarring\n          'transition-all',\n          contextTiming.modal,\n          contextEasing.modalEnter,\n          'data-[state=open]:animate-in data-[state=closed]:animate-out',\n          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',\n          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',\n          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',\n          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',\n\n          className\n        )}\n        {...props}\n      >\n        {children}\n      </DialogPrimitive.Content>\n    </DialogPortal>\n  );\n}\n\n// Header with trust-building hierarchy\nexport function DialogHeader({ className, ref, ...props }: DialogHeaderProps) {\n  return (\n    <div\n      ref={ref}\n      className={cn(\n        // Cognitive load optimization: Clear visual hierarchy\n        'flex flex-col space-y-2 text-center sm:text-left',\n        // Trust pattern: Adequate spacing prevents rushed decisions\n        'mb-4',\n        className\n      )}\n      {...props}\n    />\n  );\n}\n\n// Footer with action hierarchy and trust patterns\nexport function DialogFooter({ className, ref, ...props }: DialogFooterProps) {\n  return (\n    <div\n      ref={ref}\n      className={cn(\n        // Trust pattern: Actions flow from low to high commitment (left to right)\n        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',\n        // Motor accessibility: Enhanced spacing for touch targets\n        'space-y-2 sm:space-y-0 pt-4',\n        // Cognitive load: Clear separation from content\n        'border-t border-border/50 mt-6',\n        className\n      )}\n      {...props}\n    />\n  );\n}\n\n// Title with semantic hierarchy\nexport function DialogTitle({ className, ref, ...props }: DialogTitleProps) {\n  return (\n    <DialogPrimitive.Title\n      ref={ref}\n      className={cn(\n        // Cognitive load: Clear title hierarchy\n        'text-lg font-semibold leading-none tracking-tight',\n        // Trust pattern: Titles establish context and confidence\n        'text-foreground',\n        className\n      )}\n      {...props}\n    />\n  );\n}\n\n// Description with trust-building clarity\nexport function DialogDescription({ className, ref, ...props }: DialogDescriptionProps) {\n  return (\n    <DialogPrimitive.Description\n      ref={ref}\n      className={cn(\n        // Trust pattern: Clear explanation reduces uncertainty\n        'text-sm text-muted-foreground leading-relaxed',\n        // Cognitive load: Comfortable reading line height\n        'max-w-none',\n        className\n      )}\n      {...props}\n    />\n  );\n}\n\n// Close button with escape hatch accessibility\nexport const DialogClose = DialogPrimitive.Close;\n",
      dependencies: [
        '@radix-ui/react-dialog',
        '@rafters/design-tokens/motion',
        '@rafters/design-tokens',
      ],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-dialog--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 6,
            attentionEconomics:
              'Attention capture: modal=full attention, drawer=partial attention, popover=contextual attention',
            accessibility:
              'Focus trapping, escape key handling, backdrop dismissal, screen reader announcements',
            trustBuilding:
              'Clear close mechanisms, confirmation for destructive actions, non-blocking for informational content',
            semanticMeaning:
              'Usage patterns: modal=blocking workflow, drawer=supplementary, alert=urgent information ',
          },
          usagePatterns: {
            dos: [
              'Low trust - Quick confirmations, save draft (size=sm, minimal friction)',
              'Medium trust - Publish content, moderate consequences (clear context)',
              'High trust - Payments, significant impact (detailed explanation)',
              'Critical trust - Account deletion, permanent loss (progressive confirmation)',
            ],
            nevers: ['Routine actions, non-essential interruptions'],
          },
          designGuides: [
            {
              name: 'Trust Building',
              url: 'https://rafters.realhandy.tech/docs/llm/trust-building',
            },
            {
              name: 'Cognitive Load',
              url: 'https://rafters.realhandy.tech/docs/llm/cognitive-load',
            },
            {
              name: 'Progressive Enhancement',
              url: 'https://rafters.realhandy.tech/docs/llm/progressive-enhancement',
            },
          ],
          examples: [
            {
              code: '// Critical trust dialog with confirmation\n<Dialog>\n<DialogTrigger asChild>\n<Button variant="destructive">Delete Account</Button>\n</DialogTrigger>\n<DialogContent trustLevel="critical" destructive>\n<DialogTitle>Delete Account</DialogTitle>\n<DialogDescription>This action cannot be undone.</DialogDescription>\n</DialogContent>\n</Dialog>',
            },
          ],
        },
      },
    },
    {
      name: 'grid',
      path: 'components/ui/Grid.tsx',
      type: 'registry:component ',
      description: '',
      content:
        "/**\n * Intelligent layout grid with 4 semantic presets and embedded design reasoning for AI agents\n *\n * @registry-name grid\n * @registry-version 0.1.0\n * @registry-status published\n * @registry-path components/ui/Grid.tsx\n * @registry-type registry:component\n *\n * @cognitive-load 4/10 - Layout container with intelligent presets that respect Miller's Law\n * @attention-economics Preset hierarchy: linear=democratic attention, golden=hierarchical flow, bento=complex attention patterns, custom=user-defined\n * @trust-building Mathematical spacing (golden ratio), Miller's Law cognitive load limits, consistent preset behavior builds user confidence\n * @accessibility WCAG AAA compliance with keyboard navigation, screen reader patterns, and ARIA grid support for interactive layouts\n * @semantic-meaning Layout intelligence: linear=equal-priority content, golden=natural hierarchy, bento=content showcases with semantic asymmetry, custom=specialized layouts\n *\n * @usage-patterns\n * DO: Linear - Product catalogs, image galleries, equal-priority content\n * DO: Golden - Editorial layouts, feature showcases, natural hierarchy\n * DO: Bento - Editorial layouts, dashboards, content showcases (use sparingly)\n * DO: Custom - Specialized layouts requiring specific configurations\n * NEVER: Decorative asymmetry without semantic meaning\n * NEVER: Exceed cognitive load limits (8 items max on wide screens)\n *\n * @design-guides\n * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics\n * - Negative Space: https://rafters.realhandy.tech/docs/llm/negative-space\n * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load\n *\n * @dependencies class-variance-authority, clsx\n *\n * @example\n * ```tsx\n * // Linear grid for equal-priority content\n * <Grid preset=\"linear\" gap=\"comfortable\">\n *   <GridItem>Content 1</GridItem>\n *   <GridItem>Content 2</GridItem>\n * </Grid>\n * \n * // Bento layout with primary content\n * <Grid preset=\"bento\" bentoPattern=\"editorial\">\n *   <GridItem priority=\"primary\">Hero Article</GridItem>\n *   <GridItem priority=\"secondary\">Supporting Content</GridItem>\n * </Grid>\n * ```\n */\nimport { cn } from '../lib/utils';\n\n/**\n * Responsive value type for breakpoint-aware properties\n */\ntype ResponsiveValue<T> =\n  | T\n  | {\n      base?: T;\n      sm?: T;\n      md?: T;\n      lg?: T;\n      xl?: T;\n      '2xl'?: T;\n    };\n\n/**\n * Bento semantic patterns for content-driven asymmetric layouts\n * Each pattern encodes specific UX intelligence for AI decision-making\n */\ntype BentoPattern =\n  | 'editorial' // Hero article + supporting content\n  | 'dashboard' // Primary metric + supporting data\n  | 'feature-showcase' // Main feature + benefits\n  | 'portfolio'; // Featured work + gallery items\n\n/**\n * Grid preset types with embedded design intelligence\n */\ntype GridPreset =\n  | 'linear' // Equal columns, democratic attention (cognitive load: 2/10)\n  | 'golden' // Golden ratio proportions, hierarchical flow (cognitive load: 4/10)\n  | 'bento' // Semantic asymmetric layouts (cognitive load: 6/10)\n  | 'custom'; // User-defined configurations (cognitive load: variable)\n\n/**\n * Content priority for bento layouts\n * Drives both visual hierarchy and accessibility structure\n */\ntype ContentPriority =\n  | 'primary' // Hero content, main focus (2x attention weight)\n  | 'secondary' // Supporting content (1x attention weight)\n  | 'tertiary'; // Contextual content (0.5x attention weight)\n\n/**\n * Grid component props with layout intelligence\n */\nexport interface GridProps extends React.HTMLAttributes<HTMLElement> {\n  /**\n   * Intelligent preset system with embedded UX reasoning\n   * - linear: Democratic attention, predictable scanning (cognitive load: 2/10)\n   * - golden: Hierarchical attention, editorial flow (cognitive load: 4/10)\n   * - bento: Complex attention, content showcases (cognitive load: 6/10)\n   * - custom: User-defined layouts (cognitive load: variable)\n   */\n  preset?: GridPreset;\n\n  /**\n   * Semantic patterns for bento layouts\n   * Only applies when preset=\"bento\", drives layout intelligence\n   */\n  bentoPattern?: BentoPattern;\n\n  /**\n   * Column configuration - responsive or fixed\n   * Overrides preset behavior when using custom preset\n   */\n  columns?: ResponsiveValue<number | 'auto-fit' | 'auto-fill'>;\n\n  /**\n   * Auto-sizing intelligence using design tokens\n   * - 'sm': 200px minimum (compact cards)\n   * - 'md': 280px minimum (comfortable content)\n   * - 'lg': 360px minimum (rich content)\n   * - Custom: pixel value for specific requirements\n   */\n  autoFit?: 'sm' | 'md' | 'lg' | string;\n\n  /**\n   * Gap spacing using existing design system tokens\n   * Maps to Tailwind gap utilities and semantic spacing\n   */\n  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'comfortable' | 'generous';\n\n  /**\n   * Cognitive load management (Miller's Law 7\xB12)\n   * - number: Explicit limit\n   * - 'auto': Viewport-appropriate defaults (2/4/6/8)\n   */\n  maxItems?: number | 'auto';\n\n  /**\n   * Accessibility configuration\n   * - presentation: Layout-only grid (default)\n   * - grid: Interactive grid with keyboard navigation\n   * - none: No semantic role\n   */\n  role?: 'presentation' | 'grid' | 'none';\n\n  /**\n   * Accessible label for interactive grids\n   * Required when role=\"grid\"\n   */\n  ariaLabel?: string;\n\n  /**\n   * Label reference for interactive grids\n   * Alternative to ariaLabel when using external heading\n   */\n  ariaLabelledBy?: string;\n\n  /**\n   * Semantic HTML element type\n   * - div: Generic container (default)\n   * - section: Thematic grouping\n   * - main: Primary content landmark\n   * - article: Standalone content\n   */\n  as?: 'div' | 'section' | 'main' | 'article';\n\n  /**\n   * Focus change handler for interactive grids\n   * Enables keyboard navigation management\n   */\n  onFocusChange?: (position: { row: number; col: number }) => void;\n\n  ref?: React.Ref<HTMLElement>;\n  children: React.ReactNode;\n}\n\n/**\n * GridItem component props with priority-based intelligence\n */\nexport interface GridItemProps extends React.HTMLAttributes<HTMLElement> {\n  /**\n   * Column span using standard Tailwind utilities\n   * Can be responsive object for breakpoint-specific spanning\n   */\n  colSpan?: ResponsiveValue<number>;\n\n  /**\n   * Row span using standard Tailwind utilities\n   * Can be responsive object for breakpoint-specific spanning\n   */\n  rowSpan?: ResponsiveValue<number>;\n\n  /**\n   * Content priority for bento layouts\n   * Automatically calculates spanning based on priority level\n   */\n  priority?: ContentPriority;\n\n  /**\n   * Accessibility role for grid items\n   * - gridcell: Interactive grid cell (requires parent role=\"grid\")\n   * - none: No semantic role (default for presentation grids)\n   */\n  role?: 'gridcell' | 'none';\n\n  /**\n   * Accessible label for grid cells\n   * Helpful for complex content or interactive items\n   */\n  ariaLabel?: string;\n\n  /**\n   * Focus management for keyboard navigation\n   * Only applies when parent grid has role=\"grid\"\n   */\n  focusable?: boolean;\n\n  /**\n   * Semantic HTML element type\n   * - div: Generic container (default)\n   * - article: Standalone content\n   * - section: Thematic grouping\n   */\n  as?: 'div' | 'article' | 'section';\n\n  ref?: React.Ref<HTMLElement>;\n  children: React.ReactNode;\n}\n\n/**\n * Grid preset configurations with embedded UX intelligence\n * Each preset encodes specific cognitive load and attention patterns\n */\nconst GRID_PRESETS = {\n  linear: {\n    cognitiveLoad: 2,\n    trustLevel: 'high' as const,\n    attentionPattern: 'democratic',\n    description: 'Equal columns with predictable scanning patterns',\n    responsive: {\n      base: 'grid-cols-1',\n      sm: 'sm:grid-cols-2',\n      md: 'md:grid-cols-2',\n      lg: 'lg:grid-cols-3',\n      xl: 'xl:grid-cols-4',\n    },\n    usage: 'Product catalogs, image galleries, equal-priority content',\n  },\n\n  golden: {\n    cognitiveLoad: 4,\n    trustLevel: 'high' as const,\n    attentionPattern: 'hierarchical',\n    description: 'Golden ratio proportions for natural visual hierarchy',\n    responsive: {\n      base: 'grid-cols-1',\n      sm: 'sm:grid-cols-2',\n      md: 'md:grid-cols-3',\n      lg: 'lg:grid-cols-5', // Golden ratio relationship\n      xl: 'xl:grid-cols-5',\n    },\n    usage: 'Editorial layouts, feature showcases, content with natural hierarchy',\n  },\n\n  bento: {\n    cognitiveLoad: 6,\n    trustLevel: 'medium' as const,\n    attentionPattern: 'complex',\n    description: 'Semantic asymmetric layouts for content showcases',\n    responsive: {\n      base: 'grid-cols-1',\n      sm: 'sm:grid-cols-2',\n      md: 'md:grid-cols-3',\n      lg: 'lg:grid-cols-3', // Never exceed 3 columns for bento\n    },\n    usage: 'Editorial layouts, dashboards, content showcases requiring careful attention hierarchy',\n    patterns: {\n      editorial: {\n        template: 'lg:grid-cols-3 lg:grid-rows-2',\n        primarySpan: 'lg:col-span-2 lg:row-span-2',\n        secondarySpan: 'lg:col-span-1 lg:row-span-1',\n      },\n      dashboard: {\n        template: 'lg:grid-cols-4 lg:grid-rows-2',\n        primarySpan: 'lg:col-span-2 lg:row-span-1',\n        secondarySpan: 'lg:col-span-1 lg:row-span-1',\n      },\n      'feature-showcase': {\n        template: 'lg:grid-cols-3 lg:grid-rows-3',\n        primarySpan: 'lg:col-span-2 lg:row-span-2',\n        secondarySpan: 'lg:col-span-1 lg:row-span-1',\n      },\n      portfolio: {\n        template: 'lg:grid-cols-4 lg:grid-rows-3',\n        primarySpan: 'lg:col-span-2 lg:row-span-2',\n        secondarySpan: 'lg:col-span-1 lg:row-span-1',\n      },\n    },\n  },\n\n  custom: {\n    cognitiveLoad: 'variable' as const,\n    trustLevel: 'medium' as const,\n    attentionPattern: 'user-defined',\n    description: 'User-defined configurations for specialized layouts',\n    usage: 'Specialized layouts requiring specific grid configurations',\n  },\n} as const;\n\n/**\n * Gap spacing mapping to Tailwind utilities and semantic tokens\n */\nconst GAP_CLASSES = {\n  xs: 'gap-2', // 8px\n  sm: 'gap-3', // 12px\n  md: 'gap-4', // 16px\n  lg: 'gap-6', // 24px\n  xl: 'gap-8', // 32px\n  comfortable: 'gap-[1.618rem]', // Golden ratio \u03C6\n  generous: 'gap-[2.618rem]', // Golden ratio \u03C6\xB2\n} as const;\n\n/**\n * Auto-fit minimum widths using design tokens\n */\nconst AUTO_FIT_WIDTHS = {\n  sm: '200px', // Compact cards\n  md: '280px', // Comfortable content\n  lg: '360px', // Rich content\n} as const;\n\n/**\n * Cognitive load limits by viewport (Miller's Law implementation)\n */\nconst COGNITIVE_LIMITS = {\n  mobile: 2, // Small screens, touch interface\n  tablet: 4, // Medium screens, mixed interaction\n  desktop: 6, // Large screens, precise interaction\n  wide: 8, // Ultra-wide, professional use\n} as const;\n\n/**\n * Priority-based spanning for bento layouts\n * Automatically calculates grid item sizes based on content importance\n */\nconst PRIORITY_SPANS = {\n  primary: {\n    colSpan: 2,\n    rowSpan: 2,\n    cognitiveWeight: 8,\n    attentionValue: 'highest',\n  },\n  secondary: {\n    colSpan: 1,\n    rowSpan: 1,\n    cognitiveWeight: 4,\n    attentionValue: 'medium',\n  },\n  tertiary: {\n    colSpan: 1,\n    rowSpan: 1,\n    cognitiveWeight: 2,\n    attentionValue: 'supporting',\n  },\n} as const;\n\n/**\n * Grid Layout Intelligence Component\n *\n * Provides responsive grid layouts with embedded UX reasoning that AI agents\n * can understand and apply. Combines standard Tailwind utilities with\n * intelligent presets for systematic design decision-making.\n */\nexport function Grid({\n  preset = 'linear',\n  bentoPattern = 'editorial',\n  columns,\n  autoFit,\n  gap = 'md',\n  maxItems = 'auto',\n  role = 'presentation',\n  ariaLabel,\n  ariaLabelledBy,\n  as = 'div',\n  onFocusChange,\n  className,\n  children,\n  ref,\n  ...props\n}: GridProps) {\n  const Component = as;\n\n  // Get preset configuration\n  const presetConfig = GRID_PRESETS[preset];\n\n  // Build base grid classes\n  const getGridClasses = () => {\n    const classes: string[] = ['grid'];\n\n    // Apply preset-specific responsive classes\n    if (preset !== 'custom' && 'responsive' in presetConfig && presetConfig.responsive) {\n      for (const cls of Object.values(presetConfig.responsive)) {\n        if (cls) classes.push(cls);\n      }\n    }\n\n    // Apply bento pattern classes\n    if (preset === 'bento' && 'patterns' in presetConfig && presetConfig.patterns) {\n      const pattern = presetConfig.patterns[bentoPattern];\n      if (pattern) {\n        classes.push(pattern.template);\n      }\n    }\n\n    // Apply custom columns if specified\n    if (preset === 'custom' && columns) {\n      if (typeof columns === 'object' && 'base' in columns) {\n        // Responsive columns\n        if (columns.base) classes.push(`grid-cols-${columns.base}`);\n        if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);\n        if (columns.md) classes.push(`md:grid-cols-${columns.md}`);\n        if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);\n        if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);\n        if (columns['2xl']) classes.push(`2xl:grid-cols-${columns['2xl']}`);\n      } else {\n        // Simple columns\n        if (columns === 'auto-fit' || columns === 'auto-fill') {\n          // Handled by inline styles\n        } else {\n          classes.push(`grid-cols-${columns}`);\n        }\n      }\n    }\n\n    // Apply gap classes\n    classes.push(GAP_CLASSES[gap]);\n\n    return classes;\n  };\n\n  // Build inline styles for auto-sizing and custom gaps\n  const getInlineStyles = (): React.CSSProperties => {\n    const styles: React.CSSProperties = {};\n\n    // Handle auto-fit patterns\n    if (autoFit) {\n      const minWidth = AUTO_FIT_WIDTHS[autoFit as keyof typeof AUTO_FIT_WIDTHS] || autoFit;\n      styles.gridTemplateColumns = `repeat(auto-fit, minmax(${minWidth}, 1fr))`;\n    }\n\n    // Handle custom columns for auto patterns\n    if (preset === 'custom' && typeof columns === 'string') {\n      if (columns === 'auto-fit') {\n        const minWidth = autoFit\n          ? AUTO_FIT_WIDTHS[autoFit as keyof typeof AUTO_FIT_WIDTHS] || autoFit\n          : '250px';\n        styles.gridTemplateColumns = `repeat(auto-fit, minmax(${minWidth}, 1fr))`;\n      } else if (columns === 'auto-fill') {\n        const minWidth = autoFit\n          ? AUTO_FIT_WIDTHS[autoFit as keyof typeof AUTO_FIT_WIDTHS] || autoFit\n          : '250px';\n        styles.gridTemplateColumns = `repeat(auto-fill, minmax(${minWidth}, 1fr))`;\n      }\n    }\n\n    // Handle custom gaps that need inline styles (golden ratio gaps)\n    if (gap === 'comfortable' || gap === 'generous') {\n      if (gap === 'comfortable') {\n        styles.gap = '1.618rem'; // Golden ratio \u03C6\n      } else if (gap === 'generous') {\n        styles.gap = '2.618rem'; // Golden ratio \u03C6\xB2\n      }\n    }\n\n    return styles;\n  };\n\n  return (\n    <Component\n      ref={ref as React.ForwardedRef<HTMLDivElement>}\n      role={role}\n      aria-label={ariaLabel}\n      aria-labelledby={ariaLabelledBy}\n      tabIndex={role === 'grid' ? 0 : undefined}\n      className={cn(\n        ...getGridClasses(),\n        // Focus management for interactive grids\n        role === 'grid' && [\n          'focus-visible:outline-none',\n          'focus-visible:ring-2',\n          'focus-visible:ring-primary',\n          'focus-visible:ring-offset-2',\n        ],\n        className\n      )}\n      style={{\n        ...getInlineStyles(),\n        ...props.style,\n      }}\n      {...props}\n    >\n      {children}\n    </Component>\n  );\n}\n\n/**\n * GridItem companion component with priority-based intelligence\n *\n * Provides semantic grid items with automatic sizing based on content\n * priority and accessibility integration for screen readers.\n */\nexport function GridItem({\n  colSpan,\n  rowSpan,\n  priority,\n  role = 'none',\n  ariaLabel,\n  focusable = false,\n  as = 'div',\n  className,\n  children,\n  ref,\n  ...props\n}: GridItemProps) {\n  const Component = as;\n\n  // Get priority-based spans for bento layouts\n  const getPrioritySpans = () => {\n    if (priority && PRIORITY_SPANS[priority]) {\n      const spans = PRIORITY_SPANS[priority];\n      return {\n        colSpan: spans.colSpan,\n        rowSpan: spans.rowSpan,\n      };\n    }\n    return { colSpan, rowSpan };\n  };\n\n  const { colSpan: finalColSpan, rowSpan: finalRowSpan } = getPrioritySpans();\n\n  // Build span classes\n  const getSpanClasses = () => {\n    const classes: string[] = [];\n\n    // Handle responsive colSpan\n    if (finalColSpan) {\n      if (typeof finalColSpan === 'object' && 'base' in finalColSpan) {\n        if (finalColSpan.base) classes.push(`col-span-${finalColSpan.base}`);\n        if (finalColSpan.sm) classes.push(`sm:col-span-${finalColSpan.sm}`);\n        if (finalColSpan.md) classes.push(`md:col-span-${finalColSpan.md}`);\n        if (finalColSpan.lg) classes.push(`lg:col-span-${finalColSpan.lg}`);\n        if (finalColSpan.xl) classes.push(`xl:col-span-${finalColSpan.xl}`);\n        if (finalColSpan['2xl']) classes.push(`2xl:col-span-${finalColSpan['2xl']}`);\n      } else {\n        classes.push(`col-span-${finalColSpan}`);\n      }\n    }\n\n    // Handle responsive rowSpan\n    if (finalRowSpan) {\n      if (typeof finalRowSpan === 'object' && 'base' in finalRowSpan) {\n        if (finalRowSpan.base) classes.push(`row-span-${finalRowSpan.base}`);\n        if (finalRowSpan.sm) classes.push(`sm:row-span-${finalRowSpan.sm}`);\n        if (finalRowSpan.md) classes.push(`md:row-span-${finalRowSpan.md}`);\n        if (finalRowSpan.lg) classes.push(`lg:row-span-${finalRowSpan.lg}`);\n        if (finalRowSpan.xl) classes.push(`xl:row-span-${finalRowSpan.xl}`);\n        if (finalRowSpan['2xl']) classes.push(`2xl:row-span-${finalRowSpan['2xl']}`);\n      } else {\n        classes.push(`row-span-${finalRowSpan}`);\n      }\n    }\n\n    return classes;\n  };\n\n  return (\n    <Component\n      ref={ref as React.ForwardedRef<HTMLDivElement>}\n      role={role}\n      aria-label={ariaLabel}\n      tabIndex={focusable ? 0 : undefined}\n      className={cn(\n        ...getSpanClasses(),\n        // Focus management for interactive grid items\n        focusable && [\n          'focus-visible:outline-none',\n          'focus-visible:ring-2',\n          'focus-visible:ring-primary',\n          'focus-visible:ring-offset-1',\n        ],\n        // Touch target compliance for interactive items\n        role === 'gridcell' && [\n          'min-h-[44px]', // WCAG AAA minimum\n          'min-w-[44px]',\n        ],\n        className\n      )}\n      {...props}\n    >\n      {children}\n    </Component>\n  );\n}\n",
      dependencies: ['class-variance-authority', 'clsx'],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-grid--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 4,
            attentionEconomics:
              'Preset hierarchy: linear=democratic attention, golden=hierarchical flow, bento=complex attention patterns, custom=user-defined',
            accessibility:
              'WCAG AAA compliance with keyboard navigation, screen reader patterns, and ARIA grid support for interactive layouts',
            trustBuilding:
              "Mathematical spacing (golden ratio), Miller's Law cognitive load limits, consistent preset behavior builds user confidence",
            semanticMeaning:
              'Layout intelligence: linear=equal-priority content, golden=natural hierarchy, bento=content showcases with semantic asymmetry, custom=specialized layouts ',
          },
          usagePatterns: {
            dos: [
              'Linear - Product catalogs, image galleries, equal-priority content',
              'Golden - Editorial layouts, feature showcases, natural hierarchy',
              'Bento - Editorial layouts, dashboards, content showcases (use sparingly)',
              'Custom - Specialized layouts requiring specific configurations',
            ],
            nevers: [
              'Decorative asymmetry without semantic meaning',
              'Exceed cognitive load limits (8 items max on wide screens)',
            ],
          },
          designGuides: [
            {
              name: 'Attention Economics',
              url: 'https://rafters.realhandy.tech/docs/llm/attention-economics',
            },
            {
              name: 'Negative Space',
              url: 'https://rafters.realhandy.tech/docs/llm/negative-space',
            },
            {
              name: 'Cognitive Load',
              url: 'https://rafters.realhandy.tech/docs/llm/cognitive-load',
            },
          ],
          examples: [
            {
              code: '// Linear grid for equal-priority content\n<Grid preset="linear" gap="comfortable">\n<GridItem>Content 1</GridItem>\n<GridItem>Content 2</GridItem>\n</Grid>\n\n// Bento layout with primary content\n<Grid preset="bento" bentoPattern="editorial">\n<GridItem priority="primary">Hero Article</GridItem>\n<GridItem priority="secondary">Supporting Content</GridItem>\n</Grid>',
            },
          ],
        },
      },
    },
    {
      name: 'input',
      path: 'components/ui/Input.tsx',
      type: 'registry:component ',
      description: '',
      content: `/**
 * Form input component with validation states and accessibility
 *
 * @registry-name input
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Input.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 4/10 - Data entry with validation feedback requires user attention
 * @attention-economics State hierarchy: default=ready, focus=active input, error=requires attention, success=validation passed
 * @trust-building Clear validation feedback, error recovery patterns, progressive enhancement
 * @accessibility Screen reader labels, validation announcements, keyboard navigation, high contrast support
 * @semantic-meaning Type-appropriate validation: email=format validation, password=security indicators, number=range constraints
 *
 * @usage-patterns
 * DO: Always pair with descriptive Label component
 * DO: Use helpful placeholders showing format examples
 * DO: Provide real-time validation for user confidence
 * DO: Use appropriate input types for sensitive data
 * NEVER: Label-less inputs, validation only on submit, unclear error messages
 *
 * @design-guides
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 * - Typography Intelligence: https://rafters.realhandy.tech/docs/llm/typography-intelligence
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies @rafters/design-tokens/motion
 *
 * @example
 * \`\`\`tsx
 * // Basic input with validation
 * <Input variant="error" validationMessage="Required field" showValidation />
 * 
 * // Sensitive data input
 * <Input type="password" sensitive />
 * 
 * // Real-time validation
 * <Input validationMode="live" variant="success" />
 * \`\`\`
 */
import { contextEasing, contextTiming } from '@rafters/design-tokens/motion';
import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success' | 'warning';
  validationMode?: 'live' | 'onBlur' | 'onSubmit';
  sensitive?: boolean;
  showValidation?: boolean;
  validationMessage?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({
  variant = 'default',
  validationMode = 'onBlur',
  sensitive = false,
  showValidation = false,
  validationMessage,
  className,
  type,
  ref,
  ...props
}: InputProps) {
  // Trust-building: Visual indicators for sensitive data
  const isSensitiveData = sensitive || type === 'password' || type === 'email';

  // Validation intelligence: Choose appropriate feedback timing
  const needsImmediateFeedback = variant === 'error' && validationMode === 'live';
  const hasValidationState = variant !== 'default';

  return (
    <div className="relative">
      <input
        ref={ref}
        type={type}
        className={cn(
          // Base styles - using semantic tokens with motor accessibility
          'flex h-10 w-full rounded-md border px-3 py-2 text-sm',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-disabled',
          'transition-all',
          contextTiming.hover,
          contextEasing.hover,
          'hover:opacity-hover',

          // Motor accessibility: Enhanced touch targets on mobile
          'min-h-[44px] sm:min-h-[40px]',

          // Trust-building: Visual indicators for sensitive data
          isSensitiveData && 'shadow-sm border-2',

          // Validation intelligence: Semantic variants with clear meaning
          {
            'border-input bg-background focus-visible:ring-primary': variant === 'default',
            'border-destructive bg-destructive/10 focus-visible:ring-destructive text-destructive-foreground':
              variant === 'error',
            'border-success bg-success/10 focus-visible:ring-success text-success-foreground':
              variant === 'success',
            'border-warning bg-warning/10 focus-visible:ring-warning text-warning-foreground':
              variant === 'warning',
          },

          // Enhanced styling for immediate feedback mode
          needsImmediateFeedback && 'ring-2 ring-destructive/20',

          className
        )}
        aria-invalid={variant === 'error'}
        aria-describedby={
          showValidation && validationMessage ? \`\${props.id || 'input'}-validation\` : undefined
        }
        {...props}
      />

      {/* Validation message with semantic meaning */}
      {showValidation && validationMessage && (
        <div
          id={\`\${props.id || 'input'}-validation\`}
          className={cn('mt-1 text-xs flex items-center gap-1', {
            'text-destructive': variant === 'error',
            'text-success': variant === 'success',
            'text-warning': variant === 'warning',
          })}
          role={variant === 'error' ? 'alert' : 'status'}
          aria-live={needsImmediateFeedback ? 'assertive' : 'polite'}
        >
          {/* Visual indicator for validation state */}
          {variant === 'error' && (
            <span
              className="w-3 h-3 rounded-full bg-destructive/20 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="w-1 h-1 rounded-full bg-destructive" />
            </span>
          )}
          {variant === 'success' && (
            <span
              className="w-3 h-3 rounded-full bg-success/20 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="w-1 h-1 rounded-full bg-success" />
            </span>
          )}
          {variant === 'warning' && (
            <span
              className="w-3 h-3 rounded-full bg-warning/20 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="w-1 h-1 rounded-full bg-warning" />
            </span>
          )}
          {validationMessage}
        </div>
      )}

      {/* Trust-building indicator for sensitive data */}
      {isSensitiveData && (
        <div
          className="absolute right-2 top-2 w-2 h-2 rounded-full bg-primary/30"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
`,
      dependencies: ['@rafters/design-tokens/motion', '@rafters/design-tokens'],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-input--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 4,
            attentionEconomics:
              'State hierarchy: default=ready, focus=active input, error=requires attention, success=validation passed',
            accessibility:
              'Screen reader labels, validation announcements, keyboard navigation, high contrast support',
            trustBuilding:
              'Clear validation feedback, error recovery patterns, progressive enhancement',
            semanticMeaning:
              'Type-appropriate validation: email=format validation, password=security indicators, number=range constraints ',
          },
          usagePatterns: {
            dos: [
              'Always pair with descriptive Label component',
              'Use helpful placeholders showing format examples',
              'Provide real-time validation for user confidence',
              'Use appropriate input types for sensitive data',
            ],
            nevers: ['Label-less inputs, validation only on submit, unclear error messages'],
          },
          designGuides: [
            {
              name: 'Trust Building',
              url: 'https://rafters.realhandy.tech/docs/llm/trust-building',
            },
            {
              name: 'Typography Intelligence',
              url: 'https://rafters.realhandy.tech/docs/llm/typography-intelligence',
            },
            {
              name: 'Progressive Enhancement',
              url: 'https://rafters.realhandy.tech/docs/llm/progressive-enhancement',
            },
          ],
          examples: [
            {
              code: '// Basic input with validation\n<Input variant="error" validationMessage="Required field" showValidation />\n\n// Sensitive data input\n<Input type="password" sensitive />\n\n// Real-time validation\n<Input validationMode="live" variant="success" />',
            },
          ],
        },
      },
    },
    {
      name: 'label',
      path: 'components/ui/Label.tsx',
      type: 'registry:component ',
      description: '',
      content: `/**
 * Form label component with semantic variants and accessibility associations
 *
 * @registry-name label
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Label.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 2/10 - Provides clarity and reduces interpretation effort
 * @attention-economics Information hierarchy: field=required label, hint=helpful guidance, error=attention needed
 * @trust-building Clear requirement indication, helpful hints, non-punitive error messaging
 * @accessibility Form association, screen reader optimization, color-independent error indication
 * @semantic-meaning Variant meanings: field=input association, hint=guidance, error=validation feedback, success=confirmation
 *
 * @usage-patterns
 * DO: Always associate with input using htmlFor/id
 * DO: Use importance levels to guide user attention
 * DO: Provide visual and semantic marking for required fields
 * DO: Adapt styling based on form vs descriptive context
 * NEVER: Orphaned labels, unclear or ambiguous text, missing required indicators
 *
 * @design-guides
 * - Typography Intelligence: https://rafters.realhandy.tech/docs/llm/typography-intelligence
 * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies @radix-ui/react-label
 *
 * @example
 * \`\`\`tsx
 * // Form label with required indication
 * <Label htmlFor="email" required>
 *   Email Address
 * </Label>
 * <Input id="email" type="email" />
 * 
 * // Label with validation state
 * <Label variant="error" htmlFor="password">
 *   Password (required)
 * </Label>
 * \`\`\`
 */
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '../lib/utils';

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  required?: boolean;
  importance?: 'critical' | 'standard' | 'optional';
  context?: 'form' | 'descriptive' | 'action';
  validationState?: 'error' | 'warning' | 'success' | 'default';
  helpText?: string;
  semantic?: boolean;
  ref?: React.Ref<React.ElementRef<typeof LabelPrimitive.Root>>;
}

export function Label({
  className,
  required,
  importance = 'standard',
  context = 'form',
  validationState = 'default',
  helpText,
  semantic = true,
  children,
  ref,
  ...props
}: LabelProps) {
  return (
    <div className={cn('space-y-1', semantic && 'semantic-label-container')}>
      <LabelPrimitive.Root
        ref={ref}
        className={cn(
          // Base label styling
          'text-sm leading-none text-foreground',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-disabled',

          // Importance-based visual hierarchy
          {
            'font-semibold': importance === 'critical',
            'font-medium': importance === 'standard',
            'font-normal opacity-75': importance === 'optional',
          },

          // Context-specific styling
          {
            'cursor-pointer': context === 'form',
            'cursor-default': context === 'descriptive',
            'cursor-pointer hover:text-accent-foreground': context === 'action',
          },

          // Validation state colors
          {
            'text-destructive': validationState === 'error',
            'text-warning': validationState === 'warning',
            'text-success': validationState === 'success',
          },

          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span
            className={cn(
              'ml-1',
              validationState === 'error' ? 'text-destructive' : 'text-destructive'
            )}
            aria-label="required field"
          >
            *
          </span>
        )}
        {importance === 'optional' && !required && (
          <span className="ml-1 text-muted-foreground text-xs font-normal">(optional)</span>
        )}
      </LabelPrimitive.Root>

      {helpText && (
        <p
          className={cn('text-xs text-muted-foreground', {
            'text-destructive': validationState === 'error',
            'text-warning': validationState === 'warning',
            'text-success': validationState === 'success',
          })}
          role={validationState === 'error' ? 'alert' : 'status'}
          aria-live={validationState === 'error' ? 'assertive' : 'polite'}
        >
          {helpText}
        </p>
      )}
    </div>
  );
}
`,
      dependencies: ['@radix-ui/react-label'],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-label--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 2,
            attentionEconomics:
              'Information hierarchy: field=required label, hint=helpful guidance, error=attention needed',
            accessibility:
              'Form association, screen reader optimization, color-independent error indication',
            trustBuilding:
              'Clear requirement indication, helpful hints, non-punitive error messaging',
            semanticMeaning:
              'Variant meanings: field=input association, hint=guidance, error=validation feedback, success=confirmation ',
          },
          usagePatterns: {
            dos: [
              'Always associate with input using htmlFor/id',
              'Use importance levels to guide user attention',
              'Provide visual and semantic marking for required fields',
              'Adapt styling based on form vs descriptive context',
            ],
            nevers: ['Orphaned labels, unclear or ambiguous text, missing required indicators'],
          },
          designGuides: [
            {
              name: 'Typography Intelligence',
              url: 'https://rafters.realhandy.tech/docs/llm/typography-intelligence',
            },
            {
              name: 'Cognitive Load',
              url: 'https://rafters.realhandy.tech/docs/llm/cognitive-load',
            },
            {
              name: 'Progressive Enhancement',
              url: 'https://rafters.realhandy.tech/docs/llm/progressive-enhancement',
            },
          ],
          examples: [
            {
              code: '// Form label with required indication\n<Label htmlFor="email" required>\nEmail Address\n</Label>\n<Input id="email" type="email" />\n\n// Label with validation state\n<Label variant="error" htmlFor="password">\nPassword (required)\n</Label>',
            },
          ],
        },
      },
    },
    {
      name: 'progress',
      path: 'components/ui/Progress.tsx',
      type: 'registry:component ',
      description: '',
      content:
        "import * as ProgressPrimitive from '@radix-ui/react-progress';\nimport { contextEasing, contextTiming, easing, timing } from '@rafters/design-tokens/motion';\nimport { type VariantProps, cva } from 'class-variance-authority';\nimport type { ComponentPropsWithoutRef, ElementRef } from 'react';\nimport { cn } from '../lib/utils';\nimport { Button } from './Button';\n\n/**\n * Progress indicator component with time estimation and completion intelligence\n *\n * @registry-name progress\n * @registry-version 0.1.0\n * @registry-status published\n * @registry-path components/ui/Progress.tsx\n * @registry-type registry:component\n *\n * @cognitive-load 4/10 - Moderate attention required for progress monitoring\n * @attention-economics Temporal attention: Holds user attention during wait states with clear progress indication\n * @trust-building Accurate progress builds user confidence, clear completion states and next steps\n * @accessibility Screen reader announcements, keyboard navigation, high contrast support\n * @semantic-meaning Progress communication: determinate=known duration, indeterminate=unknown duration, completed=finished state\n *\n * @usage-patterns\n * DO: Provide accurate progress indication with time estimation\n * DO: Use visual patterns that match task characteristics\n * DO: Show clear completion states and next steps\n * DO: Optimize information density based on cognitive load\n * NEVER: Inaccurate progress bars, missing completion feedback, unclear time estimates\n *\n * @design-guides\n * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building\n * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics\n * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement\n *\n * @dependencies @radix-ui/react-progress, @rafters/design-tokens/motion, class-variance-authority\n *\n * @example\n * ```tsx\n * // Determinate progress with percentage\n * <Progress value={65} max={100} />\n * \n * // Progress with time estimation\n * <Progress\n *   value={30}\n *   max={100}\n *   showTimeRemaining\n *   estimatedTimeRemaining=\"2 minutes\"\n * />\n * ```\n */\n\nconst progressVariants = cva(\n  'relative h-2 w-full overflow-hidden rounded-full bg-background-subtle',\n  {\n    variants: {\n      variant: {\n        bar: 'h-2',\n        thin: 'h-1',\n        thick: 'h-3',\n        circle: 'h-16 w-16 rounded-full',\n        steps: 'h-auto bg-transparent',\n      },\n      pattern: {\n        linear: '',\n        accelerating: `[&>div]:transition-all [&>div]:${contextTiming.modal} [&>div]:${contextEasing.modalEnter}`,\n        decelerating: `[&>div]:transition-all [&>div]:${contextTiming.progress} [&>div]:${contextEasing.modalExit}`,\n        pulsing: `[&>div]:${contextTiming.skeleton} [&>div]:${contextEasing.loading} [&>div]:pulse-animation`,\n      },\n      complexity: {\n        simple: 'gap-1',\n        detailed: 'gap-2',\n      },\n    },\n    defaultVariants: {\n      variant: 'bar',\n      pattern: 'linear',\n      complexity: 'simple',\n    },\n  }\n);\n\nconst progressIndicatorVariants = cva('h-full w-full flex-1 bg-primary transition-all', {\n  variants: {\n    pattern: {\n      linear: `transition-transform ${contextTiming.progress} ${contextEasing.progress}`,\n      accelerating: `transition-transform ${contextTiming.modal} ${contextEasing.modalEnter}`,\n      decelerating: `transition-transform ${contextTiming.progress} ${contextEasing.modalExit}`,\n      pulsing: `${contextTiming.skeleton} ${contextEasing.loading} animate-pulse`,\n    },\n    status: {\n      default: 'bg-primary',\n      success: 'bg-success',\n      warning: 'bg-warning',\n      error: 'bg-destructive',\n    },\n  },\n  defaultVariants: {\n    pattern: 'linear',\n    status: 'default',\n  },\n});\n\nexport interface ProgressProps\n  extends ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,\n    VariantProps<typeof progressVariants> {\n  /**\n   * Visual variant of the progress indicator\n   */\n  variant?: 'bar' | 'thin' | 'thick' | 'circle' | 'steps';\n\n  /**\n   * Progress pattern affecting visual behavior\n   */\n  pattern?: 'linear' | 'accelerating' | 'decelerating' | 'pulsing';\n\n  /**\n   * Information complexity level\n   */\n  complexity?: 'simple' | 'detailed';\n\n  /**\n   * Progress status affecting color\n   */\n  status?: 'default' | 'success' | 'warning' | 'error';\n\n  /**\n   * Whether to show percentage\n   */\n  showPercentage?: boolean;\n\n  /**\n   * Whether to show time estimation\n   */\n  showTime?: boolean;\n\n  /**\n   * Whether to show descriptive text\n   */\n  showDescription?: boolean;\n\n  /**\n   * Whether to show step indicators\n   */\n  showSteps?: boolean;\n\n  /**\n   * Estimated total time in milliseconds\n   */\n  estimatedTime?: number;\n\n  /**\n   * Calculated or provided time remaining in milliseconds\n   */\n  timeRemaining?: number;\n\n  /**\n   * Message shown on completion\n   */\n  completionMessage?: string;\n\n  /**\n   * Next action available on completion\n   */\n  nextAction?: string;\n\n  /**\n   * Whether progress can be paused\n   */\n  pausable?: boolean;\n\n  /**\n   * Whether progress can be cancelled\n   */\n  cancellable?: boolean;\n\n  /**\n   * Current step (for step variant)\n   */\n  currentStep?: number;\n\n  /**\n   * Total steps (for step variant)\n   */\n  totalSteps?: number;\n\n  /**\n   * Label describing the progress\n   */\n  label?: string;\n\n  /**\n   * Detailed description of current progress\n   */\n  description?: string;\n\n  /**\n   * Pause handler\n   */\n  onPause?: () => void;\n\n  /**\n   * Cancel handler\n   */\n  onCancel?: () => void;\n\n  /**\n   * Complete handler\n   */\n  onComplete?: () => void;\n\n  ref?: React.Ref<ElementRef<typeof ProgressPrimitive.Root>>;\n}\n\nexport function Progress({\n  className,\n  value = 0,\n  variant = 'bar',\n  pattern = 'linear',\n  complexity = 'simple',\n  status = 'default',\n  showPercentage = false,\n  showTime = false,\n  showDescription = false,\n  showSteps = false,\n  estimatedTime,\n  timeRemaining,\n  completionMessage,\n  nextAction,\n  pausable = false,\n  cancellable = false,\n  currentStep,\n  totalSteps,\n  label,\n  description,\n  onPause,\n  onCancel,\n  onComplete,\n  ref,\n  ...props\n}: ProgressProps) {\n  const isComplete = value === 100;\n  const isIndeterminate = value === undefined || value === null;\n  const descriptionId = description\n    ? `progress-desc-${Math.random().toString(36).substr(2, 9)}`\n    : undefined;\n\n  // Helper functions for time calculation and formatting\n  const calculateRemainingMilliseconds = (): number | null => {\n    if (timeRemaining) return timeRemaining;\n    if (estimatedTime && value != null && value > 0) {\n      return (estimatedTime * (100 - value)) / 100;\n    }\n    return null;\n  };\n\n  const formatTimeRemaining = (milliseconds: number): string => {\n    const minutes = Math.floor(milliseconds / 60000);\n    const seconds = Math.floor((milliseconds % 60000) / 1000);\n\n    if (minutes > 0) {\n      return `About ${minutes}m ${seconds}s remaining`;\n    }\n    return seconds > 0 ? `About ${seconds}s remaining` : 'Almost done...';\n  };\n\n  const getTimeDisplay = (): string | null => {\n    if (!showTime) return null;\n    if (isComplete) return null;\n    if (isIndeterminate) return 'Calculating...';\n\n    const remainingMs = calculateRemainingMilliseconds();\n    return remainingMs ? formatTimeRemaining(remainingMs) : null;\n  };\n\n  const timeDisplay = getTimeDisplay();\n  const percentageDisplay = showPercentage && !isIndeterminate ? `${Math.round(value)}%` : null;\n\n  if (variant === 'steps' && showSteps) {\n    return (\n      <div className={cn('space-y-2', className)}>\n        {(label || percentageDisplay || timeDisplay) && (\n          <div className=\"flex items-center justify-between text-sm\">\n            <span className=\"font-medium text-foreground\">{label}</span>\n            <div className=\"flex items-center gap-2 text-muted-foreground\">\n              {currentStep && totalSteps && (\n                <span>\n                  {currentStep} of {totalSteps}\n                </span>\n              )}\n              {timeDisplay && <span>{timeDisplay}</span>}\n            </div>\n          </div>\n        )}\n\n        <div className=\"flex items-center justify-between\">\n          <div className=\"flex-1 space-y-1\">\n            {totalSteps && currentStep && (\n              <ol\n                aria-label={`Progress steps: ${currentStep} of ${totalSteps}`}\n                className=\"flex items-center gap-2\"\n              >\n                {Array.from({ length: totalSteps }, (_, i) => {\n                  const stepNumber = i + 1;\n                  const isCompleted = stepNumber < currentStep;\n                  const isCurrent = stepNumber === currentStep;\n                  return (\n                    <li\n                      key={`step-${stepNumber}`}\n                      aria-label={`Step ${stepNumber} of ${totalSteps}: ${\n                        isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Not Started'\n                      }`}\n                      className={cn(\n                        `h-2 flex-1 rounded-full transition-colors ${contextTiming.progress} ${contextEasing.progress}`,\n                        isCompleted && 'bg-primary',\n                        isCurrent && 'bg-primary/50',\n                        !isCompleted && !isCurrent && 'bg-background-subtle'\n                      )}\n                    />\n                  );\n                })}\n              </ol>\n            )}\n            {showDescription && description && (\n              <p className=\"text-sm text-muted-foreground\">{description}</p>\n            )}\n          </div>\n        </div>\n\n        {(pausable || cancellable) && (\n          <div className=\"flex gap-2\">\n            {pausable && (\n              <Button\n                variant=\"ghost\"\n                size=\"sm\"\n                onClick={onPause}\n                className=\"h-auto p-1 text-xs text-muted-foreground hover:text-foreground\"\n              >\n                Pause\n              </Button>\n            )}\n            {cancellable && (\n              <Button\n                variant=\"ghost\"\n                size=\"sm\"\n                onClick={onCancel}\n                className=\"h-auto p-1 text-xs text-muted-foreground hover:text-foreground\"\n              >\n                Cancel\n              </Button>\n            )}\n          </div>\n        )}\n      </div>\n    );\n  }\n\n  return (\n    <div className={cn('space-y-2', className)}>\n      {/* Header with label and time/percentage */}\n      {(label || percentageDisplay || timeDisplay) && (\n        <div className=\"flex items-center justify-between text-sm\">\n          <span className=\"font-medium text-foreground\">{label}</span>\n          <div className=\"flex items-center gap-2 text-muted-foreground\">\n            {percentageDisplay && <span>{percentageDisplay}</span>}\n            {timeDisplay && <span>{timeDisplay}</span>}\n          </div>\n        </div>\n      )}\n\n      {/* Progress bar */}\n      <ProgressPrimitive.Root\n        ref={ref}\n        className={cn(\n          progressVariants({ variant, pattern, complexity }),\n          isComplete && status === 'success' && 'bg-success/10'\n        )}\n        value={isIndeterminate ? undefined : value}\n        aria-label={label || 'Progress indicator'}\n        aria-describedby={descriptionId}\n        {...props}\n      >\n        <ProgressPrimitive.Indicator\n          className={cn(\n            progressIndicatorVariants({\n              pattern,\n              status: isComplete ? 'success' : status,\n            })\n          )}\n          style={{\n            transform: isIndeterminate ? undefined : `translateX(-${100 - value}%)`,\n          }}\n        />\n      </ProgressPrimitive.Root>\n\n      {/* Description */}\n      {showDescription && description && (\n        <p id={descriptionId} className=\"text-sm text-muted-foreground\">\n          {description}\n        </p>\n      )}\n\n      {/* Completion message */}\n      {isComplete && completionMessage && (\n        <div className=\"flex items-center justify-between text-sm\">\n          <span className=\"text-success\">{completionMessage}</span>\n          {nextAction && (\n            <Button\n              variant=\"ghost\"\n              size=\"sm\"\n              onClick={onComplete}\n              className=\"h-auto p-1 text-primary hover:text-primary/80 underline underline-offset-4\"\n            >\n              {nextAction}\n            </Button>\n          )}\n        </div>\n      )}\n\n      {/* Controls */}\n      {!isComplete && (pausable || cancellable) && (\n        <div className=\"flex gap-2\">\n          {pausable && (\n            <Button\n              variant=\"ghost\"\n              size=\"sm\"\n              onClick={onPause}\n              className=\"h-auto p-1 text-xs text-muted-foreground hover:text-foreground\"\n            >\n              Pause\n            </Button>\n          )}\n          {cancellable && (\n            <Button\n              variant=\"ghost\"\n              size=\"sm\"\n              onClick={onCancel}\n              className=\"h-auto p-1 text-xs text-muted-foreground hover:text-foreground\"\n            >\n              Cancel\n            </Button>\n          )}\n        </div>\n      )}\n    </div>\n  );\n}\n\n// Additional helper components for step progress\nexport interface ProgressStepProps {\n  children: React.ReactNode;\n  completed?: boolean;\n  current?: boolean;\n  className?: string;\n  ref?: React.Ref<HTMLDivElement>;\n}\n\nexport function ProgressStep({\n  children,\n  completed = false,\n  current = false,\n  className,\n  ref,\n  ...props\n}: ProgressStepProps) {\n  return (\n    <div\n      ref={ref}\n      className={cn(\n        'flex items-center gap-2 text-sm',\n        current && 'font-medium text-primary',\n        completed && 'text-muted-foreground',\n        !completed && !current && 'text-muted-foreground/50',\n        className\n      )}\n      {...props}\n    >\n      <div\n        className={cn(\n          'h-2 w-2 rounded-full',\n          current && 'bg-primary',\n          completed && 'bg-success',\n          !completed && !current && 'bg-muted-foreground/20'\n        )}\n      />\n      {children}\n    </div>\n  );\n}\n\nexport { progressVariants };\n",
      dependencies: [
        '@radix-ui/react-progress',
        '@rafters/design-tokens/motion',
        'class-variance-authority',
        '@rafters/design-tokens',
      ],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-progress--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 4,
            attentionEconomics:
              'Temporal attention: Holds user attention during wait states with clear progress indication',
            accessibility:
              'Screen reader announcements, keyboard navigation, high contrast support',
            trustBuilding:
              'Accurate progress builds user confidence, clear completion states and next steps',
            semanticMeaning:
              'Progress communication: determinate=known duration, indeterminate=unknown duration, completed=finished state ',
          },
          usagePatterns: {
            dos: [
              'Provide accurate progress indication with time estimation',
              'Use visual patterns that match task characteristics',
              'Show clear completion states and next steps',
              'Optimize information density based on cognitive load',
            ],
            nevers: [
              'Inaccurate progress bars, missing completion feedback, unclear time estimates',
            ],
          },
          designGuides: [
            {
              name: 'Trust Building',
              url: 'https://rafters.realhandy.tech/docs/llm/trust-building',
            },
            {
              name: 'Attention Economics',
              url: 'https://rafters.realhandy.tech/docs/llm/attention-economics',
            },
            {
              name: 'Progressive Enhancement',
              url: 'https://rafters.realhandy.tech/docs/llm/progressive-enhancement',
            },
          ],
          examples: [
            {
              code: '// Determinate progress with percentage\n<Progress value={65} max={100} />\n\n// Progress with time estimation\n<Progress\nvalue={30}\nmax={100}\nshowTimeRemaining\nestimatedTimeRemaining="2 minutes"\n/>',
            },
          ],
        },
      },
    },
    {
      name: 'select',
      path: 'components/ui/Select.tsx',
      type: 'registry:component ',
      description: '',
      content: `/**
 * Dropdown selection component with search and accessibility features
 *
 * @registry-name select
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Select.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 5/10 - Option selection with search functionality requires cognitive processing
 * @attention-economics State management: closed=compact display, open=full options, searching=filtered results
 * @trust-building Search functionality, clear selection indication, undo patterns for accidental selections
 * @accessibility Keyboard navigation, screen reader announcements, focus management, option grouping
 * @semantic-meaning Option structure: value=data, label=display, group=categorization, disabled=unavailable choices
 *
 * @usage-patterns
 * DO: Use 3-12 choices for optimal cognitive load
 * DO: Provide clear, descriptive option text
 * DO: Pre-select most common/safe option when appropriate
 * DO: Enable search for 8+ options to reduce cognitive load
 * NEVER: Too many options without grouping, unclear option descriptions
 *
 * @design-guides
 * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies @radix-ui/react-select, @radix-ui/react-icons, @rafters/design-tokens/motion
 *
 * @example
 * \`\`\`tsx
 * // Basic select with options
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose option..." />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option1">Option 1</SelectItem>
 *     <SelectItem value="option2">Option 2</SelectItem>
 *   </SelectContent>
 * </Select>
 * \`\`\`
 */
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import { contextEasing, contextTiming } from '@rafters/design-tokens/motion';
import { useState } from 'react';
import { cn } from '../lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  /** Choice architecture: Show count of items for cognitive load awareness */
  showCount?: boolean;
  /** Total number of items for choice architecture */
  itemCount?: number;
  /** Motor accessibility: Enhanced touch targets */
  size?: 'default' | 'large';
  ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Trigger>>;
}

export function SelectTrigger({
  className,
  children,
  showCount,
  itemCount,
  size = 'default',
  ref,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm',
        'placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-disabled',
        'transition-all hover:opacity-hover',
        contextTiming.hover,
        contextEasing.hover,
        '[&>span]:line-clamp-1',
        // Motor accessibility: Enhanced touch targets
        size === 'default' && 'h-10 py-2 min-h-[40px] sm:min-h-[40px]',
        size === 'large' && 'h-12 py-3 min-h-[44px] text-base',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between w-full">
        {children}
        {showCount && itemCount && (
          <span
            className="text-xs text-muted-foreground ml-2"
            aria-label={\`\${itemCount} options available\`}
          >
            ({itemCount})
          </span>
        )}
      </div>
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export interface SelectScrollUpButtonProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> {
  ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollUpButton>>;
}

export function SelectScrollUpButton({ className, ref, ...props }: SelectScrollUpButtonProps) {
  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <ChevronUpIcon className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

export interface SelectScrollDownButtonProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> {
  ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollDownButton>>;
}

export function SelectScrollDownButton({ className, ref, ...props }: SelectScrollDownButtonProps) {
  return (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <ChevronDownIcon className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  /** Progressive disclosure: Enable search for large lists */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Content>>;
}

export function SelectContent({
  className,
  children,
  position = 'popper',
  searchable,
  searchPlaceholder = 'Search options...',
  ref,
  ...props
}: SelectContentProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
          'transition-all',
          contextTiming.modal,
          contextEasing.modalEnter,
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        {searchable && (
          <div className="flex items-center px-3 py-2 border-b">
            <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        )}
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export interface SelectLabelProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> {
  ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Label>>;
}

export function SelectLabel({ className, ref, ...props }: SelectLabelProps) {
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
      {...props}
    />
  );
}

export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  /** Choice architecture: Show additional context */
  description?: string;
  /** Interaction intelligence: Show keyboard shortcut */
  shortcut?: string;
  ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Item>>;
}

export function SelectItem({
  className,
  children,
  description,
  shortcut,
  ref,
  ...props
}: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-disabled',
        'transition-colors duration-200',
        // Enhanced touch targets for motor accessibility
        'min-h-[40px] sm:min-h-[36px]',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <div className="flex-1 flex flex-col">
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        {description && (
          <span
            className="text-xs text-muted-foreground mt-0.5"
            aria-label={\`Description: \${description}\`}
          >
            {description}
          </span>
        )}
      </div>

      {shortcut && (
        <span
          className="text-xs text-muted-foreground ml-2 font-mono"
          aria-label={\`Keyboard shortcut: \${shortcut}\`}
        >
          {shortcut}
        </span>
      )}
    </SelectPrimitive.Item>
  );
}

export interface SelectSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> {
  ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Separator>>;
}

export function SelectSeparator({ className, ref, ...props }: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-muted', className)}
      {...props}
    />
  );
}

export { Select, SelectGroup, SelectValue };
`,
      dependencies: [
        '@radix-ui/react-select',
        '@radix-ui/react-icons',
        '@rafters/design-tokens/motion',
        '@rafters/design-tokens',
      ],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-select--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 5,
            attentionEconomics:
              'State management: closed=compact display, open=full options, searching=filtered results',
            accessibility:
              'Keyboard navigation, screen reader announcements, focus management, option grouping',
            trustBuilding:
              'Search functionality, clear selection indication, undo patterns for accidental selections',
            semanticMeaning:
              'Option structure: value=data, label=display, group=categorization, disabled=unavailable choices ',
          },
          usagePatterns: {
            dos: [
              'Use 3-12 choices for optimal cognitive load',
              'Provide clear, descriptive option text',
              'Pre-select most common/safe option when appropriate',
              'Enable search for 8+ options to reduce cognitive load',
            ],
            nevers: ['Too many options without grouping, unclear option descriptions'],
          },
          designGuides: [
            {
              name: 'Cognitive Load',
              url: 'https://rafters.realhandy.tech/docs/llm/cognitive-load',
            },
            {
              name: 'Attention Economics',
              url: 'https://rafters.realhandy.tech/docs/llm/attention-economics',
            },
            {
              name: 'Progressive Enhancement',
              url: 'https://rafters.realhandy.tech/docs/llm/progressive-enhancement',
            },
          ],
          examples: [
            {
              code: '// Basic select with options\n<Select>\n<SelectTrigger>\n<SelectValue placeholder="Choose option..." />\n</SelectTrigger>\n<SelectContent>\n<SelectItem value="option1">Option 1</SelectItem>\n<SelectItem value="option2">Option 2</SelectItem>\n</SelectContent>\n</Select>',
            },
          ],
        },
      },
    },
    {
      name: 'sidebar',
      path: 'components/ui/Sidebar.tsx',
      type: 'registry:component ',
      description: '',
      content: `/**
 * Comprehensive navigation sidebar with embedded wayfinding intelligence and progressive disclosure patterns
 *
 * @registry-name sidebar
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Sidebar.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 6/10 - Navigation system with state management and wayfinding intelligence
 * @attention-economics Secondary support system: Never competes with primary content, uses muted variants and compact sizing for attention hierarchy
 * @trust-building Spatial consistency builds user confidence, zustand state persistence remembers preferences, Miller's Law enforcement prevents cognitive overload
 * @accessibility WCAG AAA compliance with skip links, keyboard navigation, screen reader optimization, and motion sensitivity support
 * @semantic-meaning Navigation intelligence: Progressive disclosure for complex hierarchies, semantic grouping by domain, wayfinding through active state indication with zustand state machine
 *
 * @usage-patterns
 * DO: Use for main navigation with collapsible state management
 * DO: Implement progressive disclosure for complex menu hierarchies
 * DO: Provide skip links and keyboard navigation patterns
 * DO: Integrate with zustand store for state persistence
 * NEVER: Complex menu logic within sidebar - use dedicated menu components
 * NEVER: Compete with primary content for attention
 *
 * @design-guides
 * - Navigation Intelligence: https://rafters.realhandy.tech/docs/llm/navigation-patterns
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 *
 * @dependencies @rafters/design-tokens, zustand, zod, lucide-react, class-variance-authority, clsx
 *
 * @example
 * \`\`\`tsx
 * // Basic sidebar with navigation items
 * <Sidebar collapsed={false} collapsible>
 *   <SidebarHeader>
 *     <SidebarTitle>Navigation</SidebarTitle>
 *   </SidebarHeader>
 *   <SidebarContent>
 *     <SidebarItem href="/dashboard">Dashboard</SidebarItem>
 *     <SidebarItem href="/settings">Settings</SidebarItem>
 *   </SidebarContent>
 * </Sidebar>
 * \`\`\`
 */
import { contextEasing, contextTiming, timing } from '@rafters/design-tokens/motion';
import React, { useCallback, useEffect } from 'react';
import { z } from 'zod';
import { useSidebarNavigation } from '../hooks/useSidebarNavigation';
import { cn } from '../lib/utils';
import {
  useSidebarActions,
  useSidebarCollapsed,
  useSidebarCurrentPath,
  useSidebarStore,
} from '../stores/sidebarStore';

// Zod validation schemas for external data (CLAUDE.md requirement)
const NavigationPathSchema = z
  .string()
  .min(1, 'Path cannot be empty')
  .startsWith('/', 'Path must start with /');
const HrefSchema = z.string().refine((val) => {
  try {
    new URL(val);
    return true;
  } catch {
    return val.startsWith('/');
  }
}, 'Must be a valid URL or path starting with /');

// Simplified sidebar hook using navigation coordination
export const useSidebar = () => {
  const { collapsed, currentPath, collapsible, navigate, toggleCollapsed, hasAttention } =
    useSidebarNavigation();

  return {
    collapsed,
    collapsible,
    currentPath,
    onNavigate: navigate,
    toggleCollapsed,
    hasAttention, // For menu coordination
  };
};

// Main sidebar props with navigation intelligence
export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  // Navigation state and behavior
  collapsed?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onCollapsedChange?: (collapsed: boolean) => void;

  // Design intelligence configuration
  variant?: 'default' | 'floating' | 'overlay';
  size?: 'compact' | 'comfortable' | 'spacious';
  position?: 'left' | 'right';

  // Accessibility and navigation support
  ariaLabel?: string;
  skipLinkTarget?: string;
  landmark?: boolean;

  // Progressive enhancement
  persistCollapsedState?: boolean;
  reduceMotion?: boolean;

  // Trust-building
  showBreadcrumb?: boolean;
  highlightCurrent?: boolean;

  children: React.ReactNode;
}

// Sidebar header component
export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showToggle?: boolean;
  children: React.ReactNode;
}

// Sidebar title component
export interface SidebarTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

// Sidebar content area
export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Sidebar group for organizing navigation items
export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  // Cognitive load management
  collapsible?: boolean;
  defaultExpanded?: boolean;
  maxItems?: number; // Miller's Law enforcement

  // Trust building
  showCount?: boolean;

  children: React.ReactNode;
}

// Sidebar group label
export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

// Sidebar group content
export interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Individual sidebar navigation item
export interface SidebarItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  // Navigation behavior
  href?: string;
  active?: boolean;
  disabled?: boolean;

  // Visual hierarchy and attention
  variant?: 'default' | 'primary' | 'secondary';
  level?: number; // For nested hierarchies

  // Content and accessibility
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;

  // Progressive enhancement
  asChild?: boolean;
  external?: boolean;

  // Trust building
  showTooltip?: boolean;
  loading?: boolean;
}

// Sidebar item icon container
export interface SidebarItemIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

// Sidebar item text container
export interface SidebarItemTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  truncate?: boolean;
  children: React.ReactNode;
}

// Sidebar footer component
export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Main Sidebar component with full navigation intelligence (using zustand)
export const Sidebar: React.FC<SidebarProps> = ({
  collapsed: controlledCollapsed,
  collapsible = true,
  defaultCollapsed = false,
  currentPath,
  onNavigate,
  onCollapsedChange,
  variant = 'default',
  size = 'comfortable',
  position = 'left',
  ariaLabel = 'Main navigation',
  skipLinkTarget,
  landmark = true,
  persistCollapsedState = true,
  reduceMotion = false,
  showBreadcrumb = false,
  highlightCurrent = true,
  className,
  children,
  ...props
}) => {
  // Use zustand store for state management
  const storeCollapsed = useSidebarCollapsed();
  const { initialize, updatePreferences, setCurrentPath, setCollapsible } = useSidebarActions();

  // Initialize store on mount
  useEffect(() => {
    initialize({
      collapsed: controlledCollapsed ?? defaultCollapsed,
      currentPath: currentPath,
      collapsible,
      userPreferences: {
        persistCollapsed: persistCollapsedState,
        position,
        size,
        variant,
        reduceMotion,
      },
    });
  }, [
    initialize,
    controlledCollapsed,
    defaultCollapsed,
    currentPath,
    collapsible,
    persistCollapsedState,
    position,
    size,
    variant,
    reduceMotion,
  ]);

  // Sync external props with store
  useEffect(() => {
    if (currentPath !== undefined) {
      // Validate external data (CLAUDE.md Zod requirement)
      try {
        const validatedPath = NavigationPathSchema.parse(currentPath);
        setCurrentPath(validatedPath);
      } catch (error) {
        console.warn('Invalid currentPath provided:', error);
        setCurrentPath(currentPath); // Fallback for critical functionality
      }
    }
  }, [currentPath, setCurrentPath]);

  useEffect(() => {
    setCollapsible(collapsible);
  }, [collapsible, setCollapsible]);

  useEffect(() => {
    updatePreferences({
      position,
      size,
      variant,
      reduceMotion,
      persistCollapsed: persistCollapsedState,
    });
  }, [position, size, variant, reduceMotion, persistCollapsedState, updatePreferences]);

  // Handle controlled vs uncontrolled collapsed state
  const isCollapsed = controlledCollapsed ?? storeCollapsed;

  return (
    <nav
      className={cn(
        // Base navigation styles with spatial consistency
        'flex flex-col bg-background border-r border-border',
        'relative transition-all',
        !reduceMotion && contextTiming.navigation,
        !reduceMotion && contextEasing.navigation,

        // Variant-based styling for different use cases
        {
          'shadow-none': variant === 'default',
          'shadow-lg rounded-lg border': variant === 'floating',
          'fixed inset-y-0 z-50 shadow-xl': variant === 'overlay',
        },

        // Position-based layout
        {
          'left-0': position === 'left' && variant === 'overlay',
          'right-0': position === 'right' && variant === 'overlay',
        },

        // Size variants for cognitive load management
        {
          'w-60': size === 'compact' && !isCollapsed,
          'w-72': size === 'comfortable' && !isCollapsed,
          'w-80': size === 'spacious' && !isCollapsed,
          'w-16': isCollapsed && collapsible,
        },

        // Trust building: Smooth collapse transitions
        isCollapsed && 'overflow-hidden',

        className
      )}
      role={landmark ? 'navigation' : undefined}
      aria-label={ariaLabel}
      aria-expanded={collapsible ? !isCollapsed : undefined}
      {...props}
    >
      {/* Skip link for accessibility */}
      {skipLinkTarget && (
        <a
          href={skipLinkTarget}
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 
                     bg-primary text-primary-foreground px-2 py-1 rounded text-sm z-50"
        >
          Skip navigation
        </a>
      )}

      {children}
    </nav>
  );
};

// Sidebar Header with toggle functionality (using zustand)
export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  showToggle = true,
  className,
  children,
  ...props
}) => {
  const { collapsed, collapsible, toggleCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        // Header styling with proper spacing hierarchy
        'flex items-center justify-between p-4 border-b border-border/50',
        // Cognitive load: Adequate breathing room
        'min-h-[60px]',
        className
      )}
      {...props}
    >
      {/* Header content - collapses gracefully */}
      <div className={cn('flex-1 min-w-0', collapsed && 'hidden')}>{children}</div>

      {/* Toggle button with trust-building visual feedback */}
      {showToggle && collapsible && (
        <button
          type="button"
          onClick={toggleCollapsed}
          className={cn(
            // Interactive button with motor accessibility
            'flex items-center justify-center w-8 h-8 rounded-md',
            'border border-border hover:bg-accent transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            contextTiming.hover,
            // Trust pattern: Always visible, consistent position
            collapsed && 'mx-auto'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {/* Chevron icon with rotation animation */}
          <svg
            className={cn(
              'w-4 h-4 transition-transform',
              timing.standard,
              collapsed && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

// Sidebar Title with semantic heading levels (using zustand)
export const SidebarTitle: React.FC<SidebarTitleProps> = ({
  level = 2,
  className,
  children,
  ...props
}) => {
  const { collapsed } = useSidebar();
  const Heading = \`h\${level}\` as const;

  return (
    <Heading
      className={cn(
        // Typography hierarchy with trust-building clarity
        'text-lg font-semibold text-foreground',
        'truncate',
        // Graceful collapse behavior
        collapsed && 'sr-only',
        className
      )}
      {...props}
    >
      {children}
    </Heading>
  );
};

// Sidebar Content with scroll management (using zustand)
export const SidebarContent: React.FC<SidebarContentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        // Scrollable content area with trust-building consistency
        'flex-1 overflow-y-auto overflow-x-hidden',
        // Cognitive load: Comfortable padding and spacing
        'p-2 space-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Sidebar Group for organizing navigation items (Miller's Law) (using zustand)
export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  collapsible = false,
  defaultExpanded = true,
  maxItems = 7, // Miller's Law enforcement
  showCount = false,
  className,
  children,
  ...props
}) => {
  const [expanded] = React.useState(defaultExpanded);

  // Miller's Law validation for cognitive load management
  const childArray = React.Children.toArray(children);
  const itemCount = childArray.length;
  const hasOverflow = itemCount > maxItems;

  return (
    <div
      className={cn(
        // Group container with spacing for visual hierarchy
        'space-y-1',
        className
      )}
      {...props}
    >
      {/* Group content with progressive disclosure */}
      <div
        className={cn(
          'space-y-1',
          // Smooth expand/collapse for cognitive comfort
          'transition-all',
          timing.standard,
          collapsible && !expanded && 'hidden'
        )}
      >
        {children}
      </div>

      {/* Cognitive load warning for AI agents */}
      {hasOverflow && process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-warning p-1 rounded bg-warning/10">
          Warning: {itemCount} items exceed Miller's Law limit of {maxItems}
        </div>
      )}
    </div>
  );
};

// Sidebar Group Label with semantic structure (using zustand)
export const SidebarGroupLabel: React.FC<SidebarGroupLabelProps> = ({
  className,
  children,
  ...props
}) => {
  const { collapsed } = useSidebar();

  return (
    <h3
      className={cn(
        // Label typography with information hierarchy
        'px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider',
        // Graceful collapse behavior
        collapsed && 'sr-only',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

// Sidebar Group Content wrapper (using zustand)
export const SidebarGroupContent: React.FC<SidebarGroupContentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        // Content spacing for cognitive hierarchy
        'space-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Individual Sidebar Item - simplified and composable
export const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  active = false,
  disabled = false,
  variant = 'default',
  level = 0,
  icon,
  badge,
  asChild = false,
  external = false,
  showTooltip = false,
  loading = false,
  className,
  children,
  onClick,
  ...props
}) => {
  const { collapsed, currentPath, onNavigate } = useSidebar();

  // Simplified state logic
  const isCurrentPath = currentPath === href;
  const isActive = active || isCurrentPath;

  // Simplified click handler
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || loading) {
        event.preventDefault();
        return;
      }

      // Simple navigation with fallback
      if (href && onNavigate) {
        event.preventDefault();
        onNavigate(href);
      }

      onClick?.(event as React.MouseEvent<HTMLElement>);
    },
    [disabled, loading, href, onNavigate, onClick]
  );

  const handleAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled || loading) {
        event.preventDefault();
        return;
      }

      // Simple navigation with fallback
      if (href && onNavigate && !external) {
        event.preventDefault();
        onNavigate(href);
      }

      onClick?.(event as React.MouseEvent<HTMLElement>);
    },
    [disabled, loading, href, onNavigate, onClick, external]
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={cn(
          // Simplified item styles
          'flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium',
          'transition-all cursor-pointer select-none',
          contextTiming.hover,

          // Navigation hierarchy
          level > 0 && \`ml-\${Math.min(level * 4, 12)}\`,

          // Active state
          isActive && [
            'bg-primary/10 text-primary border-r-2 border-primary',
            'font-semibold shadow-sm',
          ],

          // Interactive states
          !disabled &&
            !loading && [
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            ],

          // State variants
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          loading && 'opacity-75 cursor-wait',

          // Variant styling
          {
            'text-foreground': variant === 'default',
            'text-primary font-semibold': variant === 'primary',
            'text-muted-foreground': variant === 'secondary',
          },

          // Collapsed state
          collapsed && 'justify-center px-2',

          className
        )}
        onClick={handleAnchorClick}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled}
        aria-busy={loading}
        title={collapsed && showTooltip ? String(children) : undefined}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {/* Icon with consistent sizing */}
        {icon && (
          <SidebarItemIcon>
            {loading ? (
              // Loading spinner with trust-building feedback
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              icon
            )}
          </SidebarItemIcon>
        )}

        {/* Text content with graceful collapse */}
        {!collapsed && <SidebarItemText truncate={true}>{children}</SidebarItemText>}

        {/* Badge with attention hierarchy */}
        {badge && !collapsed && <div className="ml-auto flex-shrink-0">{badge}</div>}

        {/* External link indicator */}
        {external && !collapsed && (
          <svg
            className="w-3 h-3 ml-1 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </a>
    );
  }

  return (
    <div
      className={cn(
        // Base item styles with motor accessibility
        'flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium',
        'transition-all cursor-pointer select-none',
        contextTiming.hover,

        // Navigation hierarchy with proper indentation
        level > 0 && \`ml-\${Math.min(level * 4, 12)}\`,

        // Active state with trust-building visual feedback
        isActive && [
          'bg-primary/10 text-primary border-r-2 border-primary',
          'font-semibold shadow-sm',
        ],

        // Interactive states
        !disabled &&
          !loading && [
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          ],

        // Disabled state with clear visual feedback
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',

        // Loading state with trust-building indicator
        loading && 'opacity-75 cursor-wait',

        // Variant styling for attention hierarchy
        {
          'text-foreground': variant === 'default',
          'text-primary font-semibold': variant === 'primary',
          'text-muted-foreground': variant === 'secondary',
        },

        // Collapsed state adjustments
        collapsed && 'justify-center px-2',

        className
      )}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled}
      aria-busy={loading}
      title={collapsed && showTooltip ? String(children) : undefined}
      {...props}
    >
      {/* Icon with consistent sizing */}
      {icon && (
        <SidebarItemIcon>
          {loading ? (
            // Loading spinner with trust-building feedback
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            icon
          )}
        </SidebarItemIcon>
      )}

      {/* Text content with graceful collapse */}
      {!collapsed && <SidebarItemText truncate={true}>{children}</SidebarItemText>}

      {/* Badge with attention hierarchy */}
      {badge && !collapsed && <div className="ml-auto flex-shrink-0">{badge}</div>}
    </div>
  );
};

// Sidebar Item Icon with consistent sizing (using zustand)
export const SidebarItemIcon: React.FC<SidebarItemIconProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        // Icon container with trust-building consistency
        'flex items-center justify-center w-4 h-4 flex-shrink-0',
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {children}
    </span>
  );
};

// Sidebar Item Text with truncation support (using zustand)
export const SidebarItemText: React.FC<SidebarItemTextProps> = ({
  truncate = false,
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        // Text styling with cognitive load optimization
        'flex-1 min-w-0',
        truncate && 'truncate',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Sidebar Footer with consistent styling (using zustand)
export const SidebarFooter: React.FC<SidebarFooterProps> = ({ className, children, ...props }) => {
  const { collapsed } = useSidebar();

  return (
    <div
      className={cn(
        // Footer styling with spatial consistency
        'border-t border-border/50 p-4 mt-auto',
        // Graceful collapse behavior
        collapsed && 'px-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Display names for React DevTools
Sidebar.displayName = 'Sidebar';
SidebarHeader.displayName = 'SidebarHeader';
SidebarTitle.displayName = 'SidebarTitle';
SidebarContent.displayName = 'SidebarContent';
SidebarGroup.displayName = 'SidebarGroup';
SidebarGroupLabel.displayName = 'SidebarGroupLabel';
SidebarGroupContent.displayName = 'SidebarGroupContent';
SidebarItem.displayName = 'SidebarItem';
SidebarItemIcon.displayName = 'SidebarItemIcon';
SidebarItemText.displayName = 'SidebarItemText';
SidebarFooter.displayName = 'SidebarFooter';
`,
      dependencies: [
        '@rafters/design-tokens',
        'zustand',
        'zod',
        'lucide-react',
        'class-variance-authority',
        'clsx',
      ],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-sidebar--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 6,
            attentionEconomics:
              'Secondary support system: Never competes with primary content, uses muted variants and compact sizing for attention hierarchy',
            accessibility:
              'WCAG AAA compliance with skip links, keyboard navigation, screen reader optimization, and motion sensitivity support',
            trustBuilding:
              "Spatial consistency builds user confidence, zustand state persistence remembers preferences, Miller's Law enforcement prevents cognitive overload",
            semanticMeaning:
              'Navigation intelligence: Progressive disclosure for complex hierarchies, semantic grouping by domain, wayfinding through active state indication with zustand state machine ',
          },
          usagePatterns: {
            dos: [
              'Use for main navigation with collapsible state management',
              'Implement progressive disclosure for complex menu hierarchies',
              'Provide skip links and keyboard navigation patterns',
              'Integrate with zustand store for state persistence',
            ],
            nevers: [
              'Complex menu logic within sidebar - use dedicated menu components',
              'Compete with primary content for attention',
            ],
          },
          designGuides: [
            {
              name: 'Navigation Intelligence',
              url: 'https://rafters.realhandy.tech/docs/llm/navigation-patterns',
            },
            {
              name: 'Progressive Enhancement',
              url: 'https://rafters.realhandy.tech/docs/llm/progressive-enhancement',
            },
            {
              name: 'Attention Economics',
              url: 'https://rafters.realhandy.tech/docs/llm/attention-economics',
            },
          ],
          examples: [
            {
              code: '// Basic sidebar with navigation items\n<Sidebar collapsed={false} collapsible>\n<SidebarHeader>\n<SidebarTitle>Navigation</SidebarTitle>\n</SidebarHeader>\n<SidebarContent>\n<SidebarItem href="/dashboard">Dashboard</SidebarItem>\n<SidebarItem href="/settings">Settings</SidebarItem>\n</SidebarContent>\n</Sidebar>',
            },
          ],
        },
      },
    },
    {
      name: 'slider',
      path: 'components/ui/Slider.tsx',
      type: 'registry:component ',
      description: '',
      content: `/**
 * Range slider component with precise value selection and accessibility features
 *
 * @registry-name slider
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Slider.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 3/10 - Value selection with immediate visual feedback
 * @attention-economics Value communication: visual track, precise labels, immediate feedback
 * @trust-building Immediate visual feedback, undo capability, clear value indication
 * @accessibility Keyboard increment/decrement, screen reader value announcements, touch-friendly handles
 * @semantic-meaning Range contexts: settings=configuration, filters=data selection, controls=media/volume
 *
 * @usage-patterns
 * DO: Show current value and units for clarity
 * DO: Use large thumb size for mobile and accessibility
 * DO: Provide visual markers for discrete value ranges
 * DO: Give immediate feedback with real-time updates
 * NEVER: Invisible ranges, unclear min/max values, tiny touch targets
 *
 * @design-guides
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load
 *
 * @dependencies @radix-ui/react-slider, @rafters/design-tokens/motion
 *
 * @example
 * \`\`\`tsx
 * // Basic slider with value display
 * <Slider
 *   defaultValue={[50]}
 *   max={100}
 *   step={1}
 *   className="w-full"
 * />
 * 
 * // Range slider with multiple handles
 * <Slider
 *   defaultValue={[25, 75]}
 *   max={100}
 *   step={5}
 *   className="w-full"
 * />
 * \`\`\`
 */
import * as SliderPrimitive from '@radix-ui/react-slider';
import { contextEasing, contextTiming } from '@rafters/design-tokens/motion';
import { cn } from '../lib/utils';

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Motor accessibility: Enhanced thumb size for easier manipulation */
  thumbSize?: 'default' | 'large';
  /** Motor accessibility: Show value labels for precision */
  showValue?: boolean;
  /** Motor accessibility: Custom step indicators */
  showSteps?: boolean;
  /** Cognitive load: Display unit for context */
  unit?: string;
  /** Motor accessibility: Enhanced track height */
  trackSize?: 'default' | 'large';
  ref?: React.Ref<React.ElementRef<typeof SliderPrimitive.Root>>;
}

export function Slider({
  className,
  thumbSize = 'default',
  showValue = false,
  showSteps = false,
  unit = '',
  trackSize = 'default',
  value,
  step,
  min = 0,
  max = 100,
  ref,
  ...props
}: SliderProps) {
  const currentValue = Array.isArray(value) ? value[0] : value;
  const displayValue = currentValue !== undefined ? \`\${currentValue}\${unit}\` : '';

  return (
    <div className="relative w-full">
      {showValue && currentValue !== undefined && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Value</span>
          <span className="text-sm text-muted-foreground font-mono">{displayValue}</span>
        </div>
      )}

      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-disabled',
          // Motor accessibility: Enhanced interaction area
          trackSize === 'default' && 'py-2',
          trackSize === 'large' && 'py-4',
          className
        )}
        value={value}
        step={step}
        min={min}
        max={max}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            'relative w-full grow overflow-hidden rounded-full bg-secondary',
            // Motor accessibility: Enhanced track size for easier targeting
            trackSize === 'default' && 'h-2',
            trackSize === 'large' && 'h-3'
          )}
        >
          <SliderPrimitive.Range
            className={cn(
              'absolute h-full bg-primary transition-all',
              contextTiming.hover,
              contextEasing.hover
            )}
          />
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb
          className={cn(
            'block rounded-full border-2 border-primary bg-background ring-offset-background',
            'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            contextTiming.hover,
            contextEasing.hover,
            'hover:scale-110 active:scale-95 disabled:pointer-events-none disabled:opacity-disabled',
            // Motor accessibility: Enhanced thumb sizes for easier manipulation
            thumbSize === 'default' && 'h-5 w-5',
            thumbSize === 'large' && 'h-6 w-6',
            // Enhanced touch targets for mobile
            'min-h-[44px] min-w-[44px] sm:min-h-[20px] sm:min-w-[20px]'
          )}
          aria-label={\`Slider value \${displayValue}\`}
        />
      </SliderPrimitive.Root>

      {showSteps && step && (
        <div className="flex justify-between mt-2 px-1">
          {Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => {
            const stepValue = min + i * step;
            return (
              <div key={stepValue} className="flex flex-col items-center">
                <div className="w-px h-2 bg-muted" />
                <span className="text-xs text-muted-foreground mt-1">
                  {stepValue}
                  {unit}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
`,
      dependencies: [
        '@radix-ui/react-slider',
        '@rafters/design-tokens/motion',
        '@rafters/design-tokens',
      ],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-slider--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 3,
            attentionEconomics:
              'Value communication: visual track, precise labels, immediate feedback',
            accessibility:
              'Keyboard increment/decrement, screen reader value announcements, touch-friendly handles',
            trustBuilding: 'Immediate visual feedback, undo capability, clear value indication',
            semanticMeaning:
              'Range contexts: settings=configuration, filters=data selection, controls=media/volume ',
          },
          usagePatterns: {
            dos: [
              'Show current value and units for clarity',
              'Use large thumb size for mobile and accessibility',
              'Provide visual markers for discrete value ranges',
              'Give immediate feedback with real-time updates',
            ],
            nevers: ['Invisible ranges, unclear min/max values, tiny touch targets'],
          },
          designGuides: [
            {
              name: 'Trust Building',
              url: 'https://rafters.realhandy.tech/docs/llm/trust-building',
            },
            {
              name: 'Progressive Enhancement',
              url: 'https://rafters.realhandy.tech/docs/llm/progressive-enhancement',
            },
            {
              name: 'Cognitive Load',
              url: 'https://rafters.realhandy.tech/docs/llm/cognitive-load',
            },
          ],
          examples: [
            {
              code: '// Basic slider with value display\n<Slider\ndefaultValue={[50]}\nmax={100}\nstep={1}\nclassName="w-full"\n/>\n\n// Range slider with multiple handles\n<Slider\ndefaultValue={[25, 75]}\nmax={100}\nstep={5}\nclassName="w-full"\n/>',
            },
          ],
        },
      },
    },
    {
      name: 'tabs',
      path: 'components/ui/Tabs.tsx',
      type: 'registry:component ',
      description: '',
      content: `/**
 * Tabbed interface component with keyboard navigation and ARIA compliance
 *
 * @registry-name tabs
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Tabs.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 4/10 - Content organization with state management requires cognitive processing
 * @attention-economics Content organization: visible=current context, hidden=available contexts, active=user focus
 * @trust-building Persistent selection, clear active indication, predictable navigation patterns
 * @accessibility Arrow key navigation, tab focus management, panel association, screen reader support
 * @semantic-meaning Structure: tablist=navigation, tab=option, tabpanel=content, selected=current view
 *
 * @usage-patterns
 * DO: Use for related content showing different views of same data/context
 * DO: Provide clear, descriptive, scannable tab names (7\xB12 maximum)
 * DO: Make active state visually prominent and immediately clear
 * DO: Arrange tabs by frequency or logical workflow sequence
 * NEVER: More than 7 tabs, unrelated content sections, unclear active state
 *
 * @design-guides
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies @radix-ui/react-tabs, @rafters/design-tokens/motion
 *
 * @example
 * \`\`\`tsx
 * // Basic tabs with content panels
 * <Tabs defaultValue="overview">
 *   <TabsList>
 *     <TabsTrigger value="overview">Overview</TabsTrigger>
 *     <TabsTrigger value="details">Details</TabsTrigger>
 *     <TabsTrigger value="settings">Settings</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="overview">
 *     Overview content
 *   </TabsContent>
 *   <TabsContent value="details">
 *     Details content
 *   </TabsContent>
 * </Tabs>
 * \`\`\`
 */
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { contextEasing, contextTiming } from '@rafters/design-tokens/motion';
import { cn } from '../lib/utils';

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  cognitiveLoad?: 'minimal' | 'standard' | 'complex';
  orientation?: 'horizontal' | 'vertical';
  wayfinding?: boolean;
  ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.Root>>;
}

function Tabs({
  cognitiveLoad = 'standard',
  orientation = 'horizontal',
  wayfinding = false,
  ref,
  ...props
}: TabsProps) {
  return (
    <TabsPrimitive.Root
      ref={ref}
      orientation={orientation}
      className={cn('w-full', wayfinding && 'tabs-wayfinding')}
      {...props}
    />
  );
}

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: 'default' | 'pills' | 'underline';
  density?: 'compact' | 'comfortable' | 'spacious';
  showIndicator?: boolean;
  ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.List>>;
}

function TabsList({
  className,
  variant = 'default',
  density = 'comfortable',
  showIndicator = true,
  ref,
  ...props
}: TabsListProps) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center text-muted-foreground',

        // Variant styling
        {
          'rounded-md bg-muted p-1': variant === 'default',
          'bg-transparent gap-2': variant === 'pills',
          'bg-transparent border-b border-border': variant === 'underline',
        },

        // Density spacing
        {
          'h-8 gap-1': density === 'compact',
          'h-10 gap-2': density === 'comfortable',
          'h-12 gap-3': density === 'spacious',
        },

        className
      )}
      {...props}
    />
  );
}

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  badge?: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
  ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.Trigger>>;
}

function TabsTrigger({
  className,
  badge,
  icon,
  children,
  disabled,
  ref,
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all',
        contextTiming.hover,
        contextEasing.hover,
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-disabled',

        // Base styling that varies by parent list variant
        'rounded-sm px-3 py-1.5', // default
        'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        'hover:opacity-hover active:scale-active',

        // Enhanced touch targets for cognitive load reduction
        'min-h-[44px] min-w-[44px]',

        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
      {badge && (
        <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {badge}
        </span>
      )}
    </TabsPrimitive.Trigger>
  );
}

interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  loading?: boolean;
  lazy?: boolean;
  ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.Content>>;
}

function TabsContent({
  className,
  loading = false,
  lazy = false,
  children,
  ref,
  ...props
}: TabsContentProps) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-2 ring-offset-background',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

        // Loading state
        loading && 'opacity-50',

        className
      )}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-sm text-muted-foreground">Loading content...</div>
        </div>
      ) : (
        children
      )}
    </TabsPrimitive.Content>
  );
}

// Navigation helper component for wayfinding
interface TabsBreadcrumbProps {
  activeTab: string;
  tabs: Array<{ value: string; label: string }>;
}

const TabsBreadcrumb = ({ activeTab, tabs }: TabsBreadcrumbProps) => {
  const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
  const activeTabLabel = tabs[activeIndex]?.label;

  return (
    <output className="text-xs text-muted-foreground mb-2" aria-live="polite">
      Tab {activeIndex + 1} of {tabs.length}: {activeTabLabel}
    </output>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsBreadcrumb };
export type { TabsProps };
`,
      dependencies: [
        '@radix-ui/react-tabs',
        '@rafters/design-tokens/motion',
        '@rafters/design-tokens',
      ],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-tabs--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 4,
            attentionEconomics:
              'Content organization: visible=current context, hidden=available contexts, active=user focus',
            accessibility:
              'Arrow key navigation, tab focus management, panel association, screen reader support',
            trustBuilding:
              'Persistent selection, clear active indication, predictable navigation patterns',
            semanticMeaning:
              'Structure: tablist=navigation, tab=option, tabpanel=content, selected=current view ',
          },
          usagePatterns: {
            dos: [
              'Use for related content showing different views of same data/context',
              'Provide clear, descriptive, scannable tab names (7\xB12 maximum)',
              'Make active state visually prominent and immediately clear',
              'Arrange tabs by frequency or logical workflow sequence',
            ],
            nevers: ['More than 7 tabs, unrelated content sections, unclear active state'],
          },
          designGuides: [
            {
              name: 'Attention Economics',
              url: 'https://rafters.realhandy.tech/docs/llm/attention-economics',
            },
            {
              name: 'Cognitive Load',
              url: 'https://rafters.realhandy.tech/docs/llm/cognitive-load',
            },
            {
              name: 'Progressive Enhancement',
              url: 'https://rafters.realhandy.tech/docs/llm/progressive-enhancement',
            },
          ],
          examples: [
            {
              code: '// Basic tabs with content panels\n<Tabs defaultValue="overview">\n<TabsList>\n<TabsTrigger value="overview">Overview</TabsTrigger>\n<TabsTrigger value="details">Details</TabsTrigger>\n<TabsTrigger value="settings">Settings</TabsTrigger>\n</TabsList>\n<TabsContent value="overview">\nOverview content\n</TabsContent>\n<TabsContent value="details">\nDetails content\n</TabsContent>\n</Tabs>',
            },
          ],
        },
      },
    },
    {
      name: 'toast',
      path: 'components/ui/Toast.tsx',
      type: 'registry:component ',
      description: '',
      content: `/**
 * Toast notification component for temporary user feedback
 *
 * @registry-name toast
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Toast.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 2/10 - Non-blocking notification requiring brief attention
 * @attention-economics Temporary interruption: Must be dismissible and time-appropriate for message urgency
 * @trust-building Immediate feedback for user actions builds confidence and confirms system responsiveness
 * @accessibility Screen reader announcements, keyboard dismissal, high contrast variants
 * @semantic-meaning Notification types: success=confirmation, error=failure with recovery, warning=caution, info=neutral updates
 *
 * @usage-patterns
 * DO: Confirm successful operations (save, delete, send)
 * DO: Provide error recovery with clear next steps for failures
 * DO: Auto-dismiss info toasts (4-6 seconds), require user dismiss for errors
 * DO: Use semantic variants with appropriate colors and icons
 * NEVER: Critical information that shouldn't disappear, multiple simultaneous toasts
 *
 * @design-guides
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies @radix-ui/react-toast, lucide-react
 *
 * @example
 * \`\`\`tsx
 * // Success toast with auto-dismiss
 * toast({
 *   title: "Changes saved",
 *   description: "Your settings have been updated successfully.",
 *   variant: "success",
 *   duration: 4000
 * })
 * 
 * // Error toast requiring user action
 * toast({
 *   title: "Upload failed",
 *   description: "Please check your connection and try again.",
 *   variant: "destructive",
 *   duration: null // Manual dismiss only
 * })
 * \`\`\`
 */
 */
import * as ToastPrimitives from '@radix-ui/react-toast';
import { contextEasing, contextTiming } from '@rafters/design-tokens/motion';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '../lib/utils';

const ToastProvider = ToastPrimitives.Provider;

export interface ToastViewportProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> {
  ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Viewport>>;
}

export function ToastViewport({ className, ref, ...props }: ToastViewportProps) {
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
        className
      )}
      {...props}
    />
  );
}

const toastVariants = cva(
  cn(
    'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg',
    'transition-all',
    contextTiming.toast,
    contextEasing.toast,
    'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full'
  ),
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
        success:
          'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-200',
        warning:
          'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        error:
          'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {
  urgency?: 'low' | 'medium' | 'high';
  interruption?: 'polite' | 'assertive' | 'demanding';
  persistent?: boolean;
  ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Root>>;
}

export function Toast({
  className,
  variant,
  urgency = 'medium',
  interruption = 'polite',
  persistent = false,
  ref,
  ...props
}: ToastProps) {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      duration={
        persistent
          ? Number.POSITIVE_INFINITY
          : urgency === 'high'
            ? 8000
            : urgency === 'medium'
              ? 5000
              : 3000
      }
      {...props}
    />
  );
}

export interface ToastActionProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> {
  ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Action>>;
}

export function ToastAction({ className, ref, ...props }: ToastActionProps) {
  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
        className
      )}
      {...props}
    />
  );
}

export interface ToastCloseProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close> {
  ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Close>>;
}

export function ToastClose({ className, ref, ...props }: ToastCloseProps) {
  return (
    <ToastPrimitives.Close
      ref={ref}
      className={cn(
        'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
        className
      )}
      toast-close=""
      {...props}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label="Close toast"
      >
        <title>Close toast</title>
        <path d="m3 3 18 18" />
        <path d="m21 3-18 18" />
      </svg>
    </ToastPrimitives.Close>
  );
}

export interface ToastTitleProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> {
  ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Title>>;
}

export function ToastTitle({ className, ref, ...props }: ToastTitleProps) {
  return (
    <ToastPrimitives.Title
      ref={ref}
      className={cn('text-sm font-semibold', className)}
      {...props}
    />
  );
}

export interface ToastDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description> {
  ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Description>>;
}

export function ToastDescription({ className, ref, ...props }: ToastDescriptionProps) {
  return (
    <ToastPrimitives.Description
      ref={ref}
      className={cn('text-sm opacity-90', className)}
      {...props}
    />
  );
}

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export { type ToastActionElement, ToastProvider };
`,
      dependencies: ['@radix-ui/react-toast', 'lucide-react', '@rafters/design-tokens'],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-toast--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 2,
            attentionEconomics:
              'Temporary interruption: Must be dismissible and time-appropriate for message urgency',
            accessibility:
              'Screen reader announcements, keyboard dismissal, high contrast variants',
            trustBuilding:
              'Immediate feedback for user actions builds confidence and confirms system responsiveness',
            semanticMeaning:
              'Notification types: success=confirmation, error=failure with recovery, warning=caution, info=neutral updates ',
          },
          usagePatterns: {
            dos: [
              'Confirm successful operations (save, delete, send)',
              'Provide error recovery with clear next steps for failures',
              'Auto-dismiss info toasts (4-6 seconds), require user dismiss for errors',
              'Use semantic variants with appropriate colors and icons',
            ],
            nevers: ["Critical information that shouldn't disappear, multiple simultaneous toasts"],
          },
          designGuides: [
            {
              name: 'Attention Economics',
              url: 'https://rafters.realhandy.tech/docs/llm/attention-economics',
            },
            {
              name: 'Trust Building',
              url: 'https://rafters.realhandy.tech/docs/llm/trust-building',
            },
            {
              name: 'Progressive Enhancement',
              url: 'https://rafters.realhandy.tech/docs/llm/progressive-enhancement',
            },
          ],
          examples: [
            {
              code: '// Success toast with auto-dismiss\ntoast({\ntitle: "Changes saved",\ndescription: "Your settings have been updated successfully.",\nvariant: "success",\nduration: 4000\n})\n\n// Error toast requiring user action\ntoast({\ntitle: "Upload failed",\ndescription: "Please check your connection and try again.",\nvariant: "destructive",\nduration: null // Manual dismiss only\n})',
            },
          ],
        },
      },
    },
    {
      name: 'tooltip',
      path: 'components/ui/Tooltip.tsx',
      type: 'registry:component ',
      description: '',
      content:
        "/**\n * Contextual tooltip component with smart timing and accessibility\n *\n * @registry-name tooltip\n * @registry-version 0.1.0\n * @registry-status published\n * @registry-path components/ui/Tooltip.tsx\n * @registry-type registry:component\n *\n * @cognitive-load 2/10 - Contextual help without interrupting user workflow\n * @attention-economics Non-intrusive assistance: Smart delays prevent accidental triggers while ensuring help availability\n * @trust-building Reliable contextual guidance that builds user confidence through progressive disclosure\n * @accessibility Keyboard navigation, screen reader support, focus management, escape key handling\n * @semantic-meaning Contextual assistance: help=functionality explanation, definition=terminology clarification, action=shortcuts and outcomes, status=system state\n *\n * @usage-patterns\n * DO: Explain functionality without overwhelming users\n * DO: Clarify terminology contextually when needed\n * DO: Show shortcuts and expected action outcomes\n * DO: Provide feedback on system state changes\n * NEVER: Include essential information that should be visible by default\n *\n * @design-guides\n * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load\n * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building\n * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics\n *\n * @dependencies @radix-ui/react-tooltip\n *\n * @example\n * ```tsx\n * // Basic tooltip with help text\n * <Tooltip>\n *   <TooltipTrigger asChild>\n *     <Button variant=\"ghost\">Help</Button>\n *   </TooltipTrigger>\n *   <TooltipContent>\n *     Click to open the help documentation\n *   </TooltipContent>\n * </Tooltip>\n * \n * // Tooltip with keyboard shortcut\n * <Tooltip>\n *   <TooltipTrigger asChild>\n *     <Button>Save</Button>\n *   </TooltipTrigger>\n *   <TooltipContent>\n *     Save changes (\u2318+S)\n *   </TooltipContent>\n * </Tooltip>\n * ```\n */\n * - Simple tooltips: 700ms delay (quick confirmation)\n * - Detailed tooltips: 1200ms delay (prevents accidental triggers)\n * - Essential tooltips: 500ms delay (critical information)\n * - Progressive disclosure for complex information\n *\n * Token knowledge: .rafters/tokens/registry.json\n */\nimport * as TooltipPrimitive from '@radix-ui/react-tooltip';\nimport { contextEasing, contextTiming } from '@rafters/design-tokens/motion';\nimport { forwardRef } from 'react';\nimport { cn } from '../lib/utils';\n\nexport interface TooltipProps {\n  // Contextual intelligence\n  context?: 'help' | 'definition' | 'action' | 'status' | 'shortcut';\n  complexity?: 'simple' | 'detailed';\n\n  // Timing intelligence - auto-calculated based on content if not provided\n  delayDuration?: number;\n\n  // Accessibility\n  essential?: boolean; // For screen readers\n\n  // Progressive disclosure\n  expandable?: boolean; // Click to expand detailed info\n}\n\nexport interface TooltipContentProps\n  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,\n    Pick<TooltipProps, 'context' | 'complexity' | 'essential' | 'expandable'> {}\n\n// Export type for contextual intelligence\nexport type TooltipContext = 'help' | 'definition' | 'action' | 'status' | 'shortcut';\n\n/**\n * TooltipProvider - Required wrapper for tooltip context\n * Provides intelligent defaults for timing and behavior\n */\nexport const TooltipProvider = TooltipPrimitive.Provider;\n\n/**\n * Tooltip - Main tooltip component with contextual intelligence\n * Includes smart timing based on content complexity and context\n */\nexport const Tooltip = forwardRef<\n  HTMLDivElement,\n  React.ComponentProps<typeof TooltipPrimitive.Root> & TooltipProps\n>(function Tooltip(\n  { delayDuration, context = 'help', complexity = 'simple', essential = false, ...props },\n  ref\n) {\n  // Timing Intelligence: Smart delays based on context and complexity\n  const getIntelligentDelay = () => {\n    if (delayDuration !== undefined) return delayDuration;\n\n    if (essential) return 500; // Essential info - faster access\n    if (complexity === 'detailed') return 1200; // Complex info - prevent accidental triggers\n    if (context === 'shortcut') return 300; // Shortcuts - quick access for power users\n    if (context === 'status') return 600; // Status - balance between info and interruption\n    return 700; // Default - balanced for most use cases\n  };\n\n  return <TooltipPrimitive.Root delayDuration={getIntelligentDelay()} {...props} />;\n});\n\n/**\n * TooltipTrigger - Element that triggers the tooltip\n */\nexport const TooltipTrigger = TooltipPrimitive.Trigger;\n\n/**\n * TooltipPortal - Portal for tooltip content\n */\nexport const TooltipPortal = TooltipPrimitive.Portal;\n\n/**\n * TooltipContent - The actual tooltip content with contextual styling\n */\nexport const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(\n  function TooltipContent(\n    {\n      className,\n      sideOffset = 4,\n      context = 'help',\n      complexity = 'simple',\n      essential = false,\n      expandable = false,\n      children,\n      ...props\n    },\n    ref\n  ) {\n    return (\n      <TooltipPrimitive.Content\n        ref={ref}\n        sideOffset={sideOffset}\n        className={cn(\n          // Base tooltip styling with semantic tokens\n          'z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm',\n          'bg-popover text-popover-foreground shadow-lg',\n          'border border-border/50',\n\n          // Trust building: Smooth animations reduce jarring appearance\n          'animate-in fade-in-0 zoom-in-95',\n          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',\n          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',\n          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',\n\n          // Motion intelligence: Consistent with other interactive elements\n          'transition-all',\n          contextTiming.modal, // Slightly slower for content comprehension\n          contextEasing.modalEnter, // Welcoming appearance reduces anxiety\n\n          // Contextual styling based on tooltip type\n          {\n            // Help tooltips - soft, non-intrusive\n            'bg-muted text-muted-foreground border-muted-foreground/20': context === 'help',\n\n            // Definition tooltips - slightly more prominent for learning\n            'bg-card text-card-foreground border-border': context === 'definition',\n\n            // Action tooltips - aligned with interactive elements\n            'bg-accent text-accent-foreground border-accent-foreground/20': context === 'action',\n\n            // Status tooltips - contextual coloring based on semantic meaning\n            'bg-secondary text-secondary-foreground border-secondary-foreground/30':\n              context === 'status',\n\n            // Shortcut tooltips - emphasized for power users\n            'bg-popover text-popover-foreground border-primary/20 font-mono text-xs':\n              context === 'shortcut',\n          },\n\n          // Complexity-based sizing\n          {\n            'max-w-xs': complexity === 'simple',\n            'max-w-sm': complexity === 'detailed',\n          },\n\n          // Essential tooltips get enhanced visibility\n          essential && ['ring-2 ring-primary/10', 'shadow-xl'],\n\n          // Expandable tooltips show interaction affordance\n          expandable && [\n            'cursor-pointer',\n            'hover:shadow-lg',\n            'transition-shadow',\n            contextTiming.hover,\n          ],\n\n          className\n        )}\n        {...props}\n      >\n        {children}\n      </TooltipPrimitive.Content>\n    );\n  }\n);\n\n/**\n * TooltipTitle - For structured tooltip content\n */\nexport const TooltipTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(\n  function TooltipTitle({ className, ...props }, ref) {\n    return (\n      <div\n        ref={ref}\n        className={cn(\n          'font-medium text-sm mb-1',\n          'text-foreground', // Higher contrast for titles\n          className\n        )}\n        {...props}\n      />\n    );\n  }\n);\n\n/**\n * TooltipDescription - For detailed explanations\n */\nexport const TooltipDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(\n  function TooltipDescription({ className, ...props }, ref) {\n    return (\n      <div\n        ref={ref}\n        className={cn(\n          'text-xs leading-relaxed',\n          'text-muted-foreground', // Lower contrast for descriptions\n          className\n        )}\n        {...props}\n      />\n    );\n  }\n);\n\n/**\n * TooltipShortcut - For keyboard shortcuts\n */\nexport const TooltipShortcut = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(\n  function TooltipShortcut({ className, ...props }, ref) {\n    return (\n      <span\n        ref={ref}\n        className={cn(\n          'ml-2 inline-flex items-center gap-1',\n          'text-xs font-mono font-medium',\n          'text-muted-foreground',\n          'bg-muted px-1.5 py-0.5 rounded border',\n          className\n        )}\n        {...props}\n      />\n    );\n  }\n);\n\n// Set display names for debugging\nTooltip.displayName = 'Tooltip';\nTooltipContent.displayName = 'TooltipContent';\nTooltipTitle.displayName = 'TooltipTitle';\nTooltipDescription.displayName = 'TooltipDescription';\nTooltipShortcut.displayName = 'TooltipShortcut';\n",
      dependencies: ['@radix-ui/react-tooltip', '@rafters/design-tokens'],
      docs: 'https://rafters.realhandy.tech/storybook/?path=/docs/03-components-tooltip--overview',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 2,
            attentionEconomics:
              'Non-intrusive assistance: Smart delays prevent accidental triggers while ensuring help availability',
            accessibility:
              'Keyboard navigation, screen reader support, focus management, escape key handling',
            trustBuilding:
              'Reliable contextual guidance that builds user confidence through progressive disclosure',
            semanticMeaning:
              'Contextual assistance: help=functionality explanation, definition=terminology clarification, action=shortcuts and outcomes, status=system state ',
          },
          usagePatterns: {
            dos: [
              'Explain functionality without overwhelming users',
              'Clarify terminology contextually when needed',
              'Show shortcuts and expected action outcomes',
              'Provide feedback on system state changes',
            ],
            nevers: ['Include essential information that should be visible by default'],
          },
          designGuides: [
            {
              name: 'Cognitive Load',
              url: 'https://rafters.realhandy.tech/docs/llm/cognitive-load',
            },
            {
              name: 'Trust Building',
              url: 'https://rafters.realhandy.tech/docs/llm/trust-building',
            },
            {
              name: 'Attention Economics',
              url: 'https://rafters.realhandy.tech/docs/llm/attention-economics',
            },
          ],
          examples: [
            {
              code: '// Basic tooltip with help text\n<Tooltip>\n<TooltipTrigger asChild>\n<Button variant="ghost">Help</Button>\n</TooltipTrigger>\n<TooltipContent>\nClick to open the help documentation\n</TooltipContent>\n</Tooltip>\n\n// Tooltip with keyboard shortcut\n<Tooltip>\n<TooltipTrigger asChild>\n<Button>Save</Button>\n</TooltipTrigger>\n<TooltipContent>\nSave changes (\u2318+S)\n</TooltipContent>\n</Tooltip>',
            },
          ],
        },
      },
    },
  ],
  total: 17,
  lastUpdated: '2025-08-14T19:29:11.848Z',
};

// src/services/componentService.ts
function loadGeneratedManifest() {
  return registry_manifest_default;
}
__name(loadGeneratedManifest, 'loadGeneratedManifest');
function convertToComponentManifest(component) {
  return {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: component.name,
    type: component.type,
    description: component.description,
    dependencies: component.dependencies,
    docs: component.docs,
    files: [
      {
        path: component.path,
        type: component.type,
        content: component.content,
      },
    ],
    meta: component.meta,
  };
}
__name(convertToComponentManifest, 'convertToComponentManifest');
async function getComponentRegistry() {
  const manifest = loadGeneratedManifest();
  const components2 = manifest.components.map(convertToComponentManifest);
  return { components: components2 };
}
__name(getComponentRegistry, 'getComponentRegistry');
async function getComponent(name) {
  const registry2 = await getComponentRegistry();
  return registry2.components.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null;
}
__name(getComponent, 'getComponent');

// src/routes/components.ts
const components = new Hono2();
components.get('/', async (c) => {
  try {
    const registryData = await getComponentRegistry();
    return c.json({
      components: registryData.components.map((component) => ({
        name: component.name,
        description: component.description,
        version: component.meta?.rafters?.version || '1.0.0',
        type: component.type,
        intelligence: {
          cognitiveLoad: component.meta?.rafters?.intelligence.cognitiveLoad || 0,
          attentionEconomics: component.meta?.rafters?.intelligence.attentionEconomics || '',
          accessibility: component.meta?.rafters?.intelligence.accessibility || '',
        },
        files: component.files.map((f) => f.path),
        dependencies: component.dependencies || [],
      })),
      total: registryData.components.length,
    });
  } catch (error3) {
    console.error('Error listing components:', error3);
    return c.json(
      {
        error: 'Failed to list components',
        message: 'Unable to load component list',
      },
      500
    );
  }
});
components.get('/:name', async (c) => {
  try {
    const componentName = c.req.param('name');
    const component = await getComponent(componentName);
    if (!component) {
      return c.json(
        {
          error: 'Component not found',
          message: `Component '${componentName}' does not exist in the registry`,
          availableComponents: (await getComponentRegistry()).components.map((c2) => c2.name),
        },
        404
      );
    }
    const transformedComponent = {
      ...component,
      version: component.meta?.rafters?.version || '1.0.0',
      intelligence: {
        cognitiveLoad: component.meta?.rafters?.intelligence.cognitiveLoad || 0,
        attentionEconomics: component.meta?.rafters?.intelligence.attentionEconomics || '',
        accessibility: component.meta?.rafters?.intelligence.accessibility || '',
        trustBuilding: component.meta?.rafters?.intelligence.trustBuilding || '',
        semanticMeaning: component.meta?.rafters?.intelligence.semanticMeaning || '',
      },
    };
    return c.json(transformedComponent);
  } catch (error3) {
    console.error('Error fetching component:', error3);
    return c.json(
      {
        error: 'Failed to fetch component',
        message: 'Unable to load component data',
      },
      500
    );
  }
});
components.get('/:name/source', async (c) => {
  try {
    const componentName = c.req.param('name');
    const component = await getComponent(componentName);
    if (!component) {
      return c.json(
        {
          error: 'Component not found',
          message: `Component '${componentName}' does not exist in the registry`,
        },
        404
      );
    }
    const sourceFile = component.files.find(
      (f) => f.path.endsWith('.tsx') && !f.path.includes('.stories.')
    );
    if (!sourceFile) {
      return c.json(
        {
          error: 'Source not found',
          message: 'Component source file not available',
        },
        404
      );
    }
    return c.text(sourceFile.content, 200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Component-Name': componentName,
      'X-Component-Version': component.meta?.rafters?.version || '1.0.0',
    });
  } catch (error3) {
    console.error('Error fetching component source:', error3);
    return c.json(
      {
        error: 'Failed to fetch source',
        message: 'Unable to load component source code',
      },
      500
    );
  }
});
components.get('/:name/stories', async (c) => {
  try {
    const componentName = c.req.param('name');
    const component = await getComponent(componentName);
    if (!component) {
      return c.json(
        {
          error: 'Component not found',
          message: `Component '${componentName}' does not exist in the registry`,
        },
        404
      );
    }
    const storyFiles = component.files.filter((f) => f.path.includes('.stories.'));
    return c.json({
      component: componentName,
      stories: storyFiles.map((story) => ({
        name: story.path,
        type: story.type,
        content: story.content,
      })),
      totalStories: storyFiles.length,
    });
  } catch (error3) {
    console.error('Error fetching component stories:', error3);
    return c.json(
      {
        error: 'Failed to fetch stories',
        message: 'Unable to load component training stories',
      },
      500
    );
  }
});

// src/routes/health.ts
const health = new Hono2();
health.get('/', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: /* @__PURE__ */ new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime?.() || 0,
  });
});

// src/routes/registry.ts
const registry = new Hono2();
registry.get('/', async (c) => {
  try {
    const registryData = await getComponentRegistry();
    return c.json({
      $schema: 'https://rafters.dev/schemas/registry.json',
      name: 'Rafters AI Design Intelligence Registry',
      version: '1.0.0',
      description: 'Components with embedded design reasoning for AI agents',
      baseUrl: 'https://rafters.realhandy.tech/registry',
      components: registryData.components.map((component) => ({
        name: component.name,
        description: component.description,
        version: component.meta?.rafters?.version || '1.0.0',
        type: component.type,
        cognitiveLoad: component.meta?.rafters?.intelligence.cognitiveLoad || 0,
        dependencies: component.dependencies || [],
        files: component.files.map((f) => f.path),
      })),
      totalComponents: registryData.components.length,
      lastUpdated: /* @__PURE__ */ new Date().toISOString(),
    });
  } catch (error3) {
    console.error('Error fetching registry:', error3);
    return c.json(
      {
        error: 'Failed to fetch registry',
        message: 'Unable to load component registry data',
      },
      500
    );
  }
});
registry.get('/stats', async (c) => {
  try {
    const registryData = await getComponentRegistry();
    const stats = {
      totalComponents: registryData.components.length,
      categories: {},
      averageCognitiveLoad: 0,
      dependencyCount: 0,
    };
    let totalCognitiveLoad = 0;
    const allDependencies = /* @__PURE__ */ new Set();
    for (const component of registryData.components) {
      const componentType = component.type || 'unknown';
      stats.categories[componentType] = (stats.categories[componentType] || 0) + 1;
      const cognitiveLoad = component.meta?.rafters?.intelligence.cognitiveLoad || 0;
      totalCognitiveLoad += cognitiveLoad;
      const dependencies = component.dependencies || [];
      for (const dep of dependencies) {
        allDependencies.add(dep);
      }
    }
    stats.averageCognitiveLoad = totalCognitiveLoad / registryData.components.length;
    stats.dependencyCount = allDependencies.size;
    return c.json(stats);
  } catch (error3) {
    console.error('Error fetching registry stats:', error3);
    return c.json(
      {
        error: 'Failed to fetch stats',
        message: 'Unable to calculate registry statistics',
      },
      500
    );
  }
});

// src/index.ts
const app = new Hono2();
app.use(
  '/*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);
app.route('/health', health);
app.route('/registry', registry);
app.route('/components', components);
app.get('/', (c) => {
  return c.json({
    name: 'Rafters Component Registry',
    version: '1.0.0',
    description: 'AI-first design intelligence system component registry',
    endpoints: {
      health: '/health',
      registry: '/registry',
      components: '/components',
      component: '/components/{name}',
    },
    documentation: 'https://docs.rafters.dev/registry',
  });
});
app.notFound((c) => {
  return c.json(
    {
      error: 'Not Found',
      message: 'The requested resource was not found',
      endpoints: ['/health', '/registry', '/components'],
    },
    404
  );
});
app.onError((err, c) => {
  console.error('Registry API Error:', err);
  return c.json(
    {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    },
    500
  );
});
const src_default = app;

// ../../node_modules/.pnpm/wrangler@4.26.1_@cloudflare+workers-types@4.20250726.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
const drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {}
      }
    } catch (e) {
      console.error('Failed to drain the unused request body.', e);
    }
  }
}, 'drainBody');
const middleware_ensure_req_body_drained_default = drainBody;

// ../../node_modules/.pnpm/wrangler@4.26.1_@cloudflare+workers-types@4.20250726.0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause),
  };
}
__name(reduceError, 'reduceError');
const jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { 'MF-Experimental-Error-Stack': 'true' },
    });
  }
}, 'jsonError');
const middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-LBLUeD/middleware-insertion-facade.js
const __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default,
];
const middleware_insertion_facade_default = src_default;

// ../../node_modules/.pnpm/wrangler@4.26.1_@cloudflare+workers-types@4.20250726.0/node_modules/wrangler/templates/middleware/common.ts
const __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, '__facade_register__');
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    },
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, '__facade_invokeChain__');
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware,
  ]);
}
__name(__facade_invoke__, '__facade_invoke__');

// .wrangler/tmp/bundle-LBLUeD/middleware-loader.entry.ts
const __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(___Facade_ScheduledController__, '__Facade_ScheduledController__');
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError('Illegal invocation');
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (
    __INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 ||
    __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0
  ) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
    if (worker.fetch === void 0) {
      throw new Error('Handler does not export a fetch() function.');
    }
    return worker.fetch(request, env2, ctx);
  }, 'fetchDispatcher');
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name((type, init) => {
        if (type === 'scheduled' && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? '',
            () => {}
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, 'dispatcher');
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    },
  };
}
__name(wrapExportedHandler, 'wrapExportedHandler');
function wrapWorkerEntrypoint(klass) {
  if (
    __INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 ||
    __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0
  ) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error('Entrypoint class does not define a fetch() function.');
      }
      return super.fetch(request);
    }, '#fetchDispatcher');
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === 'scheduled' && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? '',
          () => {}
        );
        return super.scheduled(controller);
      }
    }, '#dispatcher');
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, 'wrapWorkerEntrypoint');
let WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === 'object') {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === 'function') {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
const middleware_loader_entry_default = WRAPPED_ENTRY;
export { __INTERNAL_WRANGLER_MIDDLEWARE__, middleware_loader_entry_default as default };
//# sourceMappingURL=index.js.map
