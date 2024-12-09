import React, { useEffect, useState } from 'react'
import NavBar from '../../../components/NavBar'
import { ButtonBase, Modal } from '@mui/material';
import { DatePicker } from 'antd';

interface DefinedTest {
    analyteName: string;
    analyteAcronym: string;
    unitOfMeasure: string;
}

const predefinedAnalytes = {
    CMP: [
        { analyteName: "Sodium", analyteAcronym: "Na", unitOfMeasure: "mEq/L" },
        { analyteName: "Potassium", analyteAcronym: "K", unitOfMeasure: "mEq/L" },
        { analyteName: "Chloride", analyteAcronym: "Cl", unitOfMeasure: "mEq/L" },
        { analyteName: "Carbon Dioxide", analyteAcronym: "CO2", unitOfMeasure: "mEq/L" },
        { analyteName: "Blood Urea Nitrogen", analyteAcronym: "BUN", unitOfMeasure: "mg/dL" },
        { analyteName: "Creatinine", analyteAcronym: "CREA", unitOfMeasure: "mg/dL" },
        { analyteName: "Calcium", analyteAcronym: "CA", unitOfMeasure: "mg/dL" },
        { analyteName: "Glucose", analyteAcronym: "GLU", unitOfMeasure: "mg/dL" },
        { analyteName: "Albumin", analyteAcronym: "ALB", unitOfMeasure: "g/dL" },
        { analyteName: "Alanine Aminotransferase", analyteAcronym: "ALT", unitOfMeasure: "U/L" },
        { analyteName: "Aspartate Aminotransferase", analyteAcronym: "AST", unitOfMeasure: "U/L" },
        { analyteName: "Alkaline Phosphatase", analyteAcronym: "ALP", unitOfMeasure: "U/L" },
        { analyteName: "Bilirubin", analyteAcronym: "BIL", unitOfMeasure: "mg/dL" },
        { analyteName: "Total Protein", analyteAcronym: "TP", unitOfMeasure: "mg/dL" }
    ],
    Cardiac: [
        { analyteName: "Troponin-I", analyteAcronym: "cTnI", unitOfMeasure: "ng/mL" },
        { analyteName: "Creatine Kinase", analyteAcronym: "CK", unitOfMeasure: "U/L" },
        { analyteName: "Creatine Kinase-MB", analyteAcronym: "CK-MB", unitOfMeasure: "%" },
        { analyteName: "Myoglobin", analyteAcronym: "MYO", unitOfMeasure: "ng/mL" },
        { analyteName: "High-sensitivity C-reactive Protein", analyteAcronym: "hsCRP", unitOfMeasure: "mg/dL" }
    ],
    Thyroid: [
        { analyteName: "Thyroid-Stimulating Hormone", analyteAcronym: "TSH", unitOfMeasure: "µIU/mL" },
        { analyteName: "Triiodothyronine, Total", analyteAcronym: "T3", unitOfMeasure: "ng/dL" },
        { analyteName: "Thyroxine, Total", analyteAcronym: "T4", unitOfMeasure: "µg/dL" },
        { analyteName: "Triiodothyronine, Free", analyteAcronym: "FT3", unitOfMeasure: "pg/dL" },
        { analyteName: "Thyroxine, Free", analyteAcronym: "FT4", unitOfMeasure: "ng/dL" },
        { analyteName: "Anti-Thyroid Peroxidase", analyteAcronym: "TPOAb", unitOfMeasure: "IU/mL" },
        { analyteName: "Anti-Thyroglobulin", analyteAcronym: "TgAb", unitOfMeasure: "ng/mL" }
    ],
    Liver: [
        { analyteName: "Alanine Aminotransferase", analyteAcronym: "ALT", unitOfMeasure: "U/L" },
        { analyteName: "Aspartate Aminotransferase", analyteAcronym: "AST", unitOfMeasure: "U/L" },
        { analyteName: "Alkaline Phosphatase", analyteAcronym: "ALP", unitOfMeasure: "U/L" },
        { analyteName: "Gamma Glutamyl Transferase", analyteAcronym: "GGT", unitOfMeasure: "U/L" },
        { analyteName: "Albumin", analyteAcronym: "ALB", unitOfMeasure: "g/dL" },
        { analyteName: "Bilirubin", analyteAcronym: "BIL", unitOfMeasure: "mg/dL" },
        { analyteName: "Total Protein", analyteAcronym: "TP", unitOfMeasure: "mg/dL" }
    ],
    Lipid: [
        { analyteName: "Cholesterol, Total", analyteAcronym: "Chol", unitOfMeasure: "mg/dL" },
        { analyteName: "High-Density Lipoproteins", analyteAcronym: "HDL", unitOfMeasure: "mg/dL" },
        { analyteName: "Low-Density Lipoproteins", analyteAcronym: "LDL", unitOfMeasure: "mg/dL" },
        { analyteName: "Triglycerides, Total", analyteAcronym: "Trig", unitOfMeasure: "mg/dL" }
    ],
    "Iron Studies": [
        { analyteName: "Iron, Total", analyteAcronym: "Fe", unitOfMeasure: "µg/dL" },
        { analyteName: "Total Iron Binding Capacity", analyteAcronym: "TIBC", unitOfMeasure: "µg/dL" },
        { analyteName: "Transferrin Saturation", analyteAcronym: "TS", unitOfMeasure: "mg/dL" },
        { analyteName: "Ferritin", analyteAcronym: "Ferr", unitOfMeasure: "ng/dL" }
    ],
    "Drug Screen": [
        { analyteName: "Amphetamines", analyteAcronym: "AMP", unitOfMeasure: "ng/mL" },
        { analyteName: "Cannabinoids", analyteAcronym: "THC", unitOfMeasure: "ng/mL" },
        { analyteName: "Cocaine", analyteAcronym: "COC", unitOfMeasure: "ng/mL" },
        { analyteName: "Opiates", analyteAcronym: "OPI", unitOfMeasure: "ng/mL" },
        { analyteName: "Phencyclidine", analyteAcronym: "PCP", unitOfMeasure: "ng/mL" },
        { analyteName: "Barbiturates", analyteAcronym: "BARB", unitOfMeasure: "ng/mL" },
        { analyteName: "Benzodiazepines", analyteAcronym: "BENZ", unitOfMeasure: "ng/mL" },
        { analyteName: "Methadone", analyteAcronym: "METH", unitOfMeasure: "ng/mL" },
        { analyteName: "Propoxyphene", analyteAcronym: "PRO", unitOfMeasure: "ng/mL" },
        { analyteName: "Ethanol", analyteAcronym: "ETOH", unitOfMeasure: "mg/dL" }
    ],
    Hormone: [
        { analyteName: "Total Testosterone", analyteAcronym: "TEST", unitOfMeasure: "ng/dL" },
        { analyteName: "Free Testosterone", analyteAcronym: "fTEST", unitOfMeasure: "pg/mL" },
        { analyteName: "Prostate Specific Antigen-Total", analyteAcronym: "tPSA", unitOfMeasure: "ng/mL" },
        { analyteName: "Prostate Specific Antigen-Free", analyteAcronym: "fPSA", unitOfMeasure: "%" },
        { analyteName: "Estradiol", analyteAcronym: "E2", unitOfMeasure: "pg/mL" },
        { analyteName: "Follicle Stimulating Hormone", analyteAcronym: "FSH", unitOfMeasure: "mIU/mL" },
        { analyteName: "Luteinizing Hormone", analyteAcronym: "LH", unitOfMeasure: "IU/L" },
        { analyteName: "Progesterone", analyteAcronym: "PROG", unitOfMeasure: "ng/mL" },
        { analyteName: "Sex Hormone Binding Globulin", analyteAcronym: "SHBG", unitOfMeasure: "nmol/L" },
        { analyteName: "Human Chorionic Gonadotropin-Total", analyteAcronym: "hCGT", unitOfMeasure: "mIU/mL" }
    ],
    Pancreatic: [
        { analyteName: "Amylase", analyteAcronym: "AMY", unitOfMeasure: "U/L" },
        { analyteName: "Lipase", analyteAcronym: "LIP", unitOfMeasure: "U/L" },
        { analyteName: "Lactate Dehydrogenase", analyteAcronym: "LDH", unitOfMeasure: "U/L" }
    ],
    Vitamins: [
        { analyteName: "Vitamin B12", analyteAcronym: "B12", unitOfMeasure: "pg/mL" },
        { analyteName: "Vitamin B6", analyteAcronym: "B6", unitOfMeasure: "ng/mL" },
        { analyteName: "25-Hydroxy Vitamin D", analyteAcronym: "Vit D", unitOfMeasure: "ng/mL" },
        { analyteName: "Vitamin A", analyteAcronym: "Vit A", unitOfMeasure: "µg/dL" },
        { analyteName: "Vitamin C", analyteAcronym: "Vit C", unitOfMeasure: "mg/dL" },
        { analyteName: "Homocysteine", analyteAcronym: "HCY", unitOfMeasure: "µmol/L" },
        { analyteName: "Folate", analyteAcronym: "FOL", unitOfMeasure: "ng/mL" }
    ],
    Diabetes: [
        { analyteName: "Glycated Hemoglobin", analyteAcronym: "HgbA1c", unitOfMeasure: "% of total Hb" },
        { analyteName: "Magnesium", analyteAcronym: "Mg", unitOfMeasure: "mEq/L" },
        { analyteName: "Phosphorus", analyteAcronym: "Phos", unitOfMeasure: "mg/dL" }
    ],
    Cancer: [
        { analyteName: "Carcinoembryonic Antigen", analyteAcronym: "CEA", unitOfMeasure: "ng/mL" },
        { analyteName: "Cancer Antigen 125", analyteAcronym: "CA 125", unitOfMeasure: "U/mL" },
        { analyteName: "Carbohydrate Antigen 19-9", analyteAcronym: "CA 19-9", unitOfMeasure: "U/mL" },
        { analyteName: "Cancer Antigen 15-3", analyteAcronym: "CA 15-3", unitOfMeasure: "U/mL" },
        { analyteName: "Cancer Antigen 27.29", analyteAcronym: "CA 27.29", unitOfMeasure: "U/mL" }
    ]                                                
}

