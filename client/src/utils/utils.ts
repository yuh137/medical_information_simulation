import { clsx, type ClassValue } from "clsx"
import { jwtDecode } from "jwt-decode";
import { Component, Link, MonitorCheck } from "lucide-react";
import { twMerge } from "tailwind-merge"

export const testTypeLinkList = [
  {link: "chemistry", name: "Chemistry"},
  {link: "hema_coag", name: "Hematology/Coag"},
  {link: "microbiology", name: "Microbiology"},
  {link: "serology", name: "Serology"},
  {link: "UA_fluids", name: "UA/Body Fluids"},
  {link: "blood_bank", name: "Blood Bank"},
  {link: "molecular", name: "Molecular"},
];

export const qcTypeLinkList = [
  {name:"CMP Level I", link:'cmp_1', },
  {name:"CMP Level II", link: "cmp_2", },
  {name:"Cardiac Level I", link: "cardiac_1", },
  {name:"Cardiac Level II", link: "cardiac_2", },
  {name:"Thyroid Level I", link: "thyroid_1", },
  {name:"Thyroid Level II", link: "thyroid_2", },
  {name:"Liver Level I", link: "liver_1", },
  {name:"Liver Level II", link: "liver_2", },
  {name:"Lipid Level I", link: "lipid_1", },
  {name:"Lipid Level II", link: "lipid_2", },
  {name:"Iron Studies Level I", link: "iron_1", },
  {name:"Iron Studies Level II", link: "iron_2",},
  {name:"Drug Screen Level I", link: "drug_1", },
  {name:"Drug Screen Level II", link: "drug_2", },
  {name:"Hormone Level I", link: "hormone_1", },
  {name:"Hormone Level II", link: "hormone_2", },
  {name: "Pancreatic Level I" , link: "pancreatic_1", },
  {name: "Pancreatic Level II", link: "pancreatic_2", },
  {name: "Vitamins Level I", link: "vitamins_1", },
  {name: "Vitamins Level II", link: "vitamins_2", },
  {name: "Diabetes Level I", link: "diabetes_1", },
  {name: "Diabetes Level II", link: "diabetes_2", },
  {name: "Cancer Level I", link: "cancer_1", },
  {name: "Cancer Level II", link: "cancer_2", },
];

export const hemeTypeLinkList = [
  {name: "CBC Level I", link: 'cbc_1'},
  {name: "CBC Level II", link: 'cbc_2'},
  {name: "CBC Level III", link: 'cbc_3'},
  {name: "Retic Level I", link: 'retic_1'},
  {name: "Retic Level II", link: 'retic_2'},
  {name: "Retic Level III", link: 'retic_3'},
  {name: "Sickle Cell QC Screen", link: 'sickle'},
  {name: "Erythrocyte Sedimentation Rate QC", link: 'erythrocyte'},
]

