import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MolecularQCTemplateBatch } from  '../../../utils/indexedDB/IDBSchema';


const SimpleMolecularAnalyteInputPage = () => {
  const [qcData, setQcData] = useState<MolecularQCTemplateBatch | null>(null);

  useEffect(() => {
    const storedQCData = localStorage.getItem('selectedQCData');
    if (storedQCData) {
      setQcData(JSON.parse(storedQCData));
    } else {
      console.error("No QC data found.");
    }
  }, []);

  return (
    <>
    </>
  );
};

export default SimpleMolecularAnalyteInputPage;
