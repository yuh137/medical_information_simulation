import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import NavBar from "../../../components/NavBar";
import { useParams } from "react-router-dom";
import { panelTypeLinkList, renderSubString } from "../../../utils/utils";
import { Icon } from "@iconify/react";
import { CMPLevelList } from "../../../utils/utils";

interface PanelElement {
  analyteName: string;
  analyteAcronym: string;
  unitOfMeasure: string;
  minRefRange: string;
  maxRefRange: string;
  criticalHigh: string;
  criticalLow: string;
  abnormalHigh: string;
  abnormalLow: string;
}

const ChemistryOEBuilder = () => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [panelItems, setPanelItems] = useState<PanelElement[]>([]);

  const { link } = useParams();
  const title = panelTypeLinkList.find((panel) => panel.link === link)?.name;

  const inputRefs = useRef<HTMLInputElement[]>([]);

  function moveToNextInputOnEnter(e: React.KeyboardEvent) {
    if (
      e.key === "Enter" &&
      inputRefs.current.find((ele) => ele === e.target)
    ) {
      const currentFocus = inputRefs.current.find((ele) => ele === e.target);
      if (
        currentFocus &&
        inputRefs.current.indexOf(currentFocus) < inputRefs.current.length
      ) {
        const currentIndex = inputRefs.current.indexOf(currentFocus);
        inputRefs.current[currentIndex + 1]?.focus();
      } else return;
    }
  }

  function validateInputRange() {
    const minRefRangeInputArray = inputRefs.current.filter(
      (item) => inputRefs.current.indexOf(item) % 4 === 1
    );

    minRefRangeInputArray.forEach((item) => {
      if (
        +inputRefs.current[inputRefs.current.indexOf(item) + 1].value <
          +item.value ||
        item.value === "" ||
        (inputRefs.current[inputRefs.current.indexOf(item) + 1].value === "0" &&
          item.value === "0")
      ) {
        item.classList.remove("bg-green-500");
        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.remove(
          "bg-green-500"
        );
        item.classList.add("bg-red-500");
        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.add(
          "bg-red-500"
        );
      } else {
        // console.log("Item at index " + inputRefs.current.indexOf(item) + " is valid")
        item.classList.remove("bg-red-500");
        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.remove(
          "bg-red-500"
        );
        item.classList.add("bg-green-500");
        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.add(
          "bg-green-500"
        );
      }
    });

    setIsValid(
      !inputRefs.current.some((item) => item.classList.contains("bg-red-500"))
    );
  }

  useEffect(() => {
    setPanelItems(
      CMPLevelList.map((item) => ({
        analyteName: item.name,
        analyteAcronym: item.acronymName,
        unitOfMeasure: "",
        minRefRange: "",
        maxRefRange: "",
        criticalHigh: "",
        criticalLow: "",
        abnormalHigh: "",
        abnormalLow: "",
      }))
    );
  }, []);

  return (
    <>
      <NavBar name={`Chemistry ${title}`} />
      <div className="table-container flex flex-col sm:mt-8 sm:w-[94svw] sm:max-h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA] relative">
        <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200">
          <TableHeader>
            <TableRow className="font-bold text-base bg-[#3A62A7] hover:bg-[#3A62A7] top-0 sticky z-20">
              <TableHead className="text-white text-center sm:w-56">
                Analyte
              </TableHead>
              <TableHead className="text-white text-center">
                Abreviation
              </TableHead>
              <TableHead className="text-white text-center">
                Unit Of Measure
              </TableHead>
              <TableHead className="text-white text-center">
                Min Ref Range
              </TableHead>
              <TableHead className="text-white text-center">
                Max Ref Range
              </TableHead>
              <TableHead className="text-white text-center sm:w-36">
                <div className="flex items-center justify-center sm:gap-2">
                  <div className="border border-solid border-white p-1 rounded-sm text-red-500 bg-yellow-300">
                    <Icon icon="carbon:triangle-solid" />
                  </div>
                  <div>Critical High</div>
                </div>
              </TableHead>
              <TableHead className="text-white text-center sm:w-36">
                <div className="flex items-center justify-center sm:gap-2">
                  <div className="border border-solid border-white p-1 rounded-sm text-red-500 bg-yellow-300">
                    <Icon icon="carbon:triangle-down-solid" />
                  </div>
                  <div>Critical Low</div>
                </div>
              </TableHead>
              <TableHead className="text-white text-center sm:w-36">
                <div className="flex items-center justify-center sm:gap-2">
                  <div className="border border-solid border-white rounded-sm text-red-500 bg-yellow-300">
                    <Icon icon="mdi:arrow-up-bold" className="text-2xl" />
                  </div>
                  <div>Abnormal High</div>
                </div>
              </TableHead>
              <TableHead className="text-white text-center sm:w-36">
                <div className="flex items-center justify-center sm:gap-2">
                  <div className="border border-solid border-white rounded-sm text-red-500 bg-yellow-300">
                    <Icon icon="mdi:arrow-down-bold" className="text-2xl" />
                  </div>
                  <div>Abnormal Low</div>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // Validate if all the input fall under constraints
                //   validateInputRange();

                  // Move cursor to next input field
                  moveToNextInputOnEnter(e);
                }
            }}
          >
            {panelItems.map((row, index) => (
              <TableRow key={index} className="text-center">
                <TableCell>{row.analyteName}</TableCell>
                <TableCell
                  dangerouslySetInnerHTML={{
                    __html: renderSubString(row.analyteAcronym),
                  }}
                />
                <TableCell className="unitOfMeasure">
                  <input
                    type="text"
                    className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center"
                    ref={(el) => {
                      if (
                        el &&
                        inputRefs.current.length < panelItems.length * 7
                      ) {
                        inputRefs.current[index * 7] = el;
                      }
                    }}
                    value={
                      row.unitOfMeasure === ""
                        ? ""
                        : row.unitOfMeasure.toString()
                    }

                    onChange={(e) => {
                        e.preventDefault();

                        setPanelItems((prevState) => {
                            const newState = prevState.map((item) => {
                                if (
                                    item.analyteName === row.analyteName &&
                                    /^[a-zA-Z\u0370-\u03FF\/% ]+$/.test(e.target.value)
                                )
                                    return {
                                        ...item,
                                        unitOfMeasure: e.target.value,
                                    };
                                else return item;
                            });

                            return newState;
                        });
                    }}
                  />
                </TableCell>
                <TableCell className="minRefRange">
                  <input
                    type="text"
                    className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center"
                    ref={(el) => {
                      if (
                        el &&
                        inputRefs.current.length < panelItems.length * 7
                      ) {
                        inputRefs.current[index * 7 + 1] = el;
                      }
                    }}
                    value={
                      row.minRefRange === ""
                        ? ""
                        : row.minRefRange.toString()
                    }

                    onChange={(e) => {
                        e.preventDefault();

                        setPanelItems((prevState) => {
                            const newState = prevState.map((item) => {
                                if (
                                    item.analyteName === row.analyteName &&
                                    /^\d*\.?\d*$/.test(e.target.value)
                                )
                                    return {
                                        ...item,
                                        minRefRange: e.target.value,
                                    };
                                else return item;
                            });

                            return newState;
                        });
                    }}
                  />
                </TableCell>
                <TableCell className="maxRefRange">
                  <input
                    type="text"
                    className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center"
                    ref={(el) => {
                      if (
                        el &&
                        inputRefs.current.length < panelItems.length * 7
                      ) {
                        inputRefs.current[index * 7 + 2] = el;
                      }
                    }}
                    value={
                      row.maxRefRange === ""
                        ? ""
                        : row.maxRefRange.toString()
                    }

                    onChange={(e) => {
                        e.preventDefault();

                        setPanelItems((prevState) => {
                            const newState = prevState.map((item) => {
                            if (
                                item.analyteName === row.analyteName &&
                                /^\d*\.?\d*$/.test(e.target.value)
                            )
                                return {
                                    ...item,
                                    maxRefRange: e.target.value,
                                };
                            else return item;
                            });

                            return newState;
                        });
                    }}
                  />
                </TableCell>
                
                <TableCell className="criticalHigh">
                  <input
                    type="text"
                    className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center"
                    ref={(el) => {
                        if (
                            el &&
                            inputRefs.current.length < panelItems.length * 7
                        ) {
                            inputRefs.current[index * 7 + 3] = el;
                        }
                    }}
                    value={
                        row.criticalHigh === ""
                            ? ""
                            : row.criticalHigh.toString()
                    }
  
                    onChange={(e) => {
                        e.preventDefault();

                        setPanelItems((prevState) => {
                            const newState = prevState.map((item) => {
                            if (
                                item.analyteName === row.analyteName &&
                                /^\d*\.?\d*$/.test(e.target.value)
                            )
                                return {
                                    ...item,
                                    criticalHigh: e.target.value,
                                };
                            else return item;
                            });

                            return newState;
                        });
                    }}
                  />
                </TableCell>
                <TableCell className="criticalLow">
                  <input
                    type="text"
                    className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center"
                    ref={(el) => {
                        if (
                            el &&
                            inputRefs.current.length < panelItems.length * 7
                        ) {
                            inputRefs.current[index * 7 + 4] = el;
                        }
                    }}
                    value={
                        row.criticalLow === ""
                            ? ""
                            : row.criticalLow.toString()
                    }
  
                    onChange={(e) => {
                        e.preventDefault();

                        setPanelItems((prevState) => {
                            const newState = prevState.map((item) => {
                            if (
                                item.analyteName === row.analyteName &&
                                /^\d*\.?\d*$/.test(e.target.value)
                            )
                                return {
                                    ...item,
                                    criticalLow: e.target.value,
                                };
                            else return item;
                            });

                            return newState;
                        });
                    }}
                  />
                </TableCell>
                <TableCell className="abnormalHigh">
                  <input
                    type="text"
                    className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center"
                    ref={(el) => {
                        if (
                            el &&
                            inputRefs.current.length < panelItems.length * 7
                        ) {
                            inputRefs.current[index * 7 + 5] = el;
                        }
                    }}
                    value={
                        row.abnormalHigh === ""
                            ? ""
                            : row.abnormalHigh.toString()
                    }
  
                    onChange={(e) => {
                        e.preventDefault();

                        setPanelItems((prevState) => {
                            const newState = prevState.map((item) => {
                            if (
                                item.analyteName === row.analyteName &&
                                /^\d*\.?\d*$/.test(e.target.value)
                            )
                                return {
                                    ...item,
                                    abnormalHigh: e.target.value,
                                };
                            else return item;
                            });

                            return newState;
                        });
                    }}
                  />
                </TableCell>
                <TableCell className="abnormalLow">
                  <input
                    type="text"
                    className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center"
                    ref={(el) => {
                        if (
                            el &&
                            inputRefs.current.length < panelItems.length * 7
                        ) {
                            inputRefs.current[index * 7 + 6] = el;
                        }
                    }}
                    value={
                        row.abnormalLow === ""
                            ? ""
                            : row.abnormalLow.toString()
                    }
  
                    onChange={(e) => {
                        e.preventDefault();

                        setPanelItems((prevState) => {
                            const newState = prevState.map((item) => {
                            if (
                                item.analyteName === row.analyteName &&
                                /^\d*\.?\d*$/.test(e.target.value)
                            )
                                return {
                                    ...item,
                                    abnormalLow: e.target.value,
                                };
                            else return item;
                            });

                            return newState;
                        });
                    }}
                  />
                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ChemistryOEBuilder;
