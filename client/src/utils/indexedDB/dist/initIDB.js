"use strict";
exports.__esModule = true;
function initIDB() {
    return new Promise(function (resolve) {
        var request = window.indexedDB.open("MIS_database", 1); // Ensure version is correct
        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            if (db.objectStoreNames.contains("qc_store")) {
                db.deleteObjectStore("qc_store");
            }
            var qcStore = db.createObjectStore("qc_store", { keyPath: ["fileName", "lotNumber", "closedDate"] });
        };
        request.onerror = function () {
            console.error("Database initialization failed", request.error);
            resolve(false);
        };
        request.onsuccess = function () {
            console.log("Database successfully initialized with updated schema");
            resolve(true);
        };
    });
}
exports["default"] = initIDB;
