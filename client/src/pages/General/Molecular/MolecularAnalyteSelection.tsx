import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getAllDataFromStore } from '../../../utils/indexedDB/getData';
import { QCTemplateBatch } from '../../../utils/indexedDB/IDBSchema';
import NavBar from '../../../components/NavBar';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface AnalyteData {
    closedDate: string;
    value: number;
    mean: number;
    stdDevi: number;
    analyteName: string;
    minLevel: number;
    maxLevel: number;
  }  

const MolecularAnalyteSelection = () => {
  const { fileName, lotNumber, analyteName } = useParams<{ fileName: string; lotNumber: string; analyteName: string }>();
  const [analyteData, setAnalyteData] = useState<AnalyteData[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedQC = searchParams.get('qcName'); 

  useEffect(() => {
    const fetchAnalyteData = async () => {
      try {
        const data = (await getAllDataFromStore('qc_store')) as unknown as QCTemplateBatch[];

        const matchingRecords = data.filter(
          (item) => item.fileName === fileName && item.lotNumber === lotNumber
        );

        const analyteValues = matchingRecords.map((record) => {
          const analyte = record.analytes.find((a) => a.analyteName === analyteName);
          if (analyte) {
            return {
              closedDate: record.closedDate,
              value: analyte.value ? parseFloat(analyte.value) : parseFloat(analyte.mean),
              mean: parseFloat(analyte.mean),
              stdDevi: parseFloat(analyte.stdDevi),
              analyteName: analyte.analyteName,
              minLevel: parseFloat(analyte.minLevel),  
              maxLevel: parseFloat(analyte.maxLevel),  
            };
          }
          return null;
        }).filter((d): d is AnalyteData => d !== null); 

        setAnalyteData(analyteValues);
    } catch (error) {
        console.error("Error fetching analyte data: ", error);  
      }
    };

    fetchAnalyteData();
  }, [fileName, lotNumber, analyteName]);

  const analytes = useMemo(() => 
    analyteData.filter((analyte) => analyte.analyteName === selectedQC), 
    [selectedQC, analyteData]
 );

  const [selectedAnalyteId, setSelectedAnalyteId] = useState(null);
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(''); 

  const handleRowClick = (analyteId: any) => {
    setSelectedAnalyteId(analyteId);
  };

  const handleQualitativeAnalysis = () => {
    if (selectedAnalyteId) {
      setOpenDateDialog(true);
    } else {
      alert('Please select an analyte first!');
    }
  };

  const handleContinue = () => {
    if (startDate && endDate) {
      const selectedAnalyte = analytes.find((analyte) => analyte.analyteName === selectedAnalyteId);
      navigate(`/molecular/qc_analysis/${selectedAnalyteId}`);
      setOpenDateDialog(false);
      setStartDate('');
      setEndDate('');
    } else {
      alert('Please enter valid start and end dates!');
    }
  };

  return (
    <>
      <NavBar name = "Review Controls: Molecular"/>

      <div className="relative">

        <h2 className="text-3xl font-bold mt-6 text-center"> QC: {fileName} </h2>

        <div className="table-container flex flex-col mt-8 sm:max-w-[75svw] sm:max-h-[75svh] sm:mx-auto w-full bg-[#CFD5EA]">
          <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200">
            <TableHeader>
              <TableRow className="font-bold text-3xl bg-[#3A62A7] sticky top-0">
                <TableCell className="text-white text-center">Analyte</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytes.map((analyte, index) => (
                <TableRow key={index} onClick={() => handleRowClick(index)}
                className={`text-center hover:cursor-pointer ${selectedAnalyteId === index ? 'bg-[#C3D1E0]' : 'bg-[#E9EBF5]'}`}
                style={{
                  color: "#000",
                  fontSize: "18px",
                  padding: "10px 20px",
                }}><TableCell className={`${selectedAnalyteId === index ? 'font-bold' : ''}`}>{analyte.analyteName}</TableCell>
                </TableRow>
              ))}
              </TableBody>
          </Table>
        </div>

        <div className="absolute bottom-3 right-3 flex space-x-4"> 
          <Button variant="contained" style={{
              backgroundColor: '#3A62A7',
              color: 'white',
              padding: '15px 40px', 
              fontSize: '18px',
              borderRadius: '20px', }}
            onClick={handleQualitativeAnalysis}>Qualitative Analysis</Button>

          <Button variant="contained" style={{
              backgroundColor: '#3A62A7',
              color: 'white',
              padding: '15px 40px', 
              fontSize: '18px',
              borderRadius: '20px',}}
            onClick={() => navigate('/molecular/levey-jennings')}>Levey-Jennings</Button>
        </div>

        <Dialog open={openDateDialog} onClose={() => setOpenDateDialog(false)}>
          <DialogTitle>Date Range Selection</DialogTitle>
          <DialogContent>
          <td style={{ textAlign: 'center', padding: '10px' }}>
            <input
              type="text"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="MM/DD/YYYY"
              aria-label="Start Date"
              style={{ textAlign: 'center', width: '100%' }}
            />
          </td>
          <td style={{ textAlign: 'center', padding: '10px' }}>
            <input
              type="text"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="MM/DD/YYYY"
              aria-label="End Date"
              style={{ textAlign: 'center', width: '100%' }}
            />
          </td>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleContinue}>Continue</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default MolecularAnalyteSelection;