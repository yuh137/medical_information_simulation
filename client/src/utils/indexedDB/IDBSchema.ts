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