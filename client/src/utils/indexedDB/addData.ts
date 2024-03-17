export default function addData<T>(storeName: string, data: T): Promise<T|string|null> {
    return new Promise(resolve => {
        const request = indexedDB.open("MIS_database");

        request.onsuccess = () => {
            console.log("IDB connected - add data");
            let db = request.result;
            const trans = db.transaction(storeName, 'readwrite');
            const store = trans.objectStore(storeName);
            store.add(data);
            resolve(data);
        }

        request.onerror = () => {
            const error = request.error?.message;
            if (error) {
                resolve(error);
            } else {
                resolve("Unknow error");
            }
        }
    });
}