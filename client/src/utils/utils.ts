import { clsx, type ClassValue } from "clsx"
import { Component } from "lucide-react";
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
  {name:"CMP Level I", link:'Cmp_1', component: 'TestInputPage'},
  {name:"CMP Level II", link: "cmp_2", component: 'TestInputPage'},
  {name:"Cardiac Level I", link: "cardiac_1", component: 'TestInputPageCardic'},
  {name:"Cardiac Level II", link: "cardiac_2", component: 'TestInputPageCardic'},
  {name:"Thyroid Level I", link: "thyroid_1"},
  {name:"Thyroid Level II", link: "thyroid_2"},
  {name:"Liver Level I", link: "liver_1"},
  {name:"Liver Level II", link: "liver_2"},
  {name:"Lipid Level I", link: "lipid_1"},
  {name:"Lipid Level II", link: "lipid_2"},
  {name:"Iron Studies Level I", link: "iron_1"},
  {name:"Iron Studies Level II", link: "iron_2"},
  {name:"Drug Screen Level I", link: "drug_1"},
  {name:"Drug Screen Level II", link: "drug_2"},
  {name:"Hormone Level I", link: "hormone_1"},
  {name:"Hormone Level II", link: "hormone_2"},
  {name: "Pancreatic Level I" , link: "pancreatic_1"},
  {name: "Pancreatic Level II", link: "pancreatic_2"},
  {name: "Vitamins Level I", link: "vitamins_1"},
  {name: "Vitamins Level II", link: "vitamins_2"},
  {name: "Diabetes Level I", link: "Diabetes_1"},
  {name: "Diabetes Level II", link: "Diabetes_2"},
  {name: "Cancer Level I", link: "Cancer_1"},
  {name: "Cancer Level II", link: "Cancer_2"},

];

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
  { name: "Total Testosterone", acronymName: "TEST" },
  { name: "Free Testosterone", acronymName: "fTEST" },
  { name: "Prostate-specific Antigen-Total", acronymName: "tPSA" },
  { name: "Prostate-specific Antigen-Free", acronymName: "fPSA" },
  { name: "Estradiol", acronymName: "E2" },
  { name: "Follicle-Stimulating Hormone", acronymName: "FSH" },
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
  { name: "Cholesterol", acronymName: "CholL" },
  { name: "High-Density Lipoprotein", acronymName: "HDL" },
  { name: "Low-Density Lipoprotein", acronymName: "LDL" },
  { name: "Triglycerides, Total", acronymName: "Trig" }
];
export const LiverLevelList = [
  { name: "Alanine Aminotransferase", acronymName: "ALT" },
  { name: "Aspartate Aminotransferase", acronymName: "AST" },
  { name: "Alkaline Phosphatase", acronymName: "ALP" },
  { name: "Gamma-glutamyl transferase", acronymName: "GGT" },
  { name: "Albumin", acronymName: "ALB" },
  { name: "Bilirubin", acronymName: "BIL" },
  { name: "Total Protein", acronymName: "TP" }
];
export const ThyroidLevelList = [
  { name: "Thyroid-stimulating hormone", acronymName: "TSH" },
  { name: "Triiodothyronine, Total", acronymName: "T₃" },
  { name: "Thyroxine, Total", acronymName: "T₄" },
  { name: "Triiodothyronine, Free", acronymName: "FT₃" },
  { name: "Thyroxine, Free", acronymName: "FT₄" },
  { name: "Anti-Thyroperoxidase", acronymName: "TPOAb" },
  { name: "Anti-Thyroglobulin", acronymName: "TgAB" }
];
export const CardiacLevelList = [
  { name: "Trroponin-I", acronymName: "T" },
  { name: "Creatine kinase", acronymName: "CK" },
  { name: "Creatine kinase-MB", acronymName: "CK-MB" },
  { name: "Myoglobin", acronymName: "MYO" },
  { name: "High-sensitivity C-reactive protein", acronymName: "hsCRP" }
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
  { name: "Akaline Phosphatase", acronymName: "ALP" },
  { name: "Bilirubin", acronymName: "BIL" },
  { name: "Total Protein", acronymName: "TP" }
];

export const PancreaticLevelList = [
  { name: "Amylase", acronymName: "AMY" },
  { name: "Lactase", acronymName: "LIP" },
  { name: "Lactate Dehydrogenase", acronymName: "LDH" },
];

export const DiabetesLevelList = [
  { name: "Glycated Hemoglobin", acronymName: "HgbA1c" },
  { name: "Magnesium", acronymName: "MG" },
  { name: "Phosphorous", acronymName: "Phos" },
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
