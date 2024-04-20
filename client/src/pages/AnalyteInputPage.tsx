import React, { useRef, useState, useEffect, useMemo } from "react";
import Analyte from "../components/Analyte";
import NavBar from "../components/NavBar";
import { Button, ButtonBase, Modal } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { renderSubString } from "../utils/utils";
import { getAllDataFromStore, getQCRangeByName } from "../utils/indexedDB/getData";
import { QCTemplateBatch } from "../utils/indexedDB/IDBSchema";
import { useForm, SubmitHandler } from "react-hook-form";

const AnalyteInputPage = (props: { name: string, link: string }) => {
  const { theme } = useTheme();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const analyteNameRefs = useRef<HTMLDivElement[]>([]);
  const { register, handleSubmit } = useForm();
  const onSubmit: SubmitHandler<any> = async (data) => {

  }

  // const [isValid, setIsValid] = useState<boolean>(false);
  const [isInputFull, setIsInputFull] = useState<boolean>(false);
  const [analyteValues, setAnalyteValues] = useState<string[]>([]);
  const [invalidIndexes, setInvalidIndexes] = useState<Set<number> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [QCData, setQCData] = useState<QCTemplateBatch>();

  const invalidIndexArray: number[] | null = useMemo(() => {
    if (!invalidIndexes) return null;
    let newArray: number[] = [];
    invalidIndexes.forEach(value => newArray.push(value));
    return newArray;
  }, [invalidIndexes])

  const isValid = useMemo(() => {
    if ((!invalidIndexes || invalidIndexes.size === 0) && analyteValues.length === QCData?.analytes.length) return true;
    else return false;
  }, [analyteValues])

  function detectLevel(str: string): number {
      if (str.endsWith("I")) {
          return 1;
      } else if (str.endsWith("II")) {
          return 2;
      } else {
        return 0;
      }
  }

  function handleKeyPress(event: React.KeyboardEvent, index: number) {
    // console.log("From handleKeyPress function: ", inputRefs.current[index]);
    if (
      event.key === "Enter" &&
      index < inputRefs.current.length - 1 &&
      inputRefs.current[index + 1]
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleInputChange(
    index: number,
    value: string,
    min: number,
    max: number
  ) {
    const newValues = [...analyteValues];
    newValues[index] = value;
    setAnalyteValues(newValues);
    // if (parseFloat(value) < min || parseFloat(value) > max) setIsValid(false);
    // setIsValid(
    //   newValues.every(
    //     (val) => {
    //       console.log("From handleInputChange function: " + parseFloat(val) + " " + (parseFloat(val) >= min && parseFloat(val) <= max))
    //       return (
    //         // !isNaN(parseFloat(val)) &&
    //         parseFloat(val) >= min &&
    //         parseFloat(val) <= max &&
    //         newValues.length === QCData?.analytes.length
    //       )
    //     }
    //   )
    // );
    
    // newValues.forEach(val => {
    if (
      isNaN(parseFloat(value)) ||
      parseFloat(value) < min ||
      parseFloat(value) > max ||
      typeof value === "undefined" 
      // newValues.length != data.length
    ) {
      // let newInvalidIndexes;
      if (!invalidIndexes) {
        let newInvalidIndexes = new Set<number>();
        newInvalidIndexes.add(index);
        setInvalidIndexes(newInvalidIndexes);
      }
      else {
        let newInvalidIndexes = new Set<number>(invalidIndexes);
        newInvalidIndexes.add(index);
        setInvalidIndexes(newInvalidIndexes);
      }
      
      // newInvalidIndexes.push(newValues.indexOf(val));
      // setInvalidIndexes(newInvalidIndexes);
    } else {
      let newInvalidIndexes = new Set<number>(invalidIndexes);
      newInvalidIndexes.delete(index);
      setInvalidIndexes(newInvalidIndexes);
    }
    // })
    setIsInputFull(newValues.length === QCData?.analytes.length && newValues.length > 0);
  }

  useEffect(() => {
    (async () => {
      const res = await getQCRangeByName(props.name);

      if (res) setQCData(res);
    })();
  }, [])

  useEffect(() => {
    console.log(invalidIndexes, invalidIndexArray, isValid)
  }, [analyteValues])

  return (
    <>
      <NavBar name={`${props.name} QC Results`} />
      {!QCData ? <div>No data recorded</div> : <></>}
      {QCData && <div
        className=" flex flex-col space-y-12 pb-8 justify-center px-[100px] relative"
        style={{ minWidth: "100svw", minHeight: "100svh" }}
      >
        <div className="analyte-list-container flex flex-wrap gap-14 sm:w-[90svw] sm:px-[149.5px] sm:mt-12 max-sm:flex-col mt-8 px-3">
          {QCData?.analytes.map((item, index) => (
            <div
              onKeyDown={(event) => {
                handleKeyPress(event, index);
              }}
              key={item.analyteName}
            >
              <Analyte
                name={item.analyteName}
                acronym={item.analyteAcronym}
                electro={item.electrolyte}
                min_level={+item.min_level}
                max_level={+item.max_level}
                level={detectLevel(props.name)}
                measUnit={item.unit_of_measure}
                handleInputChange={(val) => {
                    if (item.min_level != "" && item.max_level != "") {
                      // console.log("First condition");
                      handleInputChange(index, val, +item.min_level, +item.max_level)
                    }
                    else {
                      // console.log("Second condition")
                      handleInputChange(index, val, -1, 9999)
                    }
                  }
                }
                ref={(childRef: { inputRef: { current: HTMLInputElement | null }, nameRef: { current: HTMLDivElement | null } }) => {
                  // console.log(childRef);
                  if (childRef) {
                    inputRefs.current.push(childRef.inputRef.current as HTMLInputElement);
                    analyteNameRefs.current.push(childRef.nameRef.current as HTMLDivElement);
                  }
                }}
              />
            </div>
          ))}
        </div>
        <div className="analyte-control-container sm:w-[90svw] w-[100svw] flex justify-between max-sm:flex-col max-sm:w-[100%] max-sm:space-y-4">
          <Button className="shadow-lg sm:w-fit sm:h-[50px] sm:!px-4 !bg-[#DAE3F3] !text-black !font-semibold !border !border-solid !border-[#6781AF]">
            QC Function Overview
          </Button>
          <div className="sm:space-x-16 max-sm:w-full max-sm:space-y-4">
            <Button
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${
                isInputFull
                  ? "!bg-[#DAE3F3] !text-black"
                  : "!bg-[#AFABAB] !text-white"
              }`}
              disabled={!isInputFull}
              onClick={() => setIsModalOpen(true)}
            >
              Apply QC Comment
            </Button>
            <Button
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${
                isValid
                  ? "!bg-[#DAE3F3] !text-black"
                  : "!bg-[#AFABAB] !text-white"
              }`}
              disabled={!isValid}
            >
              Print QC
            </Button>
            <Button
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${
                isValid
                  ? "!bg-[#DAE3F3] !text-black"
                  : "!bg-[#AFABAB] !text-white"
              }`}
              disabled={!isValid}
             >
              Accept QC
            </Button>
          </div>
        </div>
        <div className="legends sm:absolute sm:bottom-4 sm:left-[35%] sm:space-y-4 sm:px-3 sm:py-2 border border-solid border-[#6781AF] relative max-sm:top-0">
          <div className="analyte-info flex sm:space-x-4">
            <div className="analyte-box sm:w-16 sm:h-8 bg-[#FFFF00] border border-solid border-[#6781AF]"/>
            <div className="analyte-text sm:h-full self-center">Electrolyte Element</div>
          </div>
          <div className="non-analyte-info flex sm:space-x-4">
            <div className="non-analyte-box sm:w-16 sm:h-8 bg-[#B4C7E7] border border-solid border-[#6781AF]" />
            <div className="non-analyte-text sm:h-full self-center">Non-Electrolyte Element</div>
          </div>
        </div>
      </div>}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className={`modal-conatiner absolute top-1/1 left-1/2 sm:w-[50svw] sm:h-[80svh] bg-[${theme.secondaryColor}] border-2 border-solid border-[#6781AF] rounded-xl sm:-translate-x-1/2 sm:translate-y-12 flex flex-col items-center sm:py-6 relative overflow-scroll sm:space-y-4`}>
          <div className="modal-title sm:text-2xl font-semibold">QC Comment</div>
          <div className="invalid-items sm:w-[80%]">
            {!invalidIndexArray || invalidIndexArray.length === 0 && <div className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2">No invalid items</div>}
            {invalidIndexArray && invalidIndexArray.length > 0 && (
              <>
                <div className="invalid-items-comments flex flex-col sm:space-y-6">
                  {invalidIndexArray.map(invalidItem => (
                    <div className="comment flex sm:space-x-12 h-fit" key={invalidItem}>
                      <div className="comment-name w-[5%] sm:text-xl font-semibold self-center" dangerouslySetInnerHTML={{ __html: renderSubString(analyteNameRefs.current[invalidItem].innerHTML) }} />
                      <textarea ref={el => console.log(el)} name="" id="" className="grow sm:h-16 p-1" required></textarea>
                    </div>
                  ))}
                  <ButtonBase className={`!rounded-lg sm!my-10 sm:!py-6 sm:!px-10 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] sm:w-1/2 self-center`}>Apply Comments</ButtonBase>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AnalyteInputPage;
