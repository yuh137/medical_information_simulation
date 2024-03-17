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

export function getDataByID<T>(storeName: string, id: string): Promise<T | string | null> {
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