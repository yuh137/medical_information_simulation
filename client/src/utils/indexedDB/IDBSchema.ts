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
        comments?: string;
        tech?: string;
    }[];
}

export interface MolecularQCReport {
    studentID: string;
    creationDate: Date;
    analyteInputs: AnalyteInput[];
}

export interface AnalyteInput {
    analyteName: string;
    value: string;
    comment: string;
}

export enum AnalyteReportType {
    Qualitative,
    QualitativeViralLoadRange
}

export interface MolecularQCTemplateBatchAnalyte {
    reportType: AnalyteReportType;
    analyteName: string;
    analyteAcronym: string;
}

export interface QualitativeMolecularQCTemplateBatchAnalyte extends MolecularQCTemplateBatchAnalyte {
    expectedRange: string;
}

export interface QualitativeViralLoadRangeMolecularQCTemplateBatchAnalyte extends MolecularQCTemplateBatchAnalyte {
    conventionalUnits: string;
    minLevel: string;
    maxLevel: string;
}

export interface MolecularQCTemplateBatch {
    fileName: string;
    lotNumber: string;
    openDate: string;
    closedDate: string;
    analytes: MolecularQCTemplateBatchAnalyte[];
    reports: MolecularQCReport[];
}

export interface Analyte {
    analyteID: string,
    analyteName: string,
    analyteAcronym: string,
    type: string,
    unitOfMeasure: string | null,
    minLevel: number | null,
    maxLevel: number | null,
    expectedRange: string,
    adminQCLotID: string
}

export interface QCPanel {
    adminQCLotID: string,
    qcName: string,
    lotNumber: string,
    openDate: string,
    closedDate: string | null,
    fileDate: string | null,
    expirationDate: string,
    isActive: boolean,
    department: number,
    analytes: Analyte[],
    reports?: MolecularQCReport[]
}
