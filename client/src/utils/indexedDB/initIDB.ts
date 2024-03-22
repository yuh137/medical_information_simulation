export default function initIDB(): Promise<boolean> {
    return new Promise((resolve) => {
        const request = window.indexedDB.open("MIS_database", 1);
        
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
            
            const adminStore = db.createObjectStore("admins", { keyPath: "name" });
            const usersStore = db.createObjectStore("students", { keyPath: "name" });
            const QCStore = db.createObjectStore("qc_store", { keyPath: "analyteName" });
        }

        request.onerror = () => {
            console.log("Database init failed");
            resolve(false);
        }
    
        request.onsuccess = () => {
            console.log("Database successfully opened");
            resolve(true);
        }
    })
}

