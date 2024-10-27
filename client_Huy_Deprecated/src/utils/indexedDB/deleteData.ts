export const deleteData = (storeName: string, key: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // again open the connection
      let request = indexedDB.open('MIS_database');
  
      request.onsuccess = () => {
        console.log('request.onsuccess - deleteData', key);
        let db = request.result;
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const res = store.delete(key);
  
        // add listeners that will resolve the Promise
        res.onsuccess = () => {
          resolve(true);
        };
        res.onerror = () => {
          resolve(false);
        }
      };
    });
  };
  