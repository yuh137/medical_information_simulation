import { Admin, Student } from "./IDBSchema";

export function getAllDataFromStore<T>(storeName: string): Promise<T[] | string | null> {
    return new Promise((resolve) => {
        let request = indexedDB.open("MIS_database");

        request.onsuccess = () => {
            console.log('Request success - getAllData');
            let db = request.result;
            const trans = db.transaction(storeName, 'readonly');
            const store = trans.objectStore(storeName);
            const res = store.getAll();

            res.onsuccess = () => {
                resolve(res.result);
            }

            res.onerror = () => {
                const error = res.error?.message;
                console.log('Request error - cannot get data');
                if (error) {
                    resolve(error);
                } else {
                    resolve("Unknow error");
                }
            }
        }

        request.onerror = () => {
            const error = request.error?.message;
            console.log('Request error - getAllData');
            if (error) {
                resolve(error);
            } else {
                resolve("Unknow error");
            }
        }
    })
}

export function getDataByKey<T>(storeName: string, id: string): Promise<T | string | null> {
    return new Promise((resolve) => {
        let request = indexedDB.open("MIS_database");

        request.onsuccess = () => {
            console.log("Request success - getDataByID");
            const db = request.result;
            const trans = db.transaction(storeName, 'readonly');
            const store = trans.objectStore(storeName);
            const res = store.get(id);

            res.onsuccess = () => {
                console.log("Request success - data retrieved");
                if (res.result === undefined) resolve(null);
                resolve(res.result);
            }

            res.onerror = () => {
                const error = res.error?.message;
                console.log('Request error - cannot get data');
                if (error) {
                    resolve(error);
                } else {
                    resolve("Unknow error");
                }
            }
        }

        request.onerror = () => {
            const error = request.error?.message;
            console.log('Request error - cannot get data');
            if (error) {
                resolve(error);
            } else {
                resolve("Unknow error");
            }
        }
    });
}

export function getAdminByName(name: string): Promise<Admin | null> {
    return new Promise((resolve) => {
        let request = indexedDB.open("MIS_database");

        request.onsuccess = () => {
            console.log("Request success - getAdminByName");
            const db = request.result;
            const trans = db.transaction("admins", "readonly");
            const store = trans.objectStore("admins");
            const res = store.get(name);

            res.onsuccess = () => {
                console.log("getAdminByName success");
                if (res.result === undefined) {
                    resolve(null);
                }
                resolve(res.result);
            }

            res.onerror = () => {
                const error = res.error?.message;
                console.log("getAdminByName - error");
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
}

export function getStudentByName(name: string): Promise<Student | null> {
    return new Promise((resolve) => {
        let request = indexedDB.open("MIS_database");

        request.onsuccess = () => {
            console.log("Request success - getStudentByName");
            const db = request.result;
            const trans = db.transaction("students", "readonly");
            const store = trans.objectStore("students");
            const res = store.get(name);

            res.onsuccess = () => {
                console.log("getStudentByName success");
                resolve(res.result);
            }

            res.onerror = () => {
                const error = res.error?.message;
                console.log("getStudentByName - error");
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
}