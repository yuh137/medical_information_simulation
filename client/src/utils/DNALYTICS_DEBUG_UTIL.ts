import { MolecularQCTemplateBatchAnalyte, ReportType, QualitativeMolecularQCTemplateBatchAnalyte, QualitativeViralLoadRangeMolecularQCTemplateBatchAnalyte } from "./indexedDB/IDBSchema";

const panelToAnalytesTable = new Map<string, QualitativeMolecularQCTemplateBatchAnalyte[] | QualitativeViralLoadRangeMolecularQCTemplateBatchAnalyte[]>();
panelToAnalytesTable.set('GI Panel Level I', [{ reportType: ReportType.Qualitative, analyteName: "Campylobacter species (Campylobacter jejuni/Campylobacter coli/Campylobacter upsaliensis)", analyteAcronym: "Campy sp", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Clostridioides difficile toxin A/B", analyteAcronym: "C. diff A/B", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Plesiomonas shigelloides", analyteAcronym: "P. shig", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Salmonella species", analyteAcronym: "Salmo sp", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Vibrio species (Vibrio parahaemolyticus, Vibrio vulnificus, Vibrio cholerae)", analyteAcronym: "Vib sp", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Vibrio cholerae", analyteAcronym: "V. cholerae", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Yersinia species", analyteAcronym: "Yersinia sp", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Enteroaggregative Escherichia coli (EAEC)", analyteAcronym: "EAEC", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Enteropathogenic E coli (EPEC)", analyteAcronym: "EPEC", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Enterotoxigenic E coli (ETEC)", analyteAcronym: "ETEC", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Shiga-like toxin producing E. coli (STEC)", analyteAcronym: "STEC", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "E coli O157", analyteAcronym: "E coli O157", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Shigella/Enteroinvasive E coli (EIEC)", analyteAcronym: "EIEC", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Cryptosporidium species", analyteAcronym: "Crypto sp", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Cyclospora cayetanensis", analyteAcronym: "C. cayetanensis", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Entamoeba histolytica", analyteAcronym: "E. histolytica", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Giardia lambia", analyteAcronym: "Giardia", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Adenovirus F 40/41", analyteAcronym: "Adenovirus", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Astrovirus", analyteAcronym: "Astrovirus", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Norovirus GI/GII", analyteAcronym: "Norovirus", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Rotavirus A", analyteAcronym: "Rotavirus A", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Sapovirus", analyteAcronym: "Sapovirus", expectedRange: "Not Detected" }]);
panelToAnalytesTable.set('GI Panel Level II', [{ reportType: ReportType.Qualitative, analyteName: "Campylobacter species (Campylobacter jejuni/Campylobacter coli/Campylobacter upsaliensis)", analyteAcronym: "Campy sp", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Clostridioides difficile toxin A/B", analyteAcronym: "C. diff A/B", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Plesiomonas shigelloides", analyteAcronym: "P. shig", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Salmonella species", analyteAcronym: "Salmo sp", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Vibrio species (Vibrio parahaemolyticus, Vibrio vulnificus, Vibrio cholerae)", analyteAcronym: "Vib sp", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Vibrio cholerae", analyteAcronym: "V. cholerae", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Yersinia species", analyteAcronym: "Yersinia sp", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Enteroaggregative Escherichia coli (EAEC)", analyteAcronym: "EAEC", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Enteropathogenic E coli (EPEC)", analyteAcronym: "EPEC", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Enterotoxigenic E coli (ETEC)", analyteAcronym: "ETEC", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Shiga-like toxin producing E. coli (STEC)", analyteAcronym: "STEC", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "E coli O157", analyteAcronym: "E coli O157", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Shigella/Enteroinvasive E coli (EIEC)", analyteAcronym: "EIEC", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Cryptosporidium species", analyteAcronym: "Crypto sp", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Cyclospora cayetanensis", analyteAcronym: "C. cayetanensis", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Entamoeba histolytica", analyteAcronym: "E. histolytica", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Giardia lambia", analyteAcronym: "Giargia", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Adenovirus F 40/41", analyteAcronym: "Adenovirus", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Astrovirus", analyteAcronym: "Astrovirus", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Norovirus GI/GII", analyteAcronym: "Norovirus", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Rotavirus A", analyteAcronym: "Rotavirus A", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Sapovirus", analyteAcronym: "Sapovirus", expectedRange: "Present" }]); 
panelToAnalytesTable.set("Respiratory Panel Level I", [{ reportType: ReportType.Qualitative, analyteName: "Adenovirus", analyteAcronym: "Adenovirus", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Bordetella pertussis", analyteAcronym: "B.pertussis", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Chlamydophila pneumoniae", analyteAcronym: "C. pnuemoniae", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Coronavirus 229E", analyteAcronym: "Corona 229E", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Coronavirus HKU1", analyteAcronym: "Corona HKU1", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Coronavirus NL63", analyteAcronym: "Corona NL63", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Coronavirus OC43", analyteAcronym: "Corona OC43", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Human metapneumovirus (hMPV)", analyteAcronym: "hMPV", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Human rhinovirus/enterovirus", analyteAcronym: "H rhino", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Influenza A H1", analyteAcronym: "Flu A H1", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Influenza A H1 2009", analyteAcronym: "Flu A H1 2009", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Influenza A H3", analyteAcronym: "Flu A H3", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Influenza B  virus", analyteAcronym: "Flu B", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Mycoplasma pneumoniae", analyteAcronym: "M. pneumoniae", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Parainfluenza virus 1", analyteAcronym: "PIV 1", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Parainfluenza virus 2", analyteAcronym: "PIV 2", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Parainfluenza virus 3", analyteAcronym: "PIV 3", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Parainfluenza virus 4", analyteAcronym: "PIV 4", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Respiratory syncytial virus A", analyteAcronym: "RSV A", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "SARS-CoV-2", analyteAcronym: "COVID-19", expectedRange: "Present" }]);
panelToAnalytesTable.set("Respiratory Panel Level II", [{ reportType: ReportType.Qualitative, analyteName: "Adenovirus", analyteAcronym: "Adenovirus", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Bordetella pertussis", analyteAcronym: "B.pertussis", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Chlamydophila pneumoniae", analyteAcronym: "C. pnuemoniae", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Coronavirus 229E", analyteAcronym: "Corona 229E", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Coronavirus HKU1", analyteAcronym: "Corona HKU1", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Coronavirus NL63", analyteAcronym: "Corona NL63", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Coronavirus OC43", analyteAcronym: "Corona OC43", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Human metapneumovirus (hMPV)", analyteAcronym: "hMPV", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Human rhinovirus/enterovirus", analyteAcronym: "H rhino", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Influenza A H1", analyteAcronym: "Flu A H1", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Influenza A H1 2009", analyteAcronym: "Flu A H1 2009", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Influenza A H3", analyteAcronym: "Flu A H3", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Influenza B  virus", analyteAcronym: "Flu B", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Mycoplasma pneumonia", analyteAcronym: "M. pneumoniae", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Parainfluenza virus 1", analyteAcronym: "PIV 1", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Parainfluenza virus 2", analyteAcronym: "PIV 2", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Parainfluenza virus 3", analyteAcronym: "PIV 3", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Parainfluenza virus 4", analyteAcronym: "PIV 4", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Respiratory syncytial virus A", analyteAcronym: "RSV A", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "SARS-CoV-2", analyteAcronym: "COVID 19", expectedRange: "Not Detected" }]);
panelToAnalytesTable.set("STI-PCR Panel Level I", [{ reportType: ReportType.Qualitative, analyteName: "Chlamydia trachomatis", analyteAcronym: "CT", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Neisseria gonorrhea", analyteAcronym: "NG", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Human Immunodeficiency virus 1", analyteAcronym: "HIV 1", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Human Immunodeficiency virus 2", analyteAcronym: "HIV 2", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Human papillomavirus", analyteAcronym: "HPV", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Herpes simplex virus 1", analyteAcronym: "HSV 1", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Herpes simplex virus 2", analyteAcronym: "HSV 2", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Trichomonas vaginalis", analyteAcronym: "TV", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Mycoplasma genitalium", analyteAcronym: "Mgen", expectedRange: "Not Detected" }]);
panelToAnalytesTable.set("STI-PCR Panel Level II", [{ reportType: ReportType.Qualitative, analyteName: "Chlamydia trachomatis", analyteAcronym: "CT", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Neisseria gonorrhea", analyteAcronym: "NG", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Human Immunodeficiency virus 1-PCR", analyteAcronym: "HIV 1", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Human Immunodeficiency virus 2-PCR", analyteAcronym: "HIV 2", expectedRange: "Not Detected" }, { reportType: ReportType.Qualitative, analyteName: "Human papillomavirus", analyteAcronym: "HPV", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Herpes simplex virus 1", analyteAcronym: "HSV 1", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Herpes simplex virus 2", analyteAcronym: "HSV 2", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Trichomonas vaginalis", analyteAcronym: "TV", expectedRange: "Present" }, { reportType: ReportType.Qualitative, analyteName: "Mycoplasma genitalium", analyteAcronym: "Mgen", expectedRange: "Present" }]);
panelToAnalytesTable.set("HIV Real-Time PCR Panel: Negative Control", [{ reportType: ReportType.QualitativeViralLoadRange, analyteName: "Human Immunodeficiency virus 1", analyteAcronym: "HIV 1", conventionalUnits: "copies/mL", minLevel: "Target Not Detected", maxLevel: "Target Not Detected" }, { reportType: ReportType.QualitativeViralLoadRange, analyteName: "Human Immunodeficiency virus 2", analyteAcronym: "HIV 2", conventionalUnits: "copies/mL", minLevel: "Target Not Detected", maxLevel: "Target Not Detected" }]);
panelToAnalytesTable.set("HIV Real-Time PCR Panel: Low Control", [{ reportType: ReportType.QualitativeViralLoadRange, analyteName: "Human Immunodeficiency virus 1", analyteAcronym: "HIV 1", conventionalUnits: "copies/mL", minLevel: "20", maxLevel: "30" }, { reportType: ReportType.QualitativeViralLoadRange, analyteName: "Human Immunodeficiency virus 2", analyteAcronym: "HIV 2", conventionalUnits: "copies/mL", minLevel: "25", maxLevel: "40" }]);
panelToAnalytesTable.set("HIV Real-Time PCR Panel: High Control", [{ reportType: ReportType.QualitativeViralLoadRange, analyteName: "Human Immunodeficiency virus 1", analyteAcronym: "HIV 1", conventionalUnits: "copies/mL", minLevel: "250000", maxLevel: "300000" }, { reportType: ReportType.QualitativeViralLoadRange, analyteName: "Human Immunodeficiency virus 2", analyteAcronym: "HIV 2", conventionalUnits: "copies/mL", minLevel: "150000", maxLevel: "200000" }]);

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
			const items = QCPanels.map((item) => { return { fileName: item, lotNumber: item, closedDate: item, analytes: panelToAnalytesTable.get(item)  }})

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
