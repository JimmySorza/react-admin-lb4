"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var _a = [
    'GET_LIST',
    'CREATE',
    'UPDATE',
    'UPDATE_MANY',
    'DELETE',
    'DELETE_MANY',
    'GET_MANY_REFERENCE',
    'GET_ONE',
], GET_LIST = _a[0], CREATE = _a[1], UPDATE = _a[2], UPDATE_MANY = _a[3], DELETE = _a[4], DELETE_MANY = _a[5], GET_MANY_REFERENCE = _a[6], GET_ONE = _a[7];
var lb4Provider = function (apiUrl, headers, idParamApi, idParamAdmin, ftch) {
    if (headers === void 0) { headers = function () { return undefined; }; }
    if (idParamApi === void 0) { idParamApi = '_id'; }
    if (idParamAdmin === void 0) { idParamAdmin = 'id'; }
    if (ftch === void 0) { ftch = fetch; }
    var getOptions = function (type, body) { return __awaiter(_this, void 0, void 0, function () {
        var options, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = {};
                    _b = [{ Accept: 'application/json' }];
                    return [4 /*yield*/, headers()];
                case 1:
                    options = (_a.headers = __assign.apply(void 0, _b.concat([(_c.sent())])),
                        _a.body = body,
                        _a.method = '',
                        _a);
                    if (body) {
                        options.body = JSON.stringify(_.omit(body, [idParamApi, idParamAdmin]));
                        options.headers['Content-Type'] = 'application/json';
                    }
                    switch (type) {
                        case CREATE:
                            options.method = 'POST';
                            break;
                        case UPDATE:
                        case UPDATE_MANY:
                            options.method = 'PATCH';
                            break;
                        case DELETE:
                        case DELETE_MANY:
                            options.method = 'DELETE';
                            break;
                        default:
                            options.method = 'GET';
                    }
                    return [2 /*return*/, options];
            }
        });
    }); };
    var setWhere = function (url, filter, initKey) {
        if (initKey === void 0) { initKey = 'filter[where]'; }
        var search = url.searchParams;
        var fnWhere = function (anyWhere, key) {
            if (key === void 0) { key = initKey; }
            if (Array.isArray(anyWhere)) {
                anyWhere.forEach(function (item) {
                    search.append(key, item);
                });
                return;
            }
            if (anyWhere instanceof Object) {
                Object.keys(anyWhere).forEach(function (p) {
                    fnWhere(anyWhere[p], key + "[" + (p === idParamAdmin ? idParamApi : p) + "]");
                });
                return;
            }
            search.append(key, anyWhere);
        };
        fnWhere(filter);
    };
    var fetchTotal = function (resource, filter) { return __awaiter(_this, void 0, void 0, function () {
        var url, path, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    url = new URL(apiUrl);
                    path = url.pathname.split('/');
                    path.push(resource, 'count');
                    if (filter && Object.keys(filter).length > 0) {
                        setWhere(url, filter, 'where');
                    }
                    url.pathname = path.filter(Boolean).join('/');
                    _a = ftch;
                    _b = [url.toString()];
                    return [4 /*yield*/, getOptions(null, null)];
                case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                case 2: return [4 /*yield*/, (_c.sent()).json()];
                case 3: return [2 /*return*/, (_c.sent()).count];
            }
        });
    }); };
    var setLimitAndOffset = function (url, _a) {
        var _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.perPage, perPage = _c === void 0 ? 10 : _c;
        var search = url.searchParams;
        search.append('filter[limit]', "" + perPage);
        search.append('filter[offset]', "" + (page - 1) * perPage);
    };
    var setOrder = function (url, _a) {
        var _b = _a.field, field = _b === void 0 ? 'createdAt' : _b, _c = _a.order, order = _c === void 0 ? 'DESC' : _c;
        var search = url.searchParams;
        search.append('filter[order]', field + " " + order);
    };
    var mapKeys = function (obj) {
        return _.mapKeys(obj, function (value, key) {
            if (key === idParamApi) {
                return idParamAdmin;
            }
            return key;
        });
    };
    var fn = function (type, resource, 
    // @ts-ignore
    _a) {
        var pagination = _a.pagination, sort = _a.sort, _b = _a.filter, filter = _b === void 0 ? {} : _b, data = _a.data, ids = _a.ids, id = _a.id, target = _a.target;
        return __awaiter(_this, void 0, void 0, function () {
            var total, totalFilter, url, path, r_1, options, item, response, e_1, result;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        total = null;
                        if (!([GET_LIST, GET_MANY_REFERENCE].indexOf(type) > -1)) return [3 /*break*/, 2];
                        totalFilter = JSON.parse(JSON.stringify(filter));
                        if (id) {
                            totalFilter[target || idParamApi] = id;
                        }
                        return [4 /*yield*/, fetchTotal(resource, totalFilter)];
                    case 1:
                        total = _c.sent();
                        _c.label = 2;
                    case 2:
                        url = new URL(apiUrl);
                        path = url.pathname.split('/');
                        path.push(resource);
                        if (id && !target) {
                            path.push(id);
                        }
                        if (id && target) {
                            // @ts-ignore
                            // eslint-disable-next-line no-param-reassign
                            filter[target] = id;
                        }
                        if (ids) {
                            if (type === DELETE_MANY) {
                                r_1 = [];
                                ids.forEach(function (idDelete) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a, _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                // @ts-ignore
                                                _b = (_a = r_1).push;
                                                return [4 /*yield*/, fn(DELETE, resource, { idDelete: idDelete })];
                                            case 1:
                                                // @ts-ignore
                                                _b.apply(_a, [(_c.sent()).data]);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                return [2 /*return*/, { data: r_1.map(function (el) { return el[idParamAdmin]; }) }];
                            }
                            _.set(filter, idParamApi + ".inq", ids);
                        }
                        if (filter && Object.keys(filter).length > 0) {
                            if ([UPDATE_MANY].indexOf(type) > -1) {
                                setWhere(url, filter, 'where');
                            }
                            else {
                                setWhere(url, filter);
                            }
                        }
                        if (pagination) {
                            setLimitAndOffset(url, pagination);
                        }
                        if (sort) {
                            setOrder(url, sort);
                        }
                        return [4 /*yield*/, getOptions(type, data)];
                    case 3:
                        options = _c.sent();
                        if (!([DELETE].indexOf(type) > -1)) return [3 /*break*/, 5];
                        return [4 /*yield*/, fn(GET_ONE, resource, { id: id })];
                    case 4:
                        // @ts-ignore
                        item = _c.sent();
                        _c.label = 5;
                    case 5:
                        url.pathname = path.filter(Boolean).join('/');
                        return [4 /*yield*/, ftch(url.toString(), options)];
                    case 6:
                        response = _c.sent();
                        _c.label = 7;
                    case 7:
                        _c.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, response.json()];
                    case 8:
                        response = _c.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        e_1 = _c.sent();
                        if ([DELETE].indexOf(type) === -1) {
                            if (id) {
                                // @ts-ignore
                                return [2 /*return*/, fn(GET_ONE, resource, { id: id })];
                            }
                            throw e_1;
                        }
                        return [3 /*break*/, 10];
                    case 10:
                        // @ts-ignore
                        if (response.error) {
                            // @ts-ignore
                            throw new Error(response.error.message);
                        }
                        result = {
                            data: data,
                            total: total,
                        };
                        if ([UPDATE_MANY, DELETE_MANY].indexOf(type) > -1) {
                            result.data = ids;
                        }
                        else if ([DELETE].indexOf(type) > -1) {
                            result = item;
                        }
                        else {
                            result.data = Array.isArray(response)
                                ? response.map(mapKeys)
                                : mapKeys(response);
                        }
                        if (typeof total === 'number') {
                            result.total = total;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return fn;
};
exports.default = lb4Provider;
//# sourceMappingURL=index.js.map