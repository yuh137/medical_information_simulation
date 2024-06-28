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
    // sdplus1: number;
    // sdplus2: number;
    // sdplus3: number;
    // sdminus1: number;
    // sdminus2: number;
    // sdminus3: number;
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
    }[];
}