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
    unit_of_measure: string;
    min_level: number;
    max_level: number;
    mean: number;
    std_devi: number;
}

export interface QCTemplateBatch {
    fileName: string;
    lotNumber: string;
    openDate: string;
    closedDate: string;
    analytes: {
        analyteName: string;
        analyteAcronym: string;
        unit_of_measure: string;
        min_level: string;
        max_level: string;
        mean: string;
        std_devi: string;
        electrolyte: boolean;
        value?: string; // Optional value field, since it might not exist initially

    }[];
}

export interface BloodBankQC {
    fileName: string;
    lotNumber: string;
    expDate: string;
    openDate: string;
    closedDate: string;
    reportType:string;
    reagents: {
        reagentName: string;
        Abbreviation: string;
        AntiSeraLot: string;
        ExpDate: string;
        ExpectedRange: string;

    }[];
}