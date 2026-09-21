'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var SESSION_STORAGE_KEY = 'ccr_session_token';
var LAUNCH_SAVE_DELAY = 700;
var CHECKLIST_SAVE_DELAY = 350;
var APP_VERSION = '2.0.0-github';
var APP_VERSION_STORAGE_KEY = 'ccr_app_version_seen';
var INSTALL_HINT_STORAGE_KEY = 'ccr_install_hint_shown';
var APP = {
    sessionToken: null,
    user: null,
    launches: [],
    launch: null,
    launchStatus: null,
    connectionType: '',
    connectionData: {},
    settings: {},
    files: [],
    contacts: [],
    currentPage: 'home',
    form: { launchDate: '', advertisingPhone: '' },
    checklist: new Set(),
    communication: {
        email: null,
        telegram: null,
        loading: false,
        error: ''
    }
};
var CHECK_ITEMS = [
    { key: 'stream_backup', render: renderCheckStream },
    { key: 'air_assets', render: renderCheckAssets },
    { key: 'ad_timing', render: renderCheckTiming },
    { key: 'ad_branding', render: renderCheckBranding },
    { key: 'launch_data', render: renderCheckLaunchData }
];
var sessionResetInProgress = false;
var launchSaveTimer = null;
var launchSaveRequestId = 0;
var checklistSaveTimer = null;
var communicationRequestId = 0;
/* ---------- START ---------- */
document.addEventListener('DOMContentLoaded', initApp);
function initApp() {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bindStaticEvents();
                    APP.sessionToken = localStorage.getItem(SESSION_STORAGE_KEY) || null;
                    if (!APP.sessionToken) {
                        showScreen('loginScreen');
                        return [2 /*return*/];
                    }
                    showScreen('loadingScreen');
                    setLoadingStatus('Загружаем данные станции…');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, rpc('checkSession', APP.sessionToken)];
                case 2:
                    result = _a.sent();
                    if (!result || result.success === false || !result.logged || !result.user) {
                        clearSession();
                        showScreen('loginScreen');
                        return [2 /*return*/];
                    }
                    APP.user = result.user;
                    return [4 /*yield*/, afterLogin()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error(error_1);
                    clearSession();
                    showScreen('loginScreen');
                    showLoginError('Не удалось восстановить сессию. Войдите снова.');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/* ---------- RPC: GitHub frontend -> hidden Apps Script bridge ---------- */
var RPC_BRIDGE = {
    frame: null,
    targetWindow: null,
    channel: '',
    ready: false,
    readyPromise: null,
    readyResolve: null,
    readyReject: null,
    requests: new Map(),
    listenerBound: false
};

function setLoadingStatus(message) {
    var el = document.getElementById('loadingStatus');
    if (el) {
        el.textContent = message || '';
    }
}

function getBridgeBaseUrl() {
    var config = window.CCR_CONFIG || {};
    var url = String(config.appsScriptExecUrl || '').trim();

    if (!url || /PASTE_|YOUR_|__/.test(url)) {
        throw new Error('Не настроен адрес сервера. Укажите appsScriptExecUrl в config.js.');
    }

    return url.replace(/[?#].*$/, '');
}

function makeBridgeChannel() {
    if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
        var values = new Uint32Array(4);
        window.crypto.getRandomValues(values);
        return Array.prototype.map.call(values, function (value) {
            return value.toString(16).padStart(8, '0');
        }).join('');
    }

    return String(Date.now()) + '-' + Math.random().toString(36).slice(2);
}

function bindBridgeMessages() {
    if (RPC_BRIDGE.listenerBound) {
        return;
    }

    RPC_BRIDGE.listenerBound = true;

    window.addEventListener('message', function (event) {
        var data = event.data;

        if (!data || data.channel !== RPC_BRIDGE.channel) {
            return;
        }

        if (data.type === 'ccr-bridge-ready') {
            // Apps Script HTML runs inside Google's own sandbox iframe.
            // event.source is therefore the inner Bridge window, not the
            // outer iframe element that we created on GitHub.
            RPC_BRIDGE.targetWindow = event.source;
            RPC_BRIDGE.ready = true;

            if (RPC_BRIDGE.readyResolve) {
                RPC_BRIDGE.readyResolve(true);
                RPC_BRIDGE.readyResolve = null;
                RPC_BRIDGE.readyReject = null;
            }
            return;
        }

        if (
            data.type !== 'ccr-rpc-response' ||
            !data.requestId ||
            !RPC_BRIDGE.targetWindow ||
            event.source !== RPC_BRIDGE.targetWindow
        ) {
            return;
        }

        var pending = RPC_BRIDGE.requests.get(data.requestId);
        if (!pending) {
            return;
        }

        clearTimeout(pending.timer);
        RPC_BRIDGE.requests.delete(data.requestId);

        if (data.ok) {
            pending.resolve(data.result);
        }
        else {
            pending.reject(new Error(data.error || 'Ошибка сервера'));
        }
    });
}

function ensureBridgeReady() {
    if (RPC_BRIDGE.ready) {
        return Promise.resolve(true);
    }

    if (RPC_BRIDGE.readyPromise) {
        return RPC_BRIDGE.readyPromise;
    }

    bindBridgeMessages();
    setLoadingStatus('Подключаем данные станции…');

    RPC_BRIDGE.channel = makeBridgeChannel();

    RPC_BRIDGE.readyPromise = new Promise(function (resolve, reject) {
        RPC_BRIDGE.readyResolve = resolve;
        RPC_BRIDGE.readyReject = reject;

        var frame = document.createElement('iframe');
        frame.id = 'rpcBridge';
        frame.title = 'Служебное подключение';
        frame.setAttribute('aria-hidden', 'true');
        frame.tabIndex = -1;

        var baseUrl;
        try {
            baseUrl = getBridgeBaseUrl();
        }
        catch (error) {
            reject(error);
            return;
        }

        frame.src =
            baseUrl +
            '?bridge=1&channel=' +
            encodeURIComponent(RPC_BRIDGE.channel);

        RPC_BRIDGE.frame = frame;
        document.body.appendChild(frame);

        setTimeout(function () {
            if (!RPC_BRIDGE.ready) {
                RPC_BRIDGE.readyPromise = null;
                RPC_BRIDGE.readyResolve = null;
                RPC_BRIDGE.readyReject = null;
                reject(new Error('Не удалось подключиться к серверу. Проверьте адрес сервера и попробуйте снова.'));
            }
        }, 20000);
    });

    return RPC_BRIDGE.readyPromise;
}

function rpc(functionName) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }

    return ensureBridgeReady().then(function () {
        return new Promise(function (resolve, reject) {
            var requestId =
                Date.now().toString(36) +
                '-' +
                Math.random().toString(36).slice(2);

            var timer = setTimeout(function () {
                RPC_BRIDGE.requests.delete(requestId);
                reject(new Error('Сервер не ответил вовремя. Попробуйте ещё раз.'));
            }, 30000);

            RPC_BRIDGE.requests.set(requestId, {
                resolve: resolve,
                reject: reject,
                timer: timer
            });

            if (!RPC_BRIDGE.targetWindow) {
                clearTimeout(timer);
                RPC_BRIDGE.requests.delete(requestId);
                reject(new Error('Служебное подключение к серверу не готово.'));
                return;
            }

            RPC_BRIDGE.targetWindow.postMessage({
                type: 'ccr-rpc-request',
                channel: RPC_BRIDGE.channel,
                requestId: requestId,
                method: functionName,
                args: args
            }, '*');
        });
    });
}

