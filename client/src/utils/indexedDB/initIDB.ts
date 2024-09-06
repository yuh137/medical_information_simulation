export default function initIDB(): Promise<boolean> {
    return new Promise((resolve) => {
        const request = window.indexedDB.open("MIS_database", 1); // Ensure version is correct
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (db.objectStoreNames.contains("qc_store")) {
                db.deleteObjectStore("qc_store");
            }
            const qcStore = db.createObjectStore("qc_store", { keyPath: ["fileName", "lotNumber", "closedDate"] });
        };
  
        request.onerror = () => {
            console.error("Database initialization failed", request.error);
            resolve(false);
        };

        request.onsuccess = () => {
            console.log("Database successfully initialized with updated schema");
            resolve(true);
        };
    });
}

