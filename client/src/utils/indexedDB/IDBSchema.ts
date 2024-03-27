export interface Admin {
    id: string;
    name: string;
    password: string;
}

export interface Student {
    id: string;
    name: string;
    password: string;
}

export interface ChemistryQCTemplate {
    analyteName: string;
    analyteAcronym: string;
    unit_of_measure: string;
    min_level: number;
    max_level: number;
    mean: number;
    // std_devi: number;
    // sdplus1: number;
    // sdplus2: number;
    // sdplus3: number;
    // sdminus1: number;
    // sdminus2: number;
    // sdminus3: number;
}