function authRpc(functionName) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var result, error_2, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!APP.sessionToken) return [3 /*break*/, 2];
                    return [4 /*yield*/, handleExpiredSession()];
                case 1:
                    _a.sent();
                    throw new Error('Сессия отсутствует');
                case 2:
                    _a.trys.push([2, 4, , 7]);
                    return [4 /*yield*/, rpc.apply(void 0, __spreadArray(__spreadArray([functionName], __read(args), false), [APP.sessionToken], false))];
                case 3:
                    result = _a.sent();
                    return [3 /*break*/, 7];
                case 4:
                    error_2 = _a.sent();
                    if (!isSessionError(error_2)) return [3 /*break*/, 6];
                    return [4 /*yield*/, handleExpiredSession()];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: throw error_2;
                case 7:
                    if (!(result && typeof result === 'object' && !Array.isArray(result) && result.success === false)) return [3 /*break*/, 10];
                    message = result.message || 'Ошибка сервера';
                    if (!isSessionError(message)) return [3 /*break*/, 9];
                    return [4 /*yield*/, handleExpiredSession()];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: throw new Error(message);
                case 10: return [2 /*return*/, result];
            }
        });
    });
}
function isSessionError(error) {
    var text = String(error && error.message ? error.message : error || '').toLowerCase();
    return text.includes('session_expired') || text.includes('сессия завершена') || text.includes('сессия истекла') || text.includes('сессия отсутствует');
}
function handleExpiredSession() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (sessionResetInProgress)
                return [2 /*return*/];
            sessionResetInProgress = true;
            clearSession();
            resetRuntimeState();
            showScreen('loginScreen');
            showLoginError('Сессия завершена. Войдите снова.');
            sessionResetInProgress = false;
            return [2 /*return*/];
        });
    });
}
/* ---------- STATIC EVENTS ---------- */
function bindStaticEvents() {
    document.getElementById('loginButton').addEventListener('click', loginUser);
    document.getElementById('passwordInput').addEventListener('keydown', function (event) {
        if (event.key === 'Enter')
            loginUser();
    });
    ['logoutFromLaunches', 'logoutButtonDesktop', 'logoutButtonMobile'].forEach(function (id) {
        document.getElementById(id).addEventListener('click', logoutUser);
    });
    ['backToLaunchesDesktop', 'backToLaunchesMobile'].forEach(function (id) {
        document.getElementById(id).addEventListener('click', renderLaunchSelect);
    });
    document.getElementById('desktopNav').addEventListener('click', function (event) {
        var button = event.target.closest('[data-page]');
        if (button)
            navigate(button.dataset.page);
    });
    document.getElementById('pageContent').addEventListener('click', handlePageClick);
    document.getElementById('pageContent').addEventListener('input', handlePageInput);
    document.getElementById('pageContent').addEventListener('change', handlePageChange);
    document.getElementById('pageContent').addEventListener('focusout', handlePageFocusOut);
}
/* ---------- AUTH ---------- */
function loginUser() {
    return __awaiter(this, void 0, void 0, function () {
        var input, button, password, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = document.getElementById('passwordInput');
                    button = document.getElementById('loginButton');
                    password = input.value.trim();
                    hideLoginError();
                    if (!password) {
                        showLoginError('Введите пароль');
                        return [2 /*return*/];
                    }
                    setButtonLoading(button, true, 'Входим…');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, rpc('login', password)];
                case 2:
                    result = _a.sent();
                    if (!result || result.success !== true || !result.session_token || !result.user) {
                        throw new Error(result && result.message ? result.message : 'Не удалось войти');
                    }
                    APP.sessionToken = result.session_token;
                    APP.user = result.user;
                    localStorage.setItem(SESSION_STORAGE_KEY, APP.sessionToken);
                    input.value = '';
                    return [4 /*yield*/, afterLogin()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_3 = _a.sent();
                    console.error(error_3);
                    showLoginError(error_3.message || 'Не удалось войти. Попробуйте ещё раз.');
                    return [3 /*break*/, 6];
                case 5:
                    setButtonLoading(button, false, 'Войти');
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function afterLogin() {
    return __awaiter(this, void 0, void 0, function () {
        var results, rememberedId_1, remembered, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    showScreen('loadingScreen');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, Promise.all([
                            authRpc('getLaunches', APP.user.user_id),
                            authRpc('getSettings'),
                            authRpc('getContacts')
                        ])];
                case 2:
                    results = _a.sent();
                    APP.launches = normalizeArray(results[0]);
                    APP.settings = normalizeObject(results[1]);
                    APP.contacts = normalizeArray(results[2]);
                    if (!APP.launches.length)
                        throw new Error('Для этого пользователя нет станций');
                    if (!(APP.launches.length === 1)) return [3 /*break*/, 4];
                    return [4 /*yield*/, selectLaunch(APP.launches[0])];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
                case 4:
                    rememberedId_1 = localStorage.getItem(userStorageKey('lastLaunch'));
                    remembered = APP.launches.find(function (item) {
                        return String(item.launch_id) === String(rememberedId_1 || '');
                    });
                    if (!remembered) return [3 /*break*/, 6];
                    return [4 /*yield*/, selectLaunch(remembered)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
                case 6:
                    renderLaunchSelect();
                    return [3 /*break*/, 8];
                case 7:
                    error_4 = _a.sent();
                    if (isSessionError(error_4))
                        return [2 /*return*/];
                    console.error(error_4);
                    showScreen('loginScreen');
                    showLoginError(error_4.message || 'Не удалось загрузить данные');
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function logoutUser() {
    return __awaiter(this, void 0, void 0, function () {
        var token, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = APP.sessionToken;
                    clearSession();
                    resetRuntimeState();
                    showScreen('loginScreen');
                    if (!token)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, rpc('logout', token)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.warn('Logout failed', error_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function clearSession() {
    APP.sessionToken = null;
    localStorage.removeItem(SESSION_STORAGE_KEY);
}
function resetRuntimeState() {
    clearTimeout(launchSaveTimer);
    clearTimeout(checklistSaveTimer);
    APP.user = null;
    APP.launches = [];
    APP.launch = null;
    APP.launchStatus = null;
    APP.connectionType = '';
    APP.connectionData = {};
    APP.settings = {};
    APP.files = [];
    APP.contacts = [];
    APP.currentPage = 'home';
    APP.form = { launchDate: '', advertisingPhone: '' };
    APP.checklist = new Set();
    APP.communication = { email: null, telegram: null, loading: false, error: '' };
}
/* ---------- LAUNCH SELECTION ---------- */
function renderLaunchSelect() {
    var list = document.getElementById('launchList');
    list.innerHTML = '';
    APP.launches.forEach(function (launch) {
        var row = document.createElement('button');
        row.type = 'button';
        row.className = 'launch-row';
        row.innerHTML = "\n      <span>\n        <span class=\"launch-row-title\">".concat(escapeHtml(launch.city || 'Станция'), "</span>\n        <span class=\"launch-row-meta\">").concat(escapeHtml(launch.frequency || ''), "</span>\n      </span>\n      <span class=\"launch-row-arrow\">\u2192</span>\n    ");
        row.addEventListener('click', function () { selectLaunch(launch); });
        list.appendChild(row);
    });
    showScreen('launchSelectScreen');
}
function selectLaunch(launch) {
    return __awaiter(this, void 0, void 0, function () {
        var status, results, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    showScreen('loadingScreen');
                    APP.launch = launch;
                    APP.connectionType = normalizeConnectionType(launch.connection_type);
                    localStorage.setItem(userStorageKey('lastLaunch'), String(launch.launch_id));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, authRpc('getLaunchStatus', launch.launch_id)];
                case 2:
                    status = _a.sent();
                    APP.launchStatus = normalizeObject(status);
                    if (APP.launchStatus.connection_type) {
                        APP.connectionType = normalizeConnectionType(APP.launchStatus.connection_type);
                    }
                    return [4 /*yield*/, Promise.all([
                            authRpc('getConnectionType', APP.connectionType),
                            authRpc('getFiles', launch.launch_id, APP.connectionType)
                        ])];
                case 3:
                    results = _a.sent();
                    APP.connectionData = normalizeObject(results[0]);
                    APP.files = normalizeArray(results[1]);
                    restoreLaunchForm();
                    restoreChecklist();
                    APP.currentPage = 'home';
                    updateWorkspaceShell();
                    showScreen('workspaceScreen');
                    navigate('home', false);
                    setTimeout(maybeShowPostLoginNotices, 450);
                    if (communicationReady())
                        prepareCommunicationLinks();
                    return [3 /*break*/, 5];
                case 4:
                    error_6 = _a.sent();
                    if (isSessionError(error_6))
                        return [2 /*return*/];
                    console.error(error_6);
                    if (APP.launches.length > 1) {
                        renderLaunchSelect();
                    }
                    else {
                        showScreen('loginScreen');
                        showLoginError(error_6.message || 'Не удалось открыть данные станции');
                    }
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function updateWorkspaceShell() {
    var city = APP.launch ? APP.launch.city || '' : '';
    var frequency = APP.launch ? APP.launch.frequency || '' : '';
    document.getElementById('sidebarCity').textContent = city;
    document.getElementById('sidebarFrequency').textContent = frequency;
    document.getElementById('mobileStationIdentity').textContent = [city, frequency].filter(Boolean).join(' · ');
    var mobileMenuStation = document.getElementById('mobileMenuStationIdentity');
    if (mobileMenuStation)
        mobileMenuStation.textContent = [city, frequency].filter(Boolean).join(' · ');
    var onAir = isOnAir();
    document.getElementById('sidebarOnAir').classList.toggle('hidden', !onAir);
    document.getElementById('mobileOnAir').classList.toggle('hidden', !onAir);
    var multi = APP.launches.length > 1;
    document.getElementById('backToLaunchesDesktop').classList.toggle('hidden', !multi);
    document.getElementById('backToLaunchesMobile').classList.toggle('hidden', !multi);
}
/* ---------- ROUTING ---------- */
function navigate(page, focusContent) {
    if (focusContent === void 0) { focusContent = true; }
    if (!APP.launch)
        return;
    var allowed = ['home', 'air', 'ads', 'launch', 'brand', 'checklist'];
    APP.currentPage = allowed.includes(page) ? page : 'home';
    document.querySelectorAll('.nav-item').forEach(function (item) {
        item.classList.toggle('is-active', item.dataset.page === APP.currentPage);
    });
    document.querySelectorAll('[data-mobile-page]').forEach(function (item) {
        item.classList.toggle('is-active', item.dataset.mobilePage === APP.currentPage);
    });
    updateMobileMenuButtonLabel();
    closeMobileMenu();
    var renderers = {
        home: renderHome,
        air: renderAir,
        ads: renderAds,
        launch: renderLaunchData,
        brand: renderBrand,
        checklist: renderChecklist
    };
    renderers[APP.currentPage]();
    window.scrollTo(0, 0);
    if (focusContent)
        document.getElementById('pageContent').focus({ preventScroll: true });
}
function mobileBackMarkup() {
    return '';
}

function renderMobileFlowFooter(nextPage, nextTitle) {
    return '<nav class="mobile-flow-footer" aria-label="Следующий шаг">' +
        '<button class="button button-primary button-full mobile-flow-next" type="button" data-navigate="' + escapeAttribute(nextPage) + '">Далее: ' + escapeHtml(nextTitle) + ' →</button>' +
        '<button class="mobile-flow-home" type="button" data-navigate="home">На главную</button>' +
    '</nav>';
}

function renderChecklistMobileFooter(done) {
    if (done) {
        return '<nav class="mobile-flow-footer mobile-flow-footer-complete" aria-label="Завершение проверки">' +
            '<button class="button button-primary button-full mobile-flow-next" type="button" data-navigate="home">Вернуться на главную</button>' +
        '</nav>';
    }
    return '<nav class="mobile-flow-footer mobile-flow-footer-checklist" aria-label="Навигация">' +
        '<button class="mobile-flow-home" type="button" data-navigate="home">На главную</button>' +
    '</nav>';
}
function isReadyFile(file) {
    return !!(file && file.download_url);
}
function getStepStatus(stepKey) {
    if (isOnAir()) {
        return {
            done: true,
            copy: 'Этап запуска завершён: станция уже в эфире.'
        };
    }
    if (stepKey === 'air') {
        var streamReady = !!String(APP.settings.stream_url || '').trim();
        var connectionReady = !!String((APP.connectionData && APP.connectionData.connection_type) || '').trim();
        var intro = findFile(['влет', 'влёт', 'intro']);
        var opening = findFile(['открываш', 'opening']);
        var outro = findFile(['вылет', 'outro']);
        var rds = findFile(['pi/rds', 'pi-rds', 'rds']);
        var guard = findFile(['сторож', 'резервн']);
        var filesReady = [intro, opening, outro, rds, guard].every(isReadyFile);
        var done = streamReady && connectionReady && filesReady;
        var copy;
        if (done) {
            copy = 'Поток, параметры и технические файлы уже подготовлены.';
        }
        else if (!streamReady) {
            copy = 'Основной поток пока не добавлен.';
        }
        else if (!connectionReady) {
            copy = 'Параметры подключения ещё не загружены.';
        }
        else {
            copy = 'Не весь технический комплект пока доступен.';
        }
        return { done: done, copy: copy };
    }
    if (stepKey === 'brand') {
        var mediaKit = findFile(['медиакит', 'media kit', 'mediakit']);
        var brandbook = findFile(['брендбук', 'brandbook']);
        var rules = findLogoRulesFile();
        var brandDone = isReadyFile(mediaKit) && isReadyFile(brandbook) && isReadyFile(rules);
        return {
            done: brandDone,
            copy: brandDone
                ? 'Media Kit, брендбук и правила использования уже доступны.'
                : 'Часть материалов станции ещё готовится.'
        };
    }
    if (stepKey === 'ads') {
        var spot = findFile(['рекламный ролик', 'ролик', '.mp4']);
        var layout = findFile(['рекламный макет', 'макет']);
        var logo = findFrequencyLogo();
        var adsDone = isReadyFile(spot) && isReadyFile(layout) && isReadyFile(logo);
        return {
            done: adsDone,
            copy: adsDone
                ? 'Ролик, макет и логотип вашей станции уже подготовлены.'
                : 'Не все рекламные материалы для станции пока доступны.'
        };
    }
    if (stepKey === 'launch') {
        var dateReady = !!normalizeDateForInput(APP.form.launchDate);
        var phoneReady = !!String(APP.form.advertisingPhone || '').trim();
        var launchDone = dateReady && phoneReady;
        var launchCopy;
        if (launchDone) {
            launchCopy = 'Дата запуска и контакт рекламной службы указаны.';
        }
        else if (!dateReady && !phoneReady) {
            launchCopy = 'Укажите дату запуска и телефон рекламной службы. Телефон понадобится нам для записи голосовой отбивки в эфир.';
        }
        else if (!dateReady) {
            launchCopy = 'Осталось указать дату запуска.';
        }
        else {
            launchCopy = 'Осталось указать телефон рекламной службы. Мы запишем с ним голосовую отбивку для эфира.';
        }
        return { done: launchDone, copy: launchCopy };
    }
    if (stepKey === 'checklist') {
        var checked = CHECK_ITEMS.filter(function (item) {
            return APP.checklist.has(item.key);
        }).length;
        var checklistDone = checked === CHECK_ITEMS.length;
        return {
            done: checklistDone,
            copy: checklistDone
                ? 'Все пять пунктов финальной проверки подтверждены.'
                : 'Подтверждено ' + checked + ' из ' + CHECK_ITEMS.length + ' пунктов.'
        };
    }
    return { done: false, copy: '' };
}
function getLaunchSteps() {
    var definitions = [
        { key: 'air', page: 'air', title: 'Подключение эфира' },
        { key: 'brand', page: 'brand', title: 'Материалы станции' },
        { key: 'ads', page: 'ads', title: 'Реклама' },
        { key: 'launch', page: 'launch', title: 'Дата и контакты запуска' },
        { key: 'checklist', page: 'checklist', title: 'Финальная проверка' }
    ];
    var steps = definitions.map(function (definition) {
        var status = getStepStatus(definition.key);
        return {
            key: definition.key,
            page: definition.page,
            title: definition.title,
            done: status.done,
            copy: status.copy,
            state: status.done ? 'done' : 'pending'
        };
    });
    var nextAssigned = false;
    steps.forEach(function (step) {
        if (!step.done && !nextAssigned) {
            step.state = 'next';
            nextAssigned = true;
        }
    });
    return steps;
}
function getLaunchProgress(steps) {
    steps = steps || getLaunchSteps();
    var done = steps.filter(function (step) { return step.done; }).length;
    return {
        done: done,
        total: steps.length,
        percent: steps.length ? Math.round(done / steps.length * 100) : 0
    };
}
function getNextStep(steps) {
    steps = steps || getLaunchSteps();
    return steps.find(function (step) { return step.state === 'next'; }) || null;
}
function getUserFirstName() {
    var name = String(APP.user && APP.user.name ? APP.user.name : '').trim();
    if (!name)
        return '';
    var first = name.split(/\s+/)[0];
    if (!first || first.length < 2 || /^(ооо|ип|ао|пао|зао|ooo|radio|радио)$/i.test(first))
        return '';
    return first;
}
function renderLaunchStep(step, index) {
    var marker;
    var statusLabel;
    if (step.state === 'done') {
        marker = '✓';
        statusLabel = 'Готово';
    }
    else if (step.state === 'next') {
        marker = '→';
        statusLabel = 'Следующий шаг';
    }
    else {
        marker = ('0' + (index + 1)).slice(-2);
        statusLabel = 'Нужно действие';
    }
    return '<button class="launch-step is-' + escapeAttribute(step.state) + '" type="button" data-navigate="' + escapeAttribute(step.page) + '">' +
        '<span class="launch-step-marker" aria-hidden="true">' + escapeHtml(marker) + '</span>' +
        '<span class="launch-step-main">' +
            '<span class="launch-step-title">' + escapeHtml(step.title) + '</span>' +
            '<span class="launch-step-copy">' + escapeHtml(step.copy) + '</span>' +
        '</span>' +
        '<span class="launch-step-status">' + escapeHtml(statusLabel) + '</span>' +
    '</button>';
}
/* ---------- HOME ---------- */
function renderHome() {
    var content = document.getElementById('pageContent');
    var firstName = getUserFirstName();
    var greeting = firstName ? 'Добро пожаловать, ' + firstName : 'Добро пожаловать';
    var steps = getLaunchSteps();
    var progress = getLaunchProgress(steps);
    var next = getNextStep(steps);
    var onAir = isOnAir();
    var statusLabel = onAir ? 'В эфире' : 'Подготовка станции';
    var intro = onAir
        ? 'Станция уже работает в эфире. Материалы и параметры запуска остаются доступны в портале.'
        : 'Основные материалы и параметры уже готовы. Ниже — то, что осталось проверить.';
    var nextEyebrow;
    var nextTitle;
    var nextCopy;
    var nextPage;
    var ctaLabel;
    if (onAir) {
        nextEyebrow = 'Статус';
        nextTitle = 'Станция в эфире';
        nextCopy = 'Подготовка завершена. Здесь можно проверить итоговые параметры запуска.';
        nextPage = 'checklist';
        ctaLabel = 'Открыть финальную проверку →';
    }
    else if (next) {
        nextEyebrow = 'Следующий шаг';
        nextTitle = next.title;
        nextCopy = next.copy;
        nextPage = next.page;
        ctaLabel = 'Перейти к ' + next.title + ' →';
    }
    else {
        nextEyebrow = 'Готово';
        nextTitle = 'Подготовка завершена';
        nextCopy = 'Все пять этапов готовы. Проверьте итоговые параметры перед выходом станции в эфир.';
        nextPage = 'checklist';
        ctaLabel = 'Перейти к финальной проверке →';
    }
    var stepsMarkup = steps.map(renderLaunchStep).join('');
    content.innerHTML = `
      <div class="onboarding-home">
        <div class="onboarding-dashboard">
          <div class="onboarding-primary">
            <header class="onboarding-head">
              <p class="onboarding-kicker">Радио Шоколад · запуск станции</p>
              <h1 class="onboarding-title">${escapeHtml(greeting)}</h1>
              <p class="onboarding-copy">${escapeHtml(intro)}</p>
              <div class="onboarding-status">${escapeHtml(statusLabel)}</div>
            </header>

            <section class="launch-overview" aria-label="Готовность запуска">
              <div class="launch-progress-meta">
                <div>
                  <div class="launch-progress-label">Готовность запуска</div>
                  <div class="launch-progress-value">${progress.done} из ${progress.total} этапов готово</div>
                </div>
                <div class="launch-progress-percent">${progress.percent}%</div>
              </div>
              <div class="launch-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${progress.total}" aria-valuenow="${progress.done}" aria-label="Готовность запуска">
                <div class="launch-progress-fill" style="width:${progress.percent}%"></div>
              </div>
            </section>

            <section class="next-step-panel">
              <p class="next-step-eyebrow">${escapeHtml(nextEyebrow)}</p>
              <h2 class="next-step-title">${escapeHtml(nextTitle)}</h2>
              <p class="next-step-copy">${escapeHtml(nextCopy)}</p>
              <div class="next-step-actions">
                <button class="button button-primary" type="button" data-navigate="${escapeAttribute(nextPage)}">${escapeHtml(ctaLabel)}</button>
              </div>
            </section>
          </div>

          <section class="launch-steps">
            <div class="launch-steps-head">
              <div>
                <h2 class="section-title">Путь к запуску</h2>
                <p class="section-copy">Можно открыть любой этап.</p>
              </div>
            </div>
            <div class="launch-step-list">${stepsMarkup}</div>
          </section>
        </div>
      </div>`;
}
/* ---------- AIR ---------- */
function renderAir() {
    var content = document.getElementById('pageContent');
    var stream = String(APP.settings.stream_url || '');
    var dulov = findContact('Александр Дулов', 'техничес');
    var intro = findFile(['влет', 'влёт', 'intro']);
    var opening = findFile(['открываш', 'opening']);
    var outro = findFile(['вылет', 'outro']);
    var rds = findFile(['pi/rds', 'pi-rds', 'rds']);
    var guard = findFile(['сторож', 'резервн']);

    content.innerHTML = `
      ${mobileBackMarkup()}
      <header class="page-head">
        <h1 class="page-title">Подключение эфира</h1>
        <p class="page-lead">Передайте техническому специалисту поток, параметры и файлы для подключения.</p>
      </header>

      <div class="desktop-grid-8-4 air-layout">
        <div class="air-main">
          <section class="section air-stream-section">
            <p class="eyebrow">Основной поток</p>
            <div class="stream-row">
              <div class="stream-url">${stream ? escapeHtml(stream) : 'Поток пока не указан'}</div>
              <button class="button button-secondary" type="button" data-copy-stream ${stream ? '' : 'disabled'}>Скопировать поток</button>
            </div>
            <div id="streamCopyStatus" class="inline-status" aria-live="polite"></div>
          </section>

          <section class="section">
            <p class="eyebrow">Рекламный блок</p>
            <h2 class="section-title">Влёт</h2>
            <div class="timing-value">${escapeHtml(getTimingLabel())}</div>
            <div class="timing-meta">Допуск ${escapeHtml(getTolerance())}<br>Рекламный блок — не более ${escapeHtml(String(getAdMaxSeconds()))} секунд</div>
          </section>

          <section class="section">
            <p class="eyebrow">Технические файлы</p>
            <div class="file-list">
              ${renderFileRow('Влёт в рекламный блок', intro, 'Скачать влёт')}
              ${renderFileRow('Открывашка', opening, 'Скачать открывашку')}
              ${renderFileRow('Вылет', outro, 'Скачать вылет')}
              ${renderRdsFileRow(rds)}
            </div>
          </section>
        </div>

        <aside class="air-side-rail">
          <div class="soft-panel">
            <p class="eyebrow">Резервное вещание</p>
            <h2 class="section-title">«Сторож»</h2>
            <p class="section-copy">Продолжит вещание, если основной поток прервётся. Передайте резервный плейлист техническому специалисту.</p>
            <div class="panel-action">${renderFileAction(guard, 'Скачать резервный плейлист', 'button button-secondary button-full')}</div>
            ${renderFileErrorSlot(guard)}
          </div>

          <div class="soft-panel">
            <h2 class="section-title">Нужна помощь с подключением?</h2>
            ${dulov ? renderDulovContact(dulov) : '<p class="section-copy">Контакт технического специалиста пока не добавлен.</p>'}
          </div>
        </aside>
      </div>`;

    content.insertAdjacentHTML('beforeend', renderMobileFlowFooter('brand', 'Материалы станции'));
}
function renderRdsFileRow(file) {
    return "\n    <div class=\"file-row file-row-rds\">\n      <div class=\"file-row-main\">\n        <div class=\"file-row-name\">PI / RDS вашей станции</div>\n        <div class=\"rds-own-action\">"
        .concat(renderFileAction(file, 'Открыть PI/RDS', 'text-action'), "</div>\n        ")
        .concat(!file ? '<div class="file-error">Файл пока не добавлен.</div>' : '', "\n        ")
        .concat(file ? "<div id=\"fileError-".concat(escapeAttribute(file.file_id), "\" class=\"file-error hidden\"></div>") : '', "\n        <div class=\"rds-other-block\">\n          <a class=\"rds-lookup-link\" href=\"https://radiords.ru/poisk-pi/?filtr_radio_location=&amp;filtr_radio_category=&amp;filtr_radio_pi_code=7729\" target=\"_blank\" rel=\"noopener noreferrer\">Найти PI/RDS другой радиостанции ↗</a>\n        </div>\n      </div>\n    </div>");
}

function renderDulovContact(contact) {
    return "\n    <div class=\"contact-name\">".concat(escapeHtml(contact.name || 'Александр Дулов'), "</div>\n    <div class=\"contact-role\">").concat(escapeHtml(contact.role || 'Технический специалист'), "</div>\n    <div class=\"contact-phone\">").concat(escapeHtml(contact.phone || ''), "</div>\n    <div class=\"contact-buttons\">\n      <button class=\"button button-primary\" type=\"button\" data-call-phone=\"").concat(escapeAttribute(contact.phone || ''), "\">\u041F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C \u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440\u0443</button>\n      <button class=\"button button-secondary\" type=\"button\" data-copy-phone=\"").concat(escapeAttribute(contact.phone || ''), "\" data-status-target=\"techContactStatus\">\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043D\u043E\u043C\u0435\u0440</button>\n    </div>\n    <div id=\"techContactStatus\" class=\"inline-status\" aria-live=\"polite\"></div>");
}
/* ---------- ADS ---------- */
function renderAds() {
    var content = document.getElementById('pageContent');
    var spot = findFile(['рекламный ролик', 'ролик', '.mp4']);
    var layout = findFile(['рекламный макет', 'макет']);
    var logo = findFrequencyLogo();
    var rules = findLogoRulesFile();
    var frequency = APP.launch.frequency || '';

    content.innerHTML = `
      ${mobileBackMarkup()}
      <header class="page-head">
        <h1 class="page-title">Реклама</h1>
        <p class="page-lead">Ролик, логотип и макет для запуска станции.</p>
      </header>

      <div class="ads-composition-grid">
        <section class="ads-item ads-item-spot">
          <p class="eyebrow">Рекламный ролик</p>
          <h2 class="section-title">Ролик для вашей станции</h2>
          <p class="section-copy">Готовый материал для запуска. Используйте фирменную версию с частотой ${escapeHtml(frequency)}.</p>
          <div class="ads-item-action">${renderFileAction(spot, 'Скачать ролик', 'button button-primary')}</div>
          ${renderFileErrorSlot(spot)}
        </section>

        <aside class="ads-item ads-item-logo">
          <p class="eyebrow">Логотип станции</p>
          <h2 class="section-title">Версия с вашей частотой</h2>
          <p class="section-copy">Используйте этот логотип в локальных рекламных материалах.</p>
          <div class="ads-item-action">${logo ? renderFrequencyLogo(logo) : renderMissingLogo()}</div>
        </aside>

        <section class="ads-item ads-item-layout">
          <p class="eyebrow">Рекламный макет</p>
          <h2 class="section-title">Макет для размещения</h2>
          <p class="section-copy">Используйте готовый макет и фирменный логотип станции. Остальные элементы менять не нужно.</p>
          <div class="ads-item-action">${renderFileAction(layout, 'Скачать макет', 'button button-secondary')}</div>
          ${renderFileErrorSlot(layout)}
        </section>

        <section class="ads-item ads-item-rules">
          <p class="eyebrow">Дополнительные материалы</p>
          <h2 class="section-title">Другой макет или инфопартнёрство?</h2>
          <p class="section-copy">Перед подготовкой собственного материала проверьте правила размещения логотипа.</p>
          <div class="ads-item-action">${renderFileAction(rules, 'Открыть правила →', 'link-action')}</div>
          ${renderFileErrorSlot(rules)}
        </section>
      </div>`;

    content.insertAdjacentHTML('beforeend', renderMobileFlowFooter('launch', 'Дата и контакты запуска'));
}
function renderFrequencyLogo(file) {
    return "\n    "
        .concat(
            renderFileAction(
                file,
                'Скачать логотип',
                'button button-secondary button-full'
            ),
            "\n    "
        )
        .concat(renderFileErrorSlot(file));
}
function renderMissingLogo() {
    return "\n    <div class=\"missing-logo\">\n      <h2 class=\"section-title\">\u0412\u0435\u0440\u0441\u0438\u044F \u0434\u043B\u044F ".concat(escapeHtml(APP.launch.frequency || ''), " \u043F\u043E\u043A\u0430 \u043D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430</h2>\n      <p class=\"section-copy\">\u041C\u044B \u043C\u043E\u0436\u0435\u043C \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u0438\u0442\u044C \u0435\u0451 \u0434\u043B\u044F ").concat(escapeHtml(APP.launch.city || 'вашей станции'), ".</p>\n      <button class=\"button button-secondary button-full\" type=\"button\" data-show-logo-contact style=\"margin-top:18px\">\u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u0443 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430</button>\n      <div id=\"logoManagerActions\" class=\"hidden\" style=\"margin-top:18px\"></div>\n    </div>");
}
/* ---------- LAUNCH DATA ---------- */
function renderLaunchData() {
    var content = document.getElementById('pageContent');
    var valid = communicationReady();
    content.innerHTML = "\n    ".concat(mobileBackMarkup(), "\n    <header class=\"page-head\">\n      <h1 class=\"page-title\">Дата и контакты запуска</h1>\n      <p class=\"page-lead\">Укажите дату запуска и телефон рекламной службы. Данные сохраняются автоматически.</p>\n    </header>\n\n    <div class=\"desktop-grid-7-5 launch-layout\">\n      <div class=\"form-panel\">\n        <p class=\"eyebrow\">").concat(escapeHtml(APP.launch.city || ''), " · ").concat(escapeHtml(APP.launch.frequency || ''), "</p>\n\n        <div class=\"field-group\" style=\"margin-top:24px\">\n          <label class=\"field-label\" for=\"launchDateInput\">Дата запуска</label>\n          <input id=\"launchDateInput\" class=\"text-input\" type=\"date\" value=\"").concat(escapeAttribute(normalizeDateForInput(APP.form.launchDate)), "\">\n          <p class=\"field-help\">Укажите точную дату заранее, чтобы мы успели подготовить анонс.</p>\n          <p id=\"launchDateError\" class=\"field-error hidden\"></p>\n        </div>\n\n        <div class=\"field-group\">\n          <label class=\"field-label\" for=\"advertisingPhoneInput\">Телефон рекламной службы</label>\n          <input id=\"advertisingPhoneInput\" class=\"text-input\" type=\"tel\" inputmode=\"tel\" autocomplete=\"tel\" placeholder=\"+7\" value=\"").concat(escapeAttribute(APP.form.advertisingPhone || ''), "\">\n          <p class=\"field-help\">По этому номеру мы подготовим голосовую отбивку для эфира.</p>\n          <p id=\"advertisingPhoneError\" class=\"field-error hidden\"></p>\n        </div>\n\n        <div id=\"launchSaveState\" class=\"save-state\" aria-live=\"polite\"></div>\n      </div>\n\n      <aside class=\"message-panel\">\n        <p class=\"eyebrow\">Продублировать менеджеру</p>\n        <p class=\"section-copy optional-copy\">Необязательно. Можно продублировать данные менеджеру в Telegram или по email.</p>\n        <div id=\"messagePreview\" class=\"message-preview\">").concat(escapeHtml(buildLocalMessage()).replace(/\n/g, '<br>'), "</div>\n        <div class=\"communication-actions\">\n          <a id=\"telegramLink\" class=\"link-button link-button-primary is-disabled\" href=\"#\" target=\"_blank\" rel=\"noopener noreferrer\" data-communication=\"telegram\" aria-disabled=\"true\">Написать в Telegram</a>\n          <a id=\"emailLink\" class=\"link-button link-button-secondary is-disabled\" href=\"#\" data-communication=\"email\" aria-disabled=\"true\">Отправить email</a>\n        </div>\n        <p id=\"communicationDisabledNote\" class=\"disabled-note\">").concat(valid ? 'Подготавливаем ссылки…' : 'Ссылки появятся после заполнения даты и телефона.', "</p>\n        <div id=\"communicationError\" class=\"communication-error hidden\"></div>\n        <div id=\"communicationFallback\" class=\"communication-fallback hidden\"></div>\n        <div id=\"communicationCopyStatus\" class=\"inline-status\" aria-live=\"polite\"></div>\n      </aside>\n    </div>");
    updateCommunicationUi();
    if (valid && !APP.communication.loading && (!APP.communication.email || !APP.communication.telegram)) {
        prepareCommunicationLinks();
    }

    content.insertAdjacentHTML('beforeend', renderMobileFlowFooter('checklist', 'Финальная проверка'));
}
/* ---------- BRAND ---------- */
function renderBrand() {
    var content = document.getElementById('pageContent');
    var mediaKit = findFile(['медиакит', 'media kit', 'mediakit']);
    var brandbook = findFile(['брендбук', 'brandbook']);
    var rules = findLogoRulesFile();
    content.innerHTML = "\n    ".concat(mobileBackMarkup(), "\n    <header class=\"page-head\">\n      <h1 class=\"page-title\">Материалы станции</h1>\n      <p class=\"page-lead\">Media Kit, брендбук и правила работы с логотипом.</p>\n    </header>\n    <div class=\"resource-list\">\n      ").concat(renderResourceRow('Media Kit', 'О станции, аудитории, программах и рекламных возможностях.', mediaKit), "\n      ").concat(renderResourceRow('Брендбук', 'Логотип, цвета, шрифты и правила использования.', brandbook), "\n      ").concat(renderResourceRow('Правила работы с логотипом', 'Для афиш, приглашений, пресс-воллов и других материалов.', rules), "\n    </div>");

    content.insertAdjacentHTML('beforeend', renderMobileFlowFooter('ads', 'Реклама'));
}
/* ---------- CHECKLIST ---------- */
function renderChecklist() {
    var content = document.getElementById('pageContent');
    var done = CHECK_ITEMS.every(function (item) { return APP.checklist.has(item.key); });
    content.innerHTML = "\n    ".concat(mobileBackMarkup(), "\n    <header class=\"page-head\">\n      <h1 class=\"page-title\">Финальная проверка</h1>\n      <p class=\"page-lead\">Перед выходом в эфир подтвердите пять пунктов.</p>\n    </header>\n\n    ").concat(done ? "\n      <div class=\"success-block\">\n        <p class=\"success-block-title\">Всё проверено</p>\n        <p class=\"success-block-copy\">Все пять пунктов подтверждены. Станция готова к выходу в эфир.</p>\n      </div>" : '', "\n\n    <div class=\"desktop-grid-8-4 checklist-layout\">\n      <div>\n        <div class=\"checklist-list\">\n          ").concat(CHECK_ITEMS.map(renderCheckItem).join(''), "\n        </div>\n        <div id=\"checklistSaveState\" class=\"checklist-save\" aria-live=\"polite\"></div>\n      </div>\n\n      <aside class=\"parameters-panel\">\n        <p class=\"eyebrow\">Ваши параметры</p>\n        <div class=\"parameters-list\">\n          <div><div class=\"parameter-label\">Станция</div><div class=\"parameter-value\">").concat(escapeHtml(APP.launch.city || ''), " · ").concat(escapeHtml(APP.launch.frequency || ''), "</div></div>\n          <div><div class=\"parameter-label\">Влёт</div><div class=\"parameter-value\">").concat(escapeHtml(getTimingLabel()), "</div></div>\n          <div><div class=\"parameter-label\">Допуск</div><div class=\"parameter-value\">").concat(escapeHtml(getTolerance()), "</div></div>\n          <div><div class=\"parameter-label\">Рекламный блок</div><div class=\"parameter-value\">Не более ").concat(escapeHtml(String(getAdMaxSeconds())), " секунд</div></div>\n        </div>\n      </aside>\n    </div>");

    content.insertAdjacentHTML('beforeend', renderChecklistMobileFooter(done));
}
function renderCheckItem(item) {
    var checked = APP.checklist.has(item.key);
    return "\n    <label class=\"check-item\">\n      <input type=\"checkbox\" data-check-key=\"".concat(escapeAttribute(item.key), "\" ").concat(checked ? 'checked' : '', ">\n      <span class=\"check-box\" aria-hidden=\"true\"></span>\n      <span class=\"check-copy\">").concat(item.render(), "</span>\n    </label>");
}
function renderCheckStream() { return 'Основной поток работает, а «Сторож» подключён и готов подхватить эфир.'; }
function renderCheckAssets() { return 'Влёт, открывашка и вылет загружены, PI/RDS настроены.'; }
function renderCheckTiming() { return "\u0420\u0435\u043A\u043B\u0430\u043C\u043D\u044B\u0435 \u0431\u043B\u043E\u043A\u0438 \u0441\u0442\u043E\u044F\u0442 \u043D\u0430 ".concat(escapeHtml(getTimingLabel()), ", \u0434\u043E\u043F\u0443\u0441\u043A ").concat(escapeHtml(getTolerance()), ", \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u2014 \u043D\u0435 \u0431\u043E\u043B\u0435\u0435 ").concat(escapeHtml(String(getAdMaxSeconds())), " \u0441\u0435\u043A\u0443\u043D\u0434."); }
function renderCheckBranding() { return "\u0412 \u0440\u043E\u043B\u0438\u043A\u0435 \u0438 \u043C\u0430\u043A\u0435\u0442\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u043B\u043E\u0433\u043E\u0442\u0438\u043F ".concat(escapeHtml(APP.launch.frequency || ''), "."); }
function renderCheckLaunchData() { return 'Дата запуска и телефон рекламной службы указаны.'; }
/* ---------- PAGE EVENTS ---------- */
function handlePageClick(event) {
    var nav = event.target.closest('[data-navigate]');
    if (nav) {
        event.preventDefault();
        navigate(nav.dataset.navigate);
        return;
    }
    var copyStream = event.target.closest('[data-copy-stream]');
    if (copyStream) {
        copyText(APP.settings.stream_url || '').then(function (ok) {
            setInlineStatus('streamCopyStatus', ok ? 'Ссылка скопирована' : 'Не удалось скопировать', !ok);
        });
        return;
    }
    var fileButton = event.target.closest('[data-file-id]');
    if (fileButton) {
        event.preventDefault();
        openFile(fileButton.dataset.fileId, fileButton);
        return;
    }
    var call = event.target.closest('[data-call-phone]');
    if (call) {
        callPhone(call.dataset.callPhone);
        return;
    }
    var copyPhone = event.target.closest('[data-copy-phone]');
    if (copyPhone) {
        copyText(copyPhone.dataset.copyPhone).then(function (ok) {
            setInlineStatus(copyPhone.dataset.statusTarget, ok ? 'Номер скопирован' : 'Не удалось скопировать', !ok);
        });
        return;
    }
    var logoContact = event.target.closest('[data-show-logo-contact]');
    if (logoContact) {
        showLogoManagerActions();
        return;
    }
    var logoTelegram = event.target.closest('[data-logo-telegram]');
    if (logoTelegram) {
        var message = buildLogoRequestMessage();
        copyTextSilent(message);
        return;
    }
    var copyType = event.target.closest('[data-copy-type]');
    if (copyType) {
        handleCommunicationCopy(copyType.dataset.copyType);
        return;
    }
    var communication = event.target.closest('[data-communication]');
    if (communication) {
        if (communication.getAttribute('aria-disabled') === 'true') {
            event.preventDefault();
            return;
        }
        handleCommunicationClick(communication.dataset.communication);
    }
}
function handlePageInput(event) {
    if (event.target.id === 'launchDateInput') {
        APP.form.launchDate = event.target.value;
        saveDraftLocal();
        onLaunchFormChanged();
    }
    if (event.target.id === 'advertisingPhoneInput') {
        APP.form.advertisingPhone = event.target.value;
        saveDraftLocal();
        onLaunchFormChanged();
    }
}
function handlePageChange(event) {
    var checkbox = event.target.closest('[data-check-key]');
    if (!checkbox)
        return;
    var key = checkbox.dataset.checkKey;
    if (checkbox.checked)
        APP.checklist.add(key);
    else
        APP.checklist.delete(key);
    scheduleChecklistSave();
    renderChecklist();
}
function handlePageFocusOut(event) {
    if (event.target.id === 'launchDateInput' || event.target.id === 'advertisingPhoneInput') {
        clearTimeout(launchSaveTimer);
        saveLaunchDetailsNow();
    }
}
/* ---------- AUTOSAVE ---------- */
function onLaunchFormChanged() {
    invalidateCommunication();
    updateLaunchDataDynamicUi();
    scheduleLaunchSave();
}
function scheduleLaunchSave() {
    clearTimeout(launchSaveTimer);
    setLaunchSaveState('Сохраняем…', false);
    launchSaveTimer = setTimeout(saveLaunchDetailsNow, LAUNCH_SAVE_DELAY);
}
function saveLaunchDetailsNow() {
    return __awaiter(this, void 0, void 0, function () {
        var date, phone, requestId, result, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!APP.launch || !APP.sessionToken)
                        return [2 /*return*/];
                    clearTimeout(launchSaveTimer);
                    date = normalizeDateForInput(APP.form.launchDate);
                    phone = String(APP.form.advertisingPhone || '').trim();
                    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                        setLaunchSaveState('Проверьте дату запуска.', true);
                        return [2 /*return*/];
                    }
                    requestId = ++launchSaveRequestId;
                    setLaunchSaveState('Сохраняем…', false);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, authRpc('saveLaunchDetails', {
                            launch_id: APP.launch.launch_id,
                            planned_launch_date: date,
                            advertising_phone: phone
                        })];
                case 2:
                    result = _a.sent();
                    if (requestId !== launchSaveRequestId)
                        return [2 /*return*/];
                    APP.form.launchDate = normalizeDateForInput(result.planned_launch_date || date);
                    APP.form.advertisingPhone = String(result.advertising_phone || phone);
                    APP.launch.planned_launch_date = APP.form.launchDate;
                    APP.launch.advertising_phone = APP.form.advertisingPhone;
                    if (APP.launchStatus) {
                        APP.launchStatus.planned_launch_date = APP.form.launchDate;
                        APP.launchStatus.advertising_phone = APP.form.advertisingPhone;
                    }
                    saveDraftLocal();
                    setLaunchSaveState('Сохранено', false);
                    if (communicationReady())
                        prepareCommunicationLinks();
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    if (isSessionError(error_7))
                        return [2 /*return*/];
                    console.error(error_7);
                    setLaunchSaveState('Не удалось сохранить. Проверьте интернет и попробуйте ещё раз.', true);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function setLaunchSaveState(message, error) {
    var el = document.getElementById('launchSaveState');
    if (!el)
        return;
    el.textContent = message || '';
    el.classList.toggle('is-error', !!error);
}
function updateLaunchDataDynamicUi() {
    var preview = document.getElementById('messagePreview');
    if (preview)
        preview.innerHTML = escapeHtml(buildLocalMessage()).replace(/\n/g, '<br>');
    updateCommunicationUi();
}
function saveDraftLocal() {
    if (!APP.launch)
        return;
    localStorage.setItem(launchStorageKey(APP.launch.launch_id, 'launchForm'), JSON.stringify(APP.form));
}
function restoreLaunchForm() {
    APP.form = {
        launchDate: normalizeDateForInput((APP.launchStatus && APP.launchStatus.planned_launch_date) || APP.launch.planned_launch_date || ''),
        advertisingPhone: String((APP.launchStatus && APP.launchStatus.advertising_phone) || APP.launch.advertising_phone || '')
    };
    var local = localStorage.getItem(launchStorageKey(APP.launch.launch_id, 'launchForm'));
    if (!local)
        return;
    try {
        var parsed = JSON.parse(local);
        if (!APP.form.launchDate && parsed.launchDate)
            APP.form.launchDate = normalizeDateForInput(parsed.launchDate);
        if (!APP.form.advertisingPhone && parsed.advertisingPhone)
            APP.form.advertisingPhone = String(parsed.advertisingPhone);
    }
    catch (_) { }
}
/* ---------- COMMUNICATION ---------- */
function communicationReady() {
    return !!normalizeDateForInput(APP.form.launchDate) && !!String(APP.form.advertisingPhone || '').trim();
}
function invalidateCommunication() {
    communicationRequestId += 1;
    APP.communication.email = null;
    APP.communication.telegram = null;
    APP.communication.loading = false;
    APP.communication.error = '';
}
function prepareCommunicationLinks() {
    return __awaiter(this, void 0, void 0, function () {
        var requestId, payload, settled, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!communicationReady() || !APP.launch) {
                        updateCommunicationUi();
                        return [2 /*return*/];
                    }
                    requestId = ++communicationRequestId;
                    APP.communication.loading = true;
                    APP.communication.error = '';
                    updateCommunicationUi();
                    payload = {
                        launch_id: APP.launch.launch_id,
                        launch_date: formatDateRu(APP.form.launchDate),
                        advertising_phone: String(APP.form.advertisingPhone || '').trim(),
                        connection_type: APP.connectionType
                    };
                    return [4 /*yield*/, Promise.allSettled([
                            authRpc('createEmailLink', payload),
                            authRpc('createTelegramLink', payload)
                        ])];
                case 1:
                    settled = _a.sent();
                    if (requestId !== communicationRequestId)
                        return [2 /*return*/];
                    APP.communication.loading = false;
                    APP.communication.email = settled[0].status === 'fulfilled' ? settled[0].value : null;
                    APP.communication.telegram = settled[1].status === 'fulfilled' ? settled[1].value : null;
                    errors = settled.filter(function (item) { return item.status === 'rejected'; });
                    APP.communication.error = errors.length ? 'Не удалось подготовить один из способов связи. Можно скопировать данные вручную.' : '';
                    updateCommunicationUi();
                    return [2 /*return*/];
            }
        });
    });
}
function updateCommunicationUi() {
    var tg = document.getElementById('telegramLink');
    var email = document.getElementById('emailLink');
    var note = document.getElementById('communicationDisabledNote');
    var error = document.getElementById('communicationError');
    if (!tg || !email)
        return;
    var ready = communicationReady();
    var tgReady = ready && APP.communication.telegram && APP.communication.telegram.url;
    var emailReady = ready && APP.communication.email && APP.communication.email.url;
    setLinkState(tg, tgReady ? APP.communication.telegram.url : '#', !!tgReady);
    setLinkState(email, emailReady ? APP.communication.email.url : '#', !!emailReady);
    if (!ready) {
        note.textContent = 'Сначала укажите дату запуска и телефон рекламной службы.';
    }
    else if (APP.communication.loading) {
        note.textContent = 'Подготавливаем ссылки…';
    }
    else if (tgReady && emailReady) {
        note.textContent = '';
    }
    else {
        note.textContent = 'Если приложение связи не открывается, используйте копирование ниже.';
    }
    if (APP.communication.error) {
        error.textContent = APP.communication.error;
        error.classList.remove('hidden');
        showCommunicationFallback('both');
    }
    else {
        error.textContent = '';
        error.classList.add('hidden');
    }
}
function setLinkState(element, href, enabled) {
    element.href = href;
    element.classList.toggle('is-disabled', !enabled);
    element.setAttribute('aria-disabled', enabled ? 'false' : 'true');
}
function handleCommunicationClick(type) {
    if (type === 'telegram') {
        var text = APP.communication.telegram && APP.communication.telegram.text ? APP.communication.telegram.text : buildLocalMessage();
        copyTextSilent(text);
        setTimeout(function () { showCommunicationFallback('telegram'); }, 450);
    }
    else if (type === 'email') {
        setTimeout(function () { showCommunicationFallback('email'); }, 450);
    }
}
function showCommunicationFallback(type) {
    var box = document.getElementById('communicationFallback');
    if (!box)
        return;
    var revaz = findContact('Реваз Юрьев', 'запуск');
    var email = revaz ? revaz.email || '' : '';
    var telegram = revaz ? revaz.telegram || '' : '';
    var copy = type === 'telegram'
        ? 'Если Telegram не открылся:'
        : type === 'email'
            ? 'Если почтовая программа не открылась:'
            : 'Можно передать данные вручную:';
    box.innerHTML = "\n    <p>".concat(escapeHtml(copy), "</p>\n    <div class=\"inline-actions\">\n      <button class=\"text-action\" type=\"button\" data-copy-type=\"message\">\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435</button>\n      ").concat(email ? '<button class="text-action" type="button" data-copy-type="email">Скопировать адрес</button>' : '', "\n      ").concat(telegram ? '<button class="text-action" type="button" data-copy-type="telegram">Скопировать контакт</button>' : '', "\n    </div>");
    box.classList.remove('hidden');
}
function handleCommunicationCopy(type) {
    var revaz = findContact('Реваз Юрьев', 'запуск') || {};
    var text = '';
    var success = '';
    if (type === 'message') {
        text = buildLocalMessage();
        success = 'Сообщение скопировано';
    }
    if (type === 'email') {
        text = revaz.email || '';
        success = 'Адрес скопирован';
    }
    if (type === 'telegram') {
        text = revaz.telegram || '';
        success = 'Контакт скопирован';
    }
    copyText(text).then(function (ok) {
        setInlineStatus('communicationCopyStatus', ok ? success : 'Не удалось скопировать', !ok);
    });
}
function buildLocalMessage() {
    return [
        'Chocolate Cover Radio',
        [APP.launch ? APP.launch.city : '', APP.launch ? APP.launch.frequency : ''].filter(Boolean).join(' · '),
        'Дата запуска: ' + (APP.form.launchDate ? formatDateRu(APP.form.launchDate) : 'не указана'),
        'Телефон рекламной службы: ' + (APP.form.advertisingPhone ? String(APP.form.advertisingPhone).trim() : 'не указан')
    ].join('\n');
}
/* ---------- LOGO REQUEST ---------- */
function showLogoManagerActions() {
    var box = document.getElementById('logoManagerActions');
    if (!box)
        return;
    var revaz = findContact('Реваз Юрьев', 'запуск') || {};
    var username = String(revaz.telegram || '').replace(/^@/, '');
    var tgUrl = username ? 'https://t.me/' + encodeURIComponent(username) : '';
    var subject = 'Логотип Chocolate Cover Radio — ' + (APP.launch.city || '') + ' · ' + (APP.launch.frequency || '');
    var emailUrl = revaz.email ? 'mailto:' + encodeURIComponent(revaz.email) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(buildLogoRequestMessage()) : '';
    box.innerHTML = "\n    <div class=\"communication-actions\">\n      ".concat(tgUrl ? "<a class=\"link-button link-button-primary\" href=\"".concat(escapeAttribute(tgUrl), "\" target=\"_blank\" rel=\"noopener noreferrer\" data-logo-telegram>\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0432 Telegram</a>") : '', "\n      ").concat(emailUrl ? "<a class=\"link-button link-button-secondary\" href=\"".concat(escapeAttribute(emailUrl), "\">\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C email</a>") : '', "\n    </div>\n    <p class=\"disabled-note\">\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435: \u00AB").concat(escapeHtml(buildLogoRequestMessage()), "\u00BB</p>");
    box.classList.remove('hidden');
}
function buildLogoRequestMessage() {
    return "\u041D\u0443\u0436\u0435\u043D \u043B\u043E\u0433\u043E\u0442\u0438\u043F Chocolate Cover Radio \u0434\u043B\u044F ".concat(APP.launch.city || 'станции', ", ").concat(APP.launch.frequency || '', ".");
}
/* ---------- CHECKLIST PERSISTENCE ---------- */
function restoreChecklist() {
    APP.checklist = new Set();
    var progress = APP.launchStatus && APP.launchStatus.progress ? APP.launchStatus.progress : {};
    if (!progress.completed_steps)
        return;
    try {
        var parsed = JSON.parse(progress.completed_steps);
        if (Array.isArray(parsed)) {
            var allowed_1 = CHECK_ITEMS.map(function (item) { return item.key; });
            parsed.map(String).filter(function (key) { return allowed_1.includes(key); }).forEach(function (key) { APP.checklist.add(key); });
        }
    }
    catch (_) { }
}
function scheduleChecklistSave() {
    clearTimeout(checklistSaveTimer);
    checklistSaveTimer = setTimeout(saveChecklistProgress, CHECKLIST_SAVE_DELAY);
}
function saveChecklistProgress() {
    return __awaiter(this, void 0, void 0, function () {
        var state, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!APP.launch)
                        return [2 /*return*/];
                    state = document.getElementById('checklistSaveState');
                    if (state) {
                        state.textContent = 'Сохраняем…';
                        state.classList.remove('is-error');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, authRpc('saveProgress', {
                            launch_id: APP.launch.launch_id,
                            current_step: 'checklist',
                            completed_steps: JSON.stringify(Array.from(APP.checklist)),
                            last_action: 'checklist'
                        })];
                case 2:
                    _a.sent();
                    if (state)
                        state.textContent = 'Сохранено';
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    if (isSessionError(error_8))
                        return [2 /*return*/];
                    console.error(error_8);
                    if (state) {
                        state.textContent = 'Не удалось сохранить проверку. Попробуйте ещё раз.';
                        state.classList.add('is-error');
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/* ---------- FILES ---------- */
function renderFileRow(label, file, actionLabel) {
    return "\n    <div class=\"file-row\">\n      <div>\n        <div class=\"file-row-name\">".concat(escapeHtml(label), "</div>\n        ").concat(!file ? '<div class="file-error">Файл пока не добавлен.</div>' : '', "\n        ").concat(file ? "<div id=\"fileError-".concat(escapeAttribute(file.file_id), "\" class=\"file-error hidden\"></div>") : '', "\n      </div>\n      <div class=\"file-row-action\">").concat(renderFileAction(file, actionLabel, 'text-action'), "</div>\n    </div>");
}
function renderFileAction(file, label, className) {
    if (!file || !file.download_url) {
        if ((className || '').includes('button')) {
            return "<button class=\"".concat(escapeAttribute(className || 'button button-secondary'), "\" type=\"button\" disabled>").concat(escapeHtml(label), "</button>");
        }
        return "<span class=\"text-action\" style=\"color:#999;cursor:not-allowed\">".concat(escapeHtml(label), "</span>");
    }
    return "<button class=\"".concat(escapeAttribute(className || 'text-action'), "\" type=\"button\" data-file-id=\"").concat(escapeAttribute(file.file_id), "\">").concat(escapeHtml(label), "</button>");
}
function renderFileErrorSlot(file) {
    if (!file)
        return '<div class="file-error">Файл пока не добавлен.</div>';
    return "<div id=\"fileError-".concat(escapeAttribute(file.file_id), "\" class=\"file-error hidden\"></div>");
}
function renderResourceRow(title, copy, file) {
    return "\n    <div class=\"resource-row\">\n      <div>\n        <div class=\"resource-title\">".concat(escapeHtml(title), "</div>\n        <div class=\"resource-copy\">").concat(escapeHtml(copy), "</div>\n        ").concat(!file ? '<div class="file-error">Материал пока не добавлен.</div>' : '', "\n        ").concat(file ? "<div id=\"fileError-".concat(escapeAttribute(file.file_id), "\" class=\"file-error hidden\"></div>") : '', "\n      </div>\n      <div>").concat(renderFileAction(file, 'Открыть →', 'link-action'), "</div>\n    </div>");
}
function openFile(fileId, button) {
    var file = APP.files.find(function (item) { return String(item.file_id) === String(fileId); });
    if (!file || !file.download_url) {
        showFileError(fileId, 'Не удалось открыть файл. Попробуйте ещё раз.');
        return;
    }
    var opened = window.open(file.download_url, '_blank');
    if (opened) {
        try {
            opened.opener = null;
        }
        catch (_) { }
    }
    if (!opened) {
        showFileError(fileId, 'Не удалось открыть файл. Разрешите открытие новой вкладки и попробуйте ещё раз.');
    }
    else {
        hideFileError(fileId);
    }
}
function showFileError(fileId, message) {
    var el = document.getElementById('fileError-' + fileId);
    if (!el)
        return;
    el.textContent = message;
    el.classList.remove('hidden');
}
function hideFileError(fileId) {
    var el = document.getElementById('fileError-' + fileId);
    if (el)
        el.classList.add('hidden');
}
function fileToken(file) {
    return [file.display_name, file.file_name, file.section, file.file_type]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .replace(/ё/g, 'е');
}
function findFile(aliases) {
    var normalized = aliases.map(function (alias) { return String(alias).toLowerCase().replace(/ё/g, 'е'); });
    return APP.files.find(function (file) {
        var token = fileToken(file);
        return normalized.some(function (alias) { return token.includes(alias); });
    }) || null;
}
function findLogoRulesFile() {
    return APP.files.find(function (file) {
        var token = fileToken(file);
        return token.includes('правил') && token.includes('логотип');
    }) || null;
}
function findFrequencyLogo() {
    var frequency = String(APP.launch.frequency || '').toLowerCase();
    var numeric = frequency.replace(/[^0-9]/g, '');
    return APP.files.find(function (file) {
        var token = fileToken(file);
        var tokenDigits = token.replace(/[^0-9]/g, '');
        return token.includes('логотип') && numeric && tokenDigits.includes(numeric);
    }) || null;
}
function canPreviewImage(file) {
    var token = fileToken(file);
    return !!file.download_url && (/\.(png|jpg|jpeg|webp|svg)\b/i.test(token) || ['image', 'png', 'jpg', 'jpeg', 'webp', 'svg'].includes(String(file.file_type || '').toLowerCase()));
}
/* ---------- CONTACTS ---------- */
function findContact(name, rolePart) {
    var nameNeedle = String(name || '').toLowerCase();
    var roleNeedle = String(rolePart || '').toLowerCase();
    return APP.contacts.find(function (contact) {
        var contactName = String(contact.name || '').toLowerCase();
        var contactRole = String(contact.role || '').toLowerCase();
        return (nameNeedle && contactName.includes(nameNeedle)) || (roleNeedle && contactRole.includes(roleNeedle));
    }) || null;
}
function callPhone(phone) {
    if (!phone)
        return;
    var normalized = String(phone).replace(/[^\d+]/g, '');
    window.location.href = 'tel:' + normalized;
}
/* ---------- DISPLAY PARAMETERS ---------- */
function normalizeConnectionType(type) {
    return String(type || '').trim().toUpperCase() === 'RBD' ? 'RBD' : 'DTMF';
}
function getTimingLabel() {
    return APP.connectionType === 'RBD' ? '20-я и 35-я минута часа' : '10-я и 40-я минута часа';
}
function getTolerance() {
    return String(APP.connectionData.tolerance || '±3 минуты');
}
function getAdMaxSeconds() {
    var value = Number(APP.settings.ad_max_duration_seconds || 180);
    return Number.isFinite(value) && value > 0 ? value : 180;
}
function isOnAir() {
    var status = String((APP.launchStatus && APP.launchStatus.launch_status) || (APP.launch && APP.launch.launch_status) || '').trim().toLowerCase();
    return status === 'в эфире';
}
/* ---------- DATES ---------- */
function normalizeDateForInput(value) {
    var text = String(value || '').trim();
    var match = text.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : '';
}
function formatDateRu(value) {
    var normalized = normalizeDateForInput(value);
    if (!normalized)
        return '';
    var parts = normalized.split('-');
    var months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    var year = Number(parts[0]);
    var month = Number(parts[1]);
    var day = Number(parts[2]);
    if (!year || month < 1 || month > 12 || !day)
        return normalized;
    return day + ' ' + months[month - 1] + ' ' + year;
}
/* ---------- COPY ---------- */
function copyText(text) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!text)
                return [2 /*return*/, false];
            return [2 /*return*/, copyTextSilent(text)];
        });
    });
}
function copyTextSilent(text) {
    return __awaiter(this, void 0, void 0, function () {
        var _1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!text)
                        return [2 /*return*/, false];
                    if (!(navigator.clipboard && window.isSecureContext)) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.clipboard.writeText(text)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3:
                    _1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, fallbackCopy(text)];
            }
        });
    });
}
function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    var success = false;
    try {
        success = document.execCommand('copy');
    }
    catch (_) {
        success = false;
    }
    textarea.remove();
    return success;
}
function setInlineStatus(id, message, error) {
    if (!id)
        return;
    var el = document.getElementById(id);
    if (!el)
        return;
    el.textContent = message || '';
    el.classList.toggle('is-error', !!error);
    if (message && !error) {
        setTimeout(function () {
            if (el.textContent === message)
                el.textContent = '';
        }, 2200);
    }
}
/* ---------- UI HELPERS ---------- */
function showScreen(id) {
    closeMobileMenu();
    document.querySelectorAll('.screen').forEach(function (screen) { screen.classList.remove('is-active'); });
    var target = document.getElementById(id);
    if (target)
        target.classList.add('is-active');
    window.scrollTo(0, 0);
    if (id !== 'loadingScreen')
        notifyPortalShellReady(id);
}
function setButtonLoading(button, loading, text) {
    if (!button)
        return;
    button.disabled = loading;
    button.textContent = text;
}
function showLoginError(message) {
    var el = document.getElementById('loginError');
    el.textContent = message || '';
    el.classList.remove('hidden');
}
function hideLoginError() {
    document.getElementById('loginError').classList.add('hidden');
}
function normalizeArray(value) { return Array.isArray(value) ? value : []; }
function normalizeObject(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
function userStorageKey(name) {
    var userId = APP.user ? APP.user.user_id : 'anonymous';
    return ['ccr', userId, name].join(':');
}
function launchStorageKey(launchId, name) {
    var userId = APP.user ? APP.user.user_id : 'anonymous';
    return ['ccr', userId, launchId, name].join(':');
}
function escapeHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
function escapeAttribute(value) { return escapeHtml(value); }

/* ---------- POST-LOGIN NOTICES ---------- */
function maybeShowPostLoginNotices() {
    // Установка PWA будет управляться отдельной GitHub-оболочкой.
    // Внутри портала не показываем поверх рабочего экрана дополнительные баннеры.
    return;
}

function showUpdateBanner() {
    try {
        if (localStorage.getItem(APP_VERSION_STORAGE_KEY) === APP_VERSION) {
            return false;
        }

        var existing = document.getElementById('appUpdateBanner');
        if (existing) {
            return true;
        }

        var banner = document.createElement('aside');
        banner.id = 'appUpdateBanner';
        banner.className = 'app-update-banner';
        banner.setAttribute('role', 'status');
        banner.setAttribute('aria-live', 'polite');
        banner.innerHTML =
            '<div class="app-update-kicker">Обновление портала</div>' +
            '<div class="app-update-title">Мы обновили портал запуска</div>' +
            '<div class="app-update-copy">Теперь вам доступны:</div>' +
            '<ul class="app-update-list">' +
              '<li>новый пошаговый путь подготовки станции;</li>' +
              '<li>более заметная навигация по этапам;</li>' +
              '<li>материалы станции в одном месте.</li>' +
            '</ul>' +
            '<div class="app-update-note">Перезагрузите страницу, чтобы использовать актуальную версию.</div>' +
            '<div class="app-update-actions">' +
              '<button id="appUpdateReload" class="button button-primary" type="button">Обновить</button>' +
              '<button id="appUpdateLater" class="button button-secondary" type="button">Позже</button>' +
            '</div>';

        document.body.appendChild(banner);

        var reloadButton = document.getElementById('appUpdateReload');
        var laterButton = document.getElementById('appUpdateLater');

        if (reloadButton) {
            reloadButton.addEventListener('click', function () {
                localStorage.setItem(APP_VERSION_STORAGE_KEY, APP_VERSION);
                window.location.reload();
            });
        }

        if (laterButton) {
            laterButton.addEventListener('click', function () {
                localStorage.setItem(APP_VERSION_STORAGE_KEY, APP_VERSION);
                banner.remove();
                setTimeout(showMobileInstallHint, 350);
            });
        }

        return true;
    }
    catch (error) {
        console.warn('Update banner unavailable', error);
        return false;
    }
}

function showMobileInstallHint() {
    try {
        var mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        var standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
            window.navigator.standalone === true;

        if (!mobile || standalone) {
            return;
        }

        if (localStorage.getItem(INSTALL_HINT_STORAGE_KEY)) {
            return;
        }

        if (document.getElementById('mobileInstallHint')) {
            return;
        }

        var box = document.createElement('aside');
        box.id = 'mobileInstallHint';
        box.className = 'mobile-install-hint';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-modal', 'false');
        box.setAttribute('aria-labelledby', 'mobileInstallTitle');
        box.innerHTML =
            '<div id="mobileInstallTitle" class="mobile-install-title">Добавьте Радио Шоколад на главный экран</div>' +
            '<div class="mobile-install-copy">Портал запуска будет всегда под рукой — почти как приложение.</div>' +
            '<div class="mobile-install-instructions">' +
              '<div><strong>Android</strong><span>Нажмите ⋮ → «Добавить на главный экран»</span></div>' +
              '<div><strong>iPhone</strong><span>Нажмите «Поделиться» → «На экран “Домой”»</span></div>' +
            '</div>' +
            '<div class="mobile-install-actions">' +
              '<button class="button button-primary" id="installHintOk" type="button">Понятно</button>' +
              '<button class="button button-secondary" id="installHintLater" type="button">Не сейчас</button>' +
            '</div>';

        document.body.appendChild(box);

        function closeInstallHint() {
            localStorage.setItem(INSTALL_HINT_STORAGE_KEY, '1');
            box.remove();
        }

        var okButton = document.getElementById('installHintOk');
        var laterButton = document.getElementById('installHintLater');

        if (okButton) {
            okButton.addEventListener('click', closeInstallHint);
        }
        if (laterButton) {
            laterButton.addEventListener('click', closeInstallHint);
        }
    }
    catch (error) {
        console.warn('Install hint unavailable', error);
    }
}


/* ---------- MOBILE PORTAL MENU / FUTURE PWA BRIDGE ---------- */
var MOBILE_PAGE_LABELS = {
    home: 'Главная',
    air: 'Подключение эфира',
    brand: 'Материалы станции',
    ads: 'Реклама',
    launch: 'Дата и контакты запуска',
    checklist: 'Финальная проверка'
};

function updateMobileMenuButtonLabel() {
    var button = document.getElementById('mobileMenuButton');
    if (!button)
        return;
    var label = MOBILE_PAGE_LABELS[APP.currentPage] || MOBILE_PAGE_LABELS.home;
    button.textContent = 'Раздел: ' + label;
    button.setAttribute('aria-label', 'Текущий раздел: ' + label + '. Открыть список разделов');
}

function openMobileMenu() {
    var menu = document.getElementById('mobileMenu');
    var button = document.getElementById('mobileMenuButton');
    if (!menu || !button)
        return;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
}

function closeMobileMenu() {
    var menu = document.getElementById('mobileMenu');
    var button = document.getElementById('mobileMenuButton');
    if (!menu || !button)
        return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
}

function bindMobilePortalMenu() {
    var button = document.getElementById('mobileMenuButton');
    var menu = document.getElementById('mobileMenu');
    var overlay = document.getElementById('mobileMenuOverlay');
    var close = document.getElementById('mobileMenuClose');
    var stationBar = document.getElementById('mobileStationBar');

    if (!button || !menu)
        return;

    /* Перестраиваем только мобильную навигацию:
       логотип -> станция -> переключатель раздела -> список -> контент. */
    if (stationBar) {
        stationBar.insertAdjacentElement('afterend', button);
        button.insertAdjacentElement('afterend', menu);
    }

    if (overlay) {
        overlay.hidden = true;
        overlay.classList.remove('is-open');
    }

    if (close) {
        close.hidden = true;
    }

    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
    updateMobileMenuButtonLabel();

    button.addEventListener('click', function () {
        if (button.getAttribute('aria-expanded') === 'true') {
            closeMobileMenu();
        }
        else {
            openMobileMenu();
        }
    });

    menu.addEventListener('click', function (event) {
        var page = event.target.closest('[data-mobile-page]');
        if (!page)
            return;
        navigate(page.dataset.mobilePage);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape')
            closeMobileMenu();
    });
}

function notifyPortalShellReady(screenId) {
    try {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'radio-chocolate-portal-ready',
                screen: String(screenId || '')
            }, '*');
        }
    }
    catch (error) {
        console.warn('PWA shell notification unavailable', error);
    }
}
document.addEventListener('DOMContentLoaded', bindMobilePortalMenu);

/* ---------- PWA ---------- */
function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register('./sw.js', { scope: './' })
            .then(function (registration) {
                registration.update().catch(function () {});
            })
            .catch(function (error) {
                console.warn('Service worker registration failed', error);
            });
    });
}

registerServiceWorker();

