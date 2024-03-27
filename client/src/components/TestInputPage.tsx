import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CompactTable } from "@table-library/react-table-library/compact";
import NavBar from "./NavBar";
import {
  ColumnDef,
  RowData,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { mock } from "../utils/MOCK_DATA";
import { renderSubString } from "../utils/utils";
import { ButtonBase } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTheme } from "../context/ThemeContext";

interface QCRangeElements {
  analyteName: string;
  analyteAcronym: string;
  unit_of_measure: string;
  min_level: number;
  max_level: number;
  mean: number;
  std_devi: number;
  sdplus1: number;
  sdplus2: number;
  sdplus3: number;
  sdminus1: number;
  sdminus2: number;
  sdminus3: number;
}



const TestInputPage = (props: { name: string; link: string }) => {
  const navigate = useNavigate();
  const { checkSession, checkUserType, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const [QCElements, setQCElements] = useState<QCRangeElements[]>(mock);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const columns: ColumnDef<QCRangeElements, string>[] = [
    {
      accessorKey: "analyteName",
      header: "Name",
      cell: (info) => (
        <div>{info.getValue()}</div>
      ),
    },
    {
      accessorKey: "analyteAcronym",
      header: "Abbreviation",
      cell: (info) => (
        <div
          dangerouslySetInnerHTML={{ __html: renderSubString(info.getValue()) }}
        />
      ),
    },
    {
      accessorKey: "unit_of_measure",
      header: "Units of Measure",
      cell: (info) => (
        // <input type="text" className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center" value={QCElements.find((item) => item.unit_of_measure === info.getValue())?.unit_of_measure || ''} onChange={(e) => { 
        //     e.preventDefault();

        //     setQCElements(prevState => {
        //         const newState = prevState.map(item => {
        //             if (item.analyteName === info.row.getAllCells().find(subItem => subItem.id.includes("analyteName"))?.getValue())
        //                 return { ...item, unit_of_measure: e.target.value }
        //             else return item
        //         })

        //         return newState
        //     })
        // }}/>
        <></>
      ),
    },
    {
      accessorKey: "min_level",
      header: "Min Level",
      cell: (info) => <></>,
    },
    {
      accessorKey: "max_level",
      header: "Max Level",
      cell: (info) => <></>,
    },
    {
      accessorKey: "mean",
      header: "QC Mean",
      cell: (info) => <></>,
    },
    {
      accessorKey: "std_devi",
      header: "Standard Deviation",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdplus1",
      header: "+1 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdminus1",
      header: "-1 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdplus2",
      header: "+2 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdminus2",
      header: "-2 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdplus3",
      header: "+3 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdminus3",
      header: "-3 SD",
      cell: (info) => <></>,
    },
  ];

  const table = useReactTable({
    data: useMemo(() => QCElements, [QCElements]),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (!checkSession() || checkUserType() === "student")
      navigate("/unauthorized");
  }, []);

  useEffect(() => {
    console.log(inputRefs);
  }, [inputRefs]);

  return (
    <>
      <div
        className={`bg-[${theme.primaryColor}] relative`}
        style={{ minWidth: "100svw", minHeight: "10svh" }}
      >
        <div className="navbar-title sm:leading-loose text-center text-white font-bold sm:text-4xl text-3xl my-0 mx-auto max-sm:w-1/2 max-sm:leading-10">
          {props.name} QC Builder
        </div>
        <div className="home-icon">
          <Link to="/home">
            <Icon
              icon="material-symbols:home"
              className="absolute p-1 text-white text-5xl top-[20%] right-16 hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md"
            />
          </Link>
        </div>
        {isAuthenticated && (
          <div className="logout-icon">
            <Icon icon="mdi:logout" className="absolute text-white sm:text-5xl self-center sm:right-4 sm:top-4 hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md p-1" onClick={() => {
              logout();
              navigate("/login");
            }}/>
          </div>
        )}
      </div>
      <div className="basic-container relative sm:space-y-4 pb-24">
        <div className="table-container flex flex-col mt-8 sm:w-[90svw] sm:h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA] relative">
          <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200">
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow
                  key={group.id}
                  className="font-bold text-base bg-[#3A62A7] hover:bg-[#3A62A7] sticky top-0"
                >
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-white text-center"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
              {/* <TableRow className="font-bold text-base bg-[#3A62A7] hover:bg-[#3A62A7] sticky">
                <TableHead className="sm:w-60 text-center text-white text-lg">Name</TableHead>
                <TableHead className="sm:w-48 text-center text-white text-lg">Abbreviation</TableHead>
                <TableHead className="sm:w-48 text-center text-white text-lg">Units of Measure</TableHead>
              </TableRow> */}
            </TableHeader>
            <TableBody>
              {!table.getRowModel().rows?.length ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="sm:h-32 !p-2 text-center"
                  >
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                <></>
              )}
              {/* {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="text-center sm:h-[10%] border-none"
                  onClick={() => console.log(row.getVisibleCells().find(cell => cell.id.includes("analyteName"))?.getValue())}
                >
                  <TableCell>
                    <div>{row.getVisibleCells().find(cell => cell.id.includes("analyteName"))?.getValue<string>()}</div>
                  </TableCell>
                  <TableCell>
                    <input type="text" className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center" value={QCElements.find(item => item.analyteName === row.getVisibleCells().find(cell => cell.id.includes("analyteName"))?.getValue())?.analyteAcronym || ""} onChange={(e) => {
                      e.preventDefault();

                      setQCElements(prevState => {
                          const newState = prevState.map(item => {
                              if (item.analyteName === row.getAllCells().find(subItem => subItem.id.includes("analyteName"))?.getValue())
                                  return { ...item, analyteAcronym: e.target.value }
                              else return item
                          })
          
                          return newState
                      })
                    }}/>
                  </TableCell>
                  
                </TableRow>
              ))} */}
              {/* {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="text-center sm:h-[10%] border-none"
                  onClick={() => console.log(row.getVisibleCells().find(cell => cell.id.includes("analyteName"))?.getValue())}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  
                </TableRow>
              ))} */}
              {QCElements.map(row => (
                <TableRow key={row.analyteName} className="text-center sm:h-[10%] border-none">
                  <TableCell>
                    <div>{row.analyteName}</div>
                  </TableCell>
                  <TableCell>
                    <div dangerouslySetInnerHTML={{ __html: renderSubString(row.analyteAcronym) }} />
                  </TableCell>
                  <TableCell>
                    <input ref={el => {if (el) {inputRefs.current.push(el)}}} type="text" className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center" value={row.unit_of_measure || ""} onChange={(e) => {
                      e.preventDefault();

                      setQCElements(prevState => {
                          const newState = prevState.map(item => {
                              if (item.analyteName === row.analyteName && /^[a-zA-Z]+$/.test(e.target.value))
                                  return { ...item, unit_of_measure: e.target.value }
                              else return item
                          })
          
                          return newState
                      })
                    }}/>
                  </TableCell>
                  <TableCell>
                    <input type="text" ref={el => {if (el) {inputRefs.current.push(el)}}} className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center" value={row.min_level || ""} onChange={(e) => {
                      e.preventDefault();

                      setQCElements(prevState => {
                          const newState = prevState.map(item => {
                              if (item.analyteName === row.analyteName && /^\d*\.?\d*$/.test(e.target.value))
                                  return { ...item, min_level: +e.target.value }
                              else return item
                          })
          
                          return newState
                      })
                    }}/>
                  </TableCell>
                  <TableCell>
                    <input type="text" ref={el => {if (el) {inputRefs.current.push(el)}}} className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center" value={row.max_level || ""} onChange={(e) => {
                      e.preventDefault();

                      setQCElements(prevState => {
                          const newState = prevState.map(item => {
                              if (item.analyteName === row.analyteName && /^\d*\.?\d*$/.test(e.target.value))
                                  return { ...item, max_level: +e.target.value }
                              else return item
                          })
          
                          return newState
                      })
                    }}/>
                  </TableCell>
                  <TableCell className="mean">
                    <div>{Math.ceil((row.min_level + row.max_level)/2)}</div>
                  </TableCell>
                  <TableCell className="standard-deviation sm:w-32">
                    <div>{Math.ceil((row.max_level - row.min_level)/4)}</div>
                  </TableCell>
                  <TableCell className="sd+1">
                    <div>{Math.ceil((row.min_level + row.max_level)/2) + Math.ceil((row.max_level - row.min_level)/4)}</div>
                  </TableCell>
                  <TableCell className="sd-1">
                    <div>{Math.ceil((row.min_level + row.max_level)/2) - Math.ceil((row.max_level - row.min_level)/4)}</div>
                  </TableCell>
                  <TableCell className="sd+2">
                    <div>{Math.ceil((row.min_level + row.max_level)/2) + Math.ceil((row.max_level - row.min_level)/4) * 2}</div>
                  </TableCell>
                  <TableCell className="sd-2">
                    <div>{Math.ceil((row.min_level + row.max_level)/2) - Math.ceil((row.max_level - row.min_level)/4) * 2}</div>
                  </TableCell>
                  <TableCell className="sd+3">
                    <div>{Math.ceil((row.min_level + row.max_level)/2) + Math.ceil((row.max_level - row.min_level)/4) * 3}</div>
                  </TableCell>
                  <TableCell className="sd-3">
                    <div>{Math.ceil((row.min_level + row.max_level)/2) - Math.ceil((row.max_level - row.min_level)/4) * 3}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ButtonBase className="save-button !absolute left-1/2 -translate-x-1/2 sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold">
          Save QC File
        </ButtonBase>
      </div>
    </>
  );
};

export default TestInputPage;