const QCColumn = (props: { qcTest: DefinedTest[], name: string, selectedItems: DefinedTest[], setSelectedItems: React.Dispatch<React.SetStateAction<DefinedTest[]>> }) => {
    return (
        <>
            <div className='flex flex-col sm:w-[17rem] sm:h-[35rem] rounded-lg sm:px-3 sm:py-4 bg-[#3A6CC6]'>
                <div className='title text-center text-xl text-white font-semibold sm:py-2'>{props.name}</div>
                <div className='sm:w-full grow bg-gray-200 sm:px-2 sm:py-3 rounded-lg shadow-md overflow-scroll'>
                    <div className='flex flex-col items-center sm:gap-y-4'>
                        {props.qcTest.map((value, index) => (
                            <ButtonBase
                                key={index}
                                className={`!rounded-lg sm:w-[80%] sm:h-14 !border-solid transition ease-in-out ${
                                    props.selectedItems && 
                                    props.selectedItems.includes(value) ? `!border-[#2F528F] !border-[4px] !bg-[#8faadc]`
                                    : `!border !bg-[#dae3f3] !border-[#47669C]`
                                } !px-3`}
                                onClick={() => {
                                    if (!props.selectedItems.includes(value)) {
                                        let newSelectedItems = [...props.selectedItems];
                                        newSelectedItems.push(value);
                                        props.setSelectedItems(newSelectedItems);
                                    } else {
                                        let newSelectedItems = [...props.selectedItems];
                                        newSelectedItems = newSelectedItems.filter(item => item.analyteName !== value.analyteName);
                                        props.setSelectedItems(newSelectedItems);
                                    }
                                }}
                            >{value.analyteName}</ButtonBase>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

const ChemistryCustomQC = () => {
    const [selectedItems, setSelectedItems] = useState<DefinedTest[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    
    useEffect(() => {
        console.log(selectedItems);
    }, [selectedItems])

  return (
    <>
        <NavBar name='Chemistry Custom QC' />
        <div className="basic-container relative flex flex-wrap sm:gap-y-4 sm:gap-x-8 justify-center sm:py-8">
            {Object.entries(predefinedAnalytes).map(([key, value]) => (
                <>
                    <QCColumn qcTest={value} name={key} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
                </>
            ))}
        </div>
        <div className='button-container sticky sm:-bottom-12 flex justify-center sm:-translate-y-7 sm:space-x-36 z-2 bg-white sm:py-6'>
            <ButtonBase className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold"
                onClick={() => setIsModalOpen(true)}
            >
                Save Custom QC
            </ButtonBase>
        </div>
        <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
        >
            <div className='modal-container top-1/4 left-1/2 sm:w-[60svw] sm:max-h-[50svh] bg-[#dae3f3] sm:border-2 border-solid border-[#6781AF] rounded-xl sm:-translate-x-1/2 sm:translate-y-12 flex flex-col items-center sm:py-6 relative overflow-scroll sm:space-y-8'>
                <div className="modal-title sm:text-2xl font-semibold">Create Custom QC</div>
                <div className='flex sm:gap-x-4 justify-center sm:w-[80%]'>
                    <div className="lotname-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
                        <div className="lotname-label sm:text-xl font-semibold text-white">
                            QC Lot Name
                        </div>
                        <input
                            type="text"
                            className="sm:p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center"
                            // value={QCLotInput}
                            onChange={(e) => {
                                e.preventDefault();

                                
                            }}
                        />
                    </div>
                    <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
                        <div className="lotnumber-label sm:text-xl font-semibold text-white">
                            QC Lot Number
                        </div>
                        <input
                            type="text"
                            className="sm:p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center"
                            // value={QCLotInput}
                            onChange={(e) => {
                                e.preventDefault();

                                
                            }}
                        />
                    </div>
                    <div className="expdate-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
                        <div className="expdate-label sm:text-xl font-semibold text-white">
                            Expiration Date
                        </div>
                        <DatePicker
                            showTime
                            popupStyle={{ color: "black" }}
                            style={{
                                padding: "0.25rem",
                                border: "solid 1px #548235",
                                width: "250px",
                                height: "34px",
                                zIndex: 1000
                            }}
                            // defaultValue={loaderData ? dayjs(loaderData.expirationDate) : dayjs()}
                            // value={expDate}
                            format="MM/DD/YYYY"
                            // onChange={(value) => {
                            //     setValue("expirationDate", value.toISOString());
                            //     setExpDate(value);
                            // }}
                        />
                    </div>
                </div>
                <ButtonBase className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold"
                    onClick={() => setIsModalOpen(false)}
                >
                    Create
                </ButtonBase>
            </div>
        </Modal>
    </>
  )
}

export default ChemistryCustomQC