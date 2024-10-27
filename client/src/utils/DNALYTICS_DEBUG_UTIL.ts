interface MolecularQCPanel {
	fileName: string;
}

let uniqueID = 0

function getNextID(): number {
	return ++uniqueID;
}

export async function DEBUG_add_molecular_data_to_idb(QCPanels: string[]): Promise<void> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open("MIS_database");
		request.onsuccess = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			const transaction = db.transaction("qc_store", "readwrite");
			const objectStore = transaction.objectStore("qc_store");
			const items = QCPanels.map((item) => { return { fileName: item, lotNumber: getNextID(), closedDate: getNextID() }})

			let completedRequests = 0;
            items.forEach((item) => {
                const getRequest = objectStore.get([item.fileName, item.lotNumber, item.closedDate]);
				getRequest.onsuccess = (event) => {
                    if ((event.target as IDBOpenDBRequest).result) {
                        completedRequests++;
                    }
                    else {
                        const addRequest = objectStore.add(item);
                        addRequest.onsuccess = () => {
                            completedRequests++;
                        }
                        addRequest.onerror = () => {
                            console.log("Error adding data", addRequest.error);
                            reject(addRequest.error);
                        }
                    }
                    if (completedRequests === items.length) {
                        resolve();
                    }
				};

				getRequest.onerror = (error) => {
					console.log("Error checking data", getRequest.error);
					reject(getRequest.error);
				};
			});

			transaction.oncomplete = () => {
				db.close()
			};

		};

		request.onerror = () => {
			console.error("Error opening database", request.error);
			reject(request.error);
		};
	});
}
