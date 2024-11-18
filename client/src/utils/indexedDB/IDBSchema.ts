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

export interface BloodBankQCLot {
    bloodBankQCLotID?: string;
    qcName: string;
    lotNumber: string;
    openDate: string;
    expirationDate: string;
    reagents: {
        reagentName: string;
        abbreviation: string;
        reagentLotNum: string;
        expirationDate: string;
        posExpectedRange: string;
        negExpectedRange: string;
        immediateSpin: string;
        thirtySevenDegree: string; 
        ahg: string;
        checkCell: string;
    }[];
}

export interface BloodBankQC {
    fileName: string;
    lotNumber: string;
    qcExpDate: string;
    openDate: string;
    closedDate: string;
    reportType:string;
    reagents: {
        reagentName: string;
        Abbreviation: string;
        AntiSeraLot: string;
        reagentExpDate: string;
        ExpectedRange: string;

    }[];
}
export interface BloodBankQC_Two__Three{
    fileName: string;
    lotNumber: string;
    qcExpDate: string;
    openDate: string;
    closedDate: string;
    reportType:string;
    reagents: {
        reagentName:string,
        Abbreviation:string,
        ExpImmSpinRange:string,
        Exp37Range:string,
        ExpAHGRange:string,
        ExpCheckCellsRange:string
    }[];
}
export interface BloodBankRBC {
    fileName: string;
    lotNumber: string;
    qcExpDate: string;
    openDate: string;
    closedDate: string;
    reportType:string;
    reagents: {
        reagentName:string,
        Abbreviation:string,
        AntiSeraLot:string,
        reagentExpDate:string,
        ExpImmSpinRange:string,
        Exp37Range:string,
        ExpAHGRange:string,
        ExpCheckCellsRange:string
    }[];
}