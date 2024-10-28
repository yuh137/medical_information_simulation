export interface Admin {
    id: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    initials: string;
}

export interface Student {
    id: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    initials: string;
}


export interface ChemistryQCTemplate {
    analyteName: string;
    analyteAcronym: string;
    unitOfMeasure: string;
    minLevel: number;
    maxLevel: number;
    mean: number;
    stdDevi: number;
}

export interface QCTemplateBatch {
    adminQCLotID?: string;
    fileName: string;
    lotNumber: string;
    openDate: string;
    closedDate: string;
    expirationDate: string;
    fileDate: string;
    analytes: {
        analyteName: string;
        analyteAcronym: string;
        unitOfMeasure: string;
        minLevel: string;
        maxLevel: string;
        mean: string;
        stdDevi: string;
        value?: string; // Optional value field, since it might not exist initially
    }[];
}

export enum ReportType {
	Qualitative,
	QualitativeViralLoadRange
}

export interface MolecularQCTemplateBatchAnalyte {
	reportType: ReportType;
	analyteName: string;
	analyteAcronym: string;
	value?: string;
}

export interface QualitativeMolecularQCTemplateBatchAnalyte extends MolecularQCTemplateBatchAnalyte {
	expectedRange: "Present" | "Not Detected";
}

export interface QualitativeViralLoadRangeMolecularQCTemplateBatchAnalyte extends MolecularQCTemplateBatchAnalyte {
	conventionalUnits: string;
	minLevel: string;
	maxLevel: string;
}

export interface MolecularQCTemplateBatch {
  fileName: string;
  lotNumber: string;
  closedDate: string;
  analytes: MolecularQCTemplateBatchAnalyte[];
}
