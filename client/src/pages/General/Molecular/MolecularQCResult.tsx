import NavBar from "../../../components/NavBar";
import React, { useState, useEffect } from "react";
import { getAllDataByFileName, getQCRangeByDetails } from "../../../utils/indexedDB/getData";
import {
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel
} from "@tanstack/react-table";
import { DEBUG_add_molecular_data_to_idb } from "../../../utils/DNALYTICS_DEBUG_UTIL";

interface QCItem {
  fileName: string;
  department: string;
}

const columns: ColumnDef<QCItem>[] = [
  {
    accessorKey: "department",
    header: () => <span>Department</span>,
    cell: info => info.getValue(),
  },
  {
    accessorKey: "fileName",
    header: () => <span>Test Name</span>,
    cell: info => info.getValue(),
  },
];

const MolecularQCResult = () => {
  const [qcData, setQcData] = useState<QCItem[]>([]);

  const fetchQCData = async () => {
// TODO(colby): DEBUG
    //insert all from localstorage
    const QCPanels = ['GI Panel Level I', 'GI Panel Level II', 'Respiratory Panel Level I', 'Respiratory Panel Level II', 'STI-PCR Panel Level I', 'STI-PCR Panel Level II', 'HIV Real-Time PCR Panel: Negative Control', 'HIV Real-Time PCR Panel: Low Control'];
    localStorage.setItem('selectedQCItems', JSON.stringify(QCPanels));
    //insert into idb at qc_store 
    await DEBUG_add_molecular_data_to_idb(QCPanels);
//
    console.log("Fetching QC data...");
    const selectedQCs: string[] = JSON.parse(localStorage.getItem('selectedQCItems') || '[]');
    const allDataPromises = selectedQCs.map(qcName => getAllDataByFileName("qc_store", qcName));
    const results = await Promise.all(allDataPromises);
    setQcData(results.flat());
    console.log("Fetched QC data:", results.flat());
  };
  
  useEffect(() => {

    fetchQCData();
  }, []);

  return (
    <>
      <NavBar name={`Molecular QC Results`} />
    </>
  );
};

export default MolecularQCResult;