export const CoagTypeLinkList = [
    { name: "Normal Coag", link: 'norm_coag' },
    { name: "Abnormal Coag", link: 'abnorm_coag' },
    { name: "Normal DIC", link: 'norm_dic' },
    { name: "Abnormal DIC", link: 'abnorm_dic' },
    { name: "FDP QC", link: 'fdp_qc' },
    { name: "Factor Level QC", link: 'fact_lvl_qc' },
    { name: "Lupus Anticoagulant Positive", link: 'lupus_anticoag_pos' },
    { name: "Lupus Anticoagulant Negative", link: 'lupus_anticoag_neg' },
    { name: "APCR V Screen (+)", link: 'apcr_v_screen_pos' },
    { name: "APCR V Screen (=)", link: 'apcr_v_screen_neg' },
    { name: "Von Willebrand Factor", link: 'von_will_fact' },
    { name: "Anti-Xa QC", link: 'anti_xa_qc' },
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function renderSubString(string: string) {
  return string.replace(/(_\d+)/g, "<sub>$&</sub>").replace(/_/g, "");
}

export function generateRandomId(): string {
  const randomDigits = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return `Q-${randomDigits}`;
}

export const HormoneLevelList = [
  { name: "total Testosterone", acronymName: "TEST" },
  { name: "free Testosterone", acronymName: "fTEST" },
  { name: "Prostate Specific Antigen-Total", acronymName: "tPSA" },
  { name: "Prostate Specific Antigen-Free", acronymName: "fPSA" },
  { name: "Estradiol", acronymName: "E2" },
  { name: "Follicle Stimulating Hormone", acronymName: "FSH" },
  { name: "Luteinizing Hormone", acronymName: "LH" },
  { name: "Progesterone", acronymName: "PROG" },
  { name: "Sex Hormone Binding Globulin", acronymName: "SHBG" },
  { name: "Human Chorionic Gonadotropin-Total", acronymName: "hCGT" }
];

export const DrugLevelList = [
  { name: "Amphetamines", acronymName: "AMP" },
  { name: "Cannabinoids", acronymName: "THC" },
  { name: "Cocaine", acronymName: "COC" },
  { name: "Opiates", acronymName: "OPI" },
  { name: "Phencyclidine", acronymName: "PCP" },
  { name: "Barbiturates", acronymName: "BARB" },
  { name: "Benzodiazepines", acronymName: "BENZ" },
  { name: "Methadone", acronymName: "METH" },
  { name: "Propoxyphene", acronymName: "PRO" },
  { name: "Ethanol", acronymName: "ETOH" }
];

export const IronLevelList = [
  { name: "Iron, Total", acronymName: "Fe" },
  { name: "Total Iron Binding Capacity", acronymName: "TIBC" },
  { name: "Transferrin Saturation", acronymName: "TS" },
  { name: "Ferritin", acronymName: "Ferr" }
];

export const LipidLevelList = [
  { name: "Cholesterol", acronymName: "Chol" },
  { name: "High-Density Lipoproteins", acronymName: "HDL" },
  { name: "Low-Density Lipoproteins", acronymName: "LDL" },
  { name: "Triglycerides, Total", acronymName: "Trig" }
];

export const LiverLevelList = [
  { name: "Alanine Aminotransferase", acronymName: "ALT" },
  { name: "Aspartate Aminotransferase", acronymName: "AST" },
  { name: "Alkaline Phosphatase", acronymName: "ALP" },
  { name: "Gamma Glutamyl transferase", acronymName: "GGT" },
  { name: "Albumin", acronymName: "ALB" },
  { name: "Bilirubin", acronymName: "BIL" },
  { name: "Total Protein", acronymName: "TP" }
];

export const ThyroidLevelList = [
  { name: "Thyroid-Stimulating hormone", acronymName: "TSH" },
  { name: "TIiodothyronine, Total", acronymName: "T3" },
  { name: "Thyroxine, Total", acronymName: "T4" },
  { name: "Triiodothyronine, Free", acronymName: "FT₃" },
  { name: "Thyroxine, Free", acronymName: "FT₄" },
  { name: "Anti-Thyroid Peroxidase", acronymName: "TPOAb" },
  { name: "Anti-Thyroglobulin", acronymName: "TgAB" }
];

export const CardiacLevelList = [
  { name: "Troponin-I", acronymName: "cTnl" },
  { name: "Creatine Kinase", acronymName: "CK" },
  { name: "Creatine Kinase-MB", acronymName: "CK-MB" },
  { name: "Myoglobin", acronymName: "MYO" },
  { name: "High-sensitivity C-reactive Protein", acronymName: "hsCRP" }
];
export const CMPLevelList = [
  { name: "Sodium", acronymName: "Na" },
  { name: "Potassium", acronymName: "K" },
  { name: "Chloride", acronymName: "Cl" },
  { name: "Carbon Dioxide", acronymName: "CO_2" },
  { name: "Blood Urea Nitrogen", acronymName: "BUN" },
  { name: "Creatinine", acronymName: "CREA" },
  { name: "Calcium", acronymName: "CA" },
  { name: "Glucose", acronymName: "GLU" },
  { name: "Albumin", acronymName: "ALB" },
  { name: "Alanine Aminotransferase", acronymName: "ALT" },
  { name: "Aspartate Aminotransferase", acronymName: "AST" },
  { name: "Alkaline Phosphatase", acronymName: "ALP" },
  { name: "Bilirubin", acronymName: "BIL" },
  { name: "Total Protein", acronymName: "TP" }
];

export const PancreaticLevelList = [
  { name: "Amylase", acronymName: "AMY" },
  { name: "Lipase", acronymName: "LIP" },
  { name: "Lactate Dehydrogenase", acronymName: "LDH" },
];

export const DiabetesLevelList = [
  { name: "Glycated Hemoglobin", acronymName: "HgbA1c" },
  { name: "Magnesium", acronymName: "Mg" },
  { name: "Phosphorus", acronymName: "Phos" },
];

export const CancerLevelList = [
  { name: "Carcinoembryonic Antigen", acronymName: "CEA" },
  { name: "Cancer Antigen 125", acronymName: "CA 125" },
  { name: "Carbohydrate Antigen 19-9", acronymName: "CA 19-9" },
  { name: "Cancer Antigen 15-3", acronymName: "CA 15-3" },
  { name: "Cancer Antigen 27.29", acronymName: "CA 27.29" },
];

export const VitaminsLevelList = [
  { name: "Vitamin B12", acronymName: "B12" },
  { name: "Vitamin B6", acronymName: "B6" },
  { name: "25-Hydroxy Vitamin D", acronymName: "Vit D" },
  { name: "Vitamin A", acronymName: "Vit A" },
  { name: "Vitamin C", acronymName: "Vit C" },
  { name: "Homocysteine", acronymName: "HCY" },
  { name: "Folate", acronymName: "FOL" },
];

//MINE MINE MINE MINE MINE - Zack 
export const CBCLevelIList = [
  { name: "White Blood Cell", acronymName: "WBC" },
  { name: "Red Blood Cell", acronymName: "RBC" },
  { name: "Hemoglobin", acronymName: "Hgb" },
  { name: "Hematocrit", acronymName: "Hct" },
  { name: "Mean Corp. Value", acronymName: "MCV" },
  { name: "Mean Corp. Hgb", acronymName: "MCH" },
  { name: "Mean Corp. Hgb Conc.", acronymName: "MCHC" },
  { name: "RBC Distribution Width", acronymName: "RDW" },
  { name: "Neutrophil %", acronymName: "NE" },
  { name: "Absolute Neutrophil Ct", acronymName: "NE #" },
  { name: "Lymphocyte %", acronymName: "LY" },
  { name: "Absolute Lymphocyte Ct", acronymName: "LY #" },
  { name: "Monocyte %", acronymName: "MO" },
  { name: "Absolute Monocyte Ct", acronymName: "MO #" },
  { name: "Eosinophil %", acronymName: "EO" },
  { name: "Absoltue Eosinophil Ct", acronymName: "EO #" },
  { name: "Basophil %", acronymName: "BA" },
  { name: "Absolute Basophil Ct", acronymName: "BA #" },
  { name: "Platelet Count", acronymName: "PLT" },
  { name: "Mean Platelet Volume", acronymName: "MPV" },
]

export const CustomHemeList = [
  { name: "White Blood Cell", acronymName: "WBC"},
  { name: "Red Blood Cell", acronymName: "RBC" },
  { name: "Hemoglobin", acronymName: "Hgb"},
  { name: "Hematocrit", acronymName: "Hct"},
  { name: "Mean Corp. Value", acronymName: "MCV" },
  { name: "Mean Corp. Hgb", acronymName: "MCH"  },
  { name: "Mean Corp. Hgb Conc.", acronymName: "MCHC" },
  { name: "RBC Distribution Width", acronymName: "RDW" },
  { name: "Neutrophil %", acronymName: "NE" },
  { name: "Absolute Neutrophil Ct", acronymName: "NE #" },
  { name: "Lymphocyte %", acronymName: "LY" },
  { name: "Absolute Lymphocyte Ct", acronymName: "LY #" },
  { name: "Monocyte %", acronymName: "MO" },
  { name: "Absolute Monocyte Ct", acronymName: "MO #" },
  { name: "Eosinophil %", acronymName: "EO" },
  { name: "Absoltue Eosinophil Ct", acronymName: "EO #" },
  { name: "Basophil %", acronymName: "BA" },
  { name: "Absolute Basophil Ct", acronymName: "BA #" },
  { name: "Platelet Count", acronymName: "PLT" },
  { name: "Mean Platelet Volume", acronymName: "MPV" },
  { name: "Retic %", acronymName: "RET %" },
  { name: "Sickle Cell Positive", acronymName: "TEST" },
  { name: "Sickle Cell Negative", acronymName: "TEST" },
  { name: "Test Validation", acronymName: "TEST" },
  { name: "Erythrocyte Sedimentation Rate I", acronymName: "TEST" },
  { name: "Erythrocyte Sedimentation Rate II", acronymName: "TEST" },
];

export const CustomCoagList = [
  { name: "TEST", acronymName: "WBC"},
  { name: "Red Blood Cell", acronymName: "RBC" },
  { name: "Hemoglobin", acronymName: "Hgb"},
  { name: "Hematocrit", acronymName: "Hct"},
  { name: "Mean Corp. Value", acronymName: "MCV" },
  { name: "Mean Corp. Hgb", acronymName: "MCH"  },
  { name: "Mean Corp. Hgb Conc.", acronymName: "MCHC" },
  { name: "RBC Distribution Width", acronymName: "RDW" },
  { name: "Neutrophil %", acronymName: "NE" },
  { name: "Absolute Neutrophil Ct", acronymName: "NE #" },
  { name: "Lymphocyte %", acronymName: "LY" },
  { name: "Absolute Lymphocyte Ct", acronymName: "LY #" },
  { name: "Monocyte %", acronymName: "MO" },
  { name: "Absolute Monocyte Ct", acronymName: "MO #" },
  { name: "Eosinophil %", acronymName: "EO" },
  { name: "Absoltue Eosinophil Ct", acronymName: "EO #" },
  { name: "Basophil %", acronymName: "BA" },
  { name: "Absolute Basophil Ct", acronymName: "BA #" },
  { name: "Platelet Count", acronymName: "PLT" },
  { name: "Mean Platelet Volume", acronymName: "MPV" },
  { name: "Retic %", acronymName: "RET %" },
  { name: "Sickle Cell Positive", acronymName: "TEST" },
  { name: "Sickle Cell Negative", acronymName: "TEST" },
  { name: "Test Validation", acronymName: "TEST" },
  { name: "Erythrocyte Sedimentation Rate I", acronymName: "TEST" },
  { name: "Erythrocyte Sedimentation Rate II", acronymName: "TEST" },
];

export const qcHemeLinkList = [

  { name: "Custom Tests", link: "heme_custom_tests" },
  
];



/*   { name: "Red Blood Cell", link: "red_blood" },
  { name: "Hemoglobin", link: "hemoglobin"},
  { name: "Hematocrit", link: "hematocrit"},
  { name: "Mean Corp. Value", link: "mean_corp_val" },
  { name: "Mean Corp. Hgb", link: "mean_corp_hgb"  },
  { name: "Mean Corp. Hgb Conc.", link: "mean_corp_hgb_conc" },
  { name: "RBC Distribution Width", link: "rbc_dist" },
  { name: "Neutrophil %", link: "neutrophil" },
  { name: "Absolute Neutrophil Ct", link: "abs_neutrophil_ct" },
  { name: "Lymphocyte %", link: "lymphocyte_perc" },
  { name: "Absolute Lymphocyte Ct", link: "abs_lymphocyte_ct" },
  { name: "Monocyte %", link: "monocyte_perc" },
  { name: "Absolute Monocyte Ct", link: "absolute_monocyte_ct" },
  { name: "Eosinophil %", link: "eosinophil_perc" },
  { name: "Absoltue Eosinophil Ct", link: "absoltue_eosinophil_ct" },
  { name: "Basophil %", link: "basophil_perc" },
  { name: "Absolute Basophil Ct", link: "absolute_Basophil_ct" },
  { name: "Platelet Count", link: "platelet_count" },
  { name: "Mean Platelet Volume", link: "mean_platelet_volume" },
  { name: "Retic %", link: "retic_perc" },
  { name: "Sickle Cell Positive", link: "sickle_cell_pos" },
  { name: "Sickle Cell Negative", link: "sickle_cell_neg" },
  { name: "Test Validation", link: "test_validation" },
  { name: "Erythrocyte Sedimentation Rate I", link: "erythrocyte_rate_one" },
  { name: "Erythrocyte Sedimentation Rate II", link: "erythrocyte_rate_two" },
] */


export const isTokenExpired = (token: string) => {
  if (!token) return true;
   
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // console.log(decodedToken, currentTime);

    if (decodedToken.exp !== undefined ) {
      return decodedToken.exp < currentTime;
    } else return true;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export interface Admin {
  username: string;
  firstname: string;
  lastname: string;
  initials: string;
  students: Student[];
}

export interface Student {
  username: string;
  firstname: string;
  lastname: string;
  initials: string;
}

export enum Department {
  Chemistry,
  Serology,
  Blood_Bank,
  Hematology,
  Coagulation,
  Microbiology,
  Molecular,
  Urinalysis,
}

export interface DefinedRequestError {
  errorCode: ErrorCode;
  message: string;
}

export enum ErrorCode
{
  AlreadyExist,
  NotFound,
  MinimumLengthRequired
}