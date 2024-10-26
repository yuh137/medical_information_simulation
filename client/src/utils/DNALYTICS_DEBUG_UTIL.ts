interface MolecularQCPanel {
	fileName: string;
}

export async function DEBUG_add_molecular_data_to_idb(QCPanels: string[]): Promise<void> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open("MIS_database");
		request.onsuccess = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			const transaction = db.transaction("qc_store", "readwrite");
			const objectStore = transaction.objectStore("qc_store");
			const addRequest = objectStore.add(QCPanels.map((item) => { return { fileName: item }}));
			addRequest.onsuccess = () => {
				console.log("Added idb data");
				resolve();
			};

			addRequest.onerror = () => {
				console.log("Error adding data", addRequest.error);
				reject(addRequest.error);
			};

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
