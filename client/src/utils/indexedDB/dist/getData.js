"use strict";
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
exports.__esModule = true;
exports.saveToDB = exports.getQCRangeByDetails = exports.getAllDataByFileName = exports.getStudentByName = exports.getAdminByName = exports.getDataByKey = exports.getDataByCompositeKey = exports.getAllDataFromStore = void 0;
function getAllDataFromStore(storeName) {
    return new Promise(function (resolve) {
        var request = indexedDB.open("MIS_database");
        request.onsuccess = function () {
            console.log('Request success - getAllData');
            var db = request.result;
            var trans = db.transaction(storeName, 'readonly');
            var store = trans.objectStore(storeName);
            var res = store.getAll();
            res.onsuccess = function () {
                resolve(res.result);
            };
            res.onerror = function () {
                var _a;
                var error = (_a = res.error) === null || _a === void 0 ? void 0 : _a.message;
                console.log('Request error - cannot get data');
                if (error) {
                    resolve(error);
                }
                else {
                    resolve("Unknow error");
                }
            };
        };
        request.onerror = function () {
            var _a;
            var error = (_a = request.error) === null || _a === void 0 ? void 0 : _a.message;
            console.log('Request error - getAllData');
            if (error) {
                resolve(error);
            }
            else {
                resolve("Unknow error");
            }
        };
    });
}
exports.getAllDataFromStore = getAllDataFromStore;
exports.getDataByCompositeKey = function (fileName, lotNumber, closedDate) { return __awaiter(void 0, void 0, Promise, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var request = indexedDB.open("MIS_database", 3);
                request.onerror = function (event) {
                    var _a;
                    console.error("Database error");
                    reject((_a = event.target) === null || _a === void 0 ? void 0 : _a.error);
                };
                request.onsuccess = function (event) {
                    var _a;
                    var db = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                    if (!db) {
                        reject('No database found');
                        return;
                    }
                    var transaction = db.transaction(["qc_store"], "readonly");
                    var objectStore = transaction.objectStore("qc_store");
                    // Composite key
                    var key = [fileName, lotNumber, closedDate];
                    var getRequest = objectStore.get(key);
                    getRequest.onerror = function (event) {
                        var _a;
                        console.error("Failed to retrieve data");
                        reject((_a = event.target) === null || _a === void 0 ? void 0 : _a.error);
                    };
                    getRequest.onsuccess = function (event) {
                        resolve(getRequest.result ? getRequest.result : null);
                    };
                };
            })];
    });
}); };
function getDataByKey(storeName, id) {
    return new Promise(function (resolve) {
        var request = indexedDB.open("MIS_database");
        request.onsuccess = function () {
            console.log("Request success - getDataByID");
            var db = request.result;
            var trans = db.transaction(storeName, 'readonly');
            var store = trans.objectStore(storeName);
            var res = store.get(id);
            res.onsuccess = function () {
                console.log("Request success - data retrieved");
                if (res.result === undefined)
                    resolve(null);
                resolve(res.result);
            };
            res.onerror = function () {
                var _a;
                var error = (_a = res.error) === null || _a === void 0 ? void 0 : _a.message;
                console.log('Request error - cannot get data');
                if (error) {
                    resolve(error);
                }
                else {
                    resolve("Unknow error");
                }
            };
        };
        request.onerror = function () {
            var _a;
            var error = (_a = request.error) === null || _a === void 0 ? void 0 : _a.message;
            console.log('Request error - cannot get data');
            if (error) {
                resolve(error);
            }
            else {
                resolve("Unknow error");
            }
        };
    });
}
exports.getDataByKey = getDataByKey;
function getAdminByName(name) {
    return new Promise(function (resolve) {
        var request = indexedDB.open("MIS_database");
        request.onsuccess = function () {
            console.log("Request success - getAdminByName");
            var db = request.result;
            var trans = db.transaction("admins", "readonly");
            var store = trans.objectStore("admins");
            var res = store.get(name);
            res.onsuccess = function () {
                console.log("getAdminByName success");
                if (res.result === undefined) {
                    resolve(null);
                }
                resolve(res.result);
            };
            res.onerror = function () {
                var _a;
                var error = (_a = res.error) === null || _a === void 0 ? void 0 : _a.message;
                console.log("getAdminByName - error");
                if (error) {
                    console.log(error);
                    resolve(null);
                }
                else {
                    console.log("Data does not exist");
                    resolve(null);
                }
            };
        };
    });
}
exports.getAdminByName = getAdminByName;
function getStudentByName(name) {
    return new Promise(function (resolve) {
        var request = indexedDB.open("MIS_database");
        request.onsuccess = function () {
            console.log("Request success - getStudentByName");
            var db = request.result;
            var trans = db.transaction("students", "readonly");
            var store = trans.objectStore("students");
            var res = store.get(name);
            res.onsuccess = function () {
                console.log("getStudentByName success");
                resolve(res.result);
            };
            res.onerror = function () {
                var _a;
                var error = (_a = res.error) === null || _a === void 0 ? void 0 : _a.message;
                console.log("getStudentByName - error");
                if (error) {
                    console.log(error);
                    resolve(null);
                }
                else {
                    console.log("Data does not exist");
                    resolve(null);
                }
            };
        };
    });
}
exports.getStudentByName = getStudentByName;
/*export function getQCRangeByName(name: string): Promise<QCTemplateBatch | null> {
    return new Promise((resolve) => {
        let request = indexedDB.open("MIS_database");

        request.onsuccess = () => {
            console.log("Request success - getQCRangeByName");
            const db = request.result;
            const trans = db.transaction("qc_store", "readonly");
            const store = trans.objectStore("qc_store");
            const res = store.get(name);

            res.onsuccess = () => {
                console.log("getQCRangeByName success");
                resolve(res.result);
            }

            res.onerror = () => {
                const error = res.error?.message;
                console.log("getQCRangeByName - error");
                if (error) {
                    console.log(error);
                    resolve(null);
                } else {
                    console.log("Data does not exist");
                    resolve(null);
                }
            }
        }
    })
}*/
function getAllDataByFileName(storeName, fileName) {
    return new Promise(function (resolve, reject) {
        var request = indexedDB.open("MIS_database");
        request.onsuccess = function () {
            var db = request.result;
            var transaction = db.transaction(storeName, "readonly");
            var store = transaction.objectStore(storeName);
            var index = store.index("by_fileName");
            var getAllRequest = index.getAll(fileName);
            getAllRequest.onsuccess = function () {
                resolve(getAllRequest.result);
            };
            getAllRequest.onerror = function () {
                reject(getAllRequest.error);
            };
        };
        request.onerror = function () {
            reject(request.error);
        };
    });
}
exports.getAllDataByFileName = getAllDataByFileName;
exports.getQCRangeByDetails = function (fileName, lotNumber, closedDate) {
    return new Promise(function (resolve, reject) {
        var request = indexedDB.open("MIS_database", 3);
        request.onerror = function (event) {
            var _a, _b;
            console.error("Database error", (_a = event.target) === null || _a === void 0 ? void 0 : _a.error);
            reject((_b = event.target) === null || _b === void 0 ? void 0 : _b.error);
        };
        request.onsuccess = function (event) {
            var _a;
            var db = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
            if (!db) {
                console.error("No database found");
                reject("No database found");
                return;
            }
            var transaction = db.transaction(["qc_store"], "readonly");
            var objectStore = transaction.objectStore("qc_store");
            var key = [fileName, lotNumber, closedDate];
            console.log("Attempting to fetch data with key:", key);
            var getRequest = objectStore.get(key);
            getRequest.onsuccess = function () {
                var result = getRequest.result;
                if (result) {
                    console.log("Data retrieved successfully:", result);
                    resolve(result);
                }
                else {
                    console.warn("No data found for key:", key);
                    resolve(null);
                }
            };
            getRequest.onerror = function (event) {
                var _a, _b;
                console.error("Failed to retrieve data", (_a = event.target) === null || _a === void 0 ? void 0 : _a.error);
                reject((_b = event.target) === null || _b === void 0 ? void 0 : _b.error);
            };
        };
    });
};
function saveToDB(storeName, data) {
    return new Promise(function (resolve, reject) {
        var request = indexedDB.open("MIS_database", 3);
        request.onsuccess = function () {
            var db = request.result;
            var trans = db.transaction(storeName, "readwrite");
            var store = trans.objectStore(storeName);
            var saveRequest = store.put(data);
            saveRequest.onsuccess = function () {
                console.log("Data saved successfully");
                resolve();
            };
            saveRequest.onerror = function () {
                console.error("Error saving data", saveRequest.error);
                reject(saveRequest.error);
            };
        };
        request.onerror = function () {
            console.error("Error opening database", request.error);
            reject(request.error);
        };
    });
}
exports.saveToDB = saveToDB;
