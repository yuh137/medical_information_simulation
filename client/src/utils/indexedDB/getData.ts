import { Admin, QCTemplateBatch, Student } from "./IDBSchema";

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











export const getDataByCompositeKey = async (
    fileName: string, 
    lotNumber: string, 
    closedDate: string
  ): Promise<QCTemplateBatch | null> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("MIS_database", 3);
  
      request.onerror = (event: Event) => {
        console.error("Database error");
        reject((event.target as IDBOpenDBRequest)?.error);
      };
  
      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest)?.result;
        if (!db) {
          reject('No database found');
          return;
        }
  
        const transaction = db.transaction(["qc_store"], "readonly");
        const objectStore = transaction.objectStore("qc_store");
  
        // Composite key
        const key = [fileName, lotNumber, closedDate];
        const getRequest = objectStore.get(key);
  
        getRequest.onerror = (event: Event) => {
          console.error("Failed to retrieve data");
          reject((event.target as IDBRequest)?.error);
        };
  
        getRequest.onsuccess = (event: Event) => {
          resolve(getRequest.result ? getRequest.result : null);
        };
      };
    });
  };
  
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
export function getAllDataByFileName(storeName: string, fileName: string): Promise<QCTemplateBatch[]> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("MIS_database");
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const index = store.index("by_fileName");
            const getAllRequest = index.getAll(fileName);

            getAllRequest.onsuccess = () => {
                resolve(getAllRequest.result);
            };

            getAllRequest.onerror = () => {
                reject(getAllRequest.error);
            };
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}
export const getQCRangeByDetails = (
    fileName: string,
    lotNumber: string,
    closedDate: string
): Promise<QCTemplateBatch | null> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("MIS_database", 3);

        request.onerror = (event) => {
            console.error("Database error", (event.target as IDBOpenDBRequest)?.error);
            reject((event.target as IDBOpenDBRequest)?.error);
        };

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest)?.result;
            if (!db) {
                console.error("No database found");
                reject("No database found");
                return;
            }

            const transaction = db.transaction(["qc_store"], "readonly");
            const objectStore = transaction.objectStore("qc_store");

            const key = [fileName, lotNumber, closedDate];
            console.log("Attempting to fetch data with key:", key);

            const getRequest = objectStore.get(key);

            getRequest.onsuccess = () => {
                const result = getRequest.result;
                if (result) {
                    console.log("Data retrieved successfully:", result);
                    resolve(result as QCTemplateBatch);
                } else {
                    console.warn("No data found for key:", key);
                    resolve(null);
                }
            };

            getRequest.onerror = (event) => {
                console.error("Failed to retrieve data", (event.target as IDBRequest)?.error);
                reject((event.target as IDBRequest)?.error);
            };
        };
    });
};


export function saveToDB<T extends { fileName: string, lotNumber: string, closedDate: string }>(storeName: string, data: T): Promise<void> {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("MIS_database", 3);
        request.onsuccess = () => {
            const db = request.result;
            const trans = db.transaction(storeName, "readwrite");
            const store = trans.objectStore(storeName);
            const saveRequest = store.put(data);

            saveRequest.onsuccess = () => {
                console.log("Data saved successfully");
                resolve();
            };

            saveRequest.onerror = () => {
                console.error("Error saving data", saveRequest.error);
                reject(saveRequest.error);
            };
        };

        request.onerror = () => {
            console.error("Error opening database", request.error);
            reject(request.error);
        };
    });
}
