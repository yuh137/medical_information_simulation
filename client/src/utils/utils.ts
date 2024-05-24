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