import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getAllDataFromStore } from '../../../utils/indexedDB/getData';
import { MolecularQCTemplateBatch, MolecularQCTemplateBatchAnalyte } from '../../../utils/indexedDB/IDBSchema';
import NavBar from '../../../components/NavBar';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const MolecularAnalyteSelection = () => {
  const [analytes, setAnalytes] = useState<MolecularQCTemplateBatchAnalyte[]>([]);
  const [selectedAnalyteId, setSelectedAnalyteId] = useState<string>('');
  const [selectedAnalyteIndex, setSelectedAnalyteIndex] = useState<number | null>(null);
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(''); 
  const [panelName, setPanelName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedQCData = localStorage.getItem("selectedQCData");
    if (storedQCData) {
      const qcData = JSON.parse(storedQCData) as MolecularQCTemplateBatch;
      console.log(qcData);

      setAnalytes(qcData.analytes);
      setPanelName(qcData.fileName);
    } else {
      console.error("No QC data found.");
    }
  }, []);

  const handleRowClick = (analyte: MolecularQCTemplateBatchAnalyte, index: number) => {
    setSelectedAnalyteId(analyte.analyteName);
    setSelectedAnalyteIndex(index);
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
      navigate(`/molecular/qc_analysis/${encodeURIComponent(selectedAnalyteId)}/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`);
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
        <h2 className="text-3xl font-bold mt-6 text-center"> QC: {panelName} </h2>
        <div className="table-container flex flex-col mt-8 sm:max-w-[75svw] sm:max-h-[75svh] sm:mx-auto w-full bg-[#CFD5EA]">
          <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200">
            <TableHeader>
              <TableRow className="font-bold text-3xl bg-[#3A62A7] sticky top-0">
                <TableCell className="text-white text-center">Analyte</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytes.map((analyte, index) => (
                <TableRow key={index} onClick={() => handleRowClick(analyte, index)}
                className={`text-center hover:cursor-pointer ${selectedAnalyteIndex === index ? 'bg-[#C3D1E0]' : 'bg-[#E9EBF5]'}`}
                style={{
                  color: "#000",
                  fontSize: "18px",
                  padding: "10px 20px",
                }}><TableCell className={`${selectedAnalyteIndex === index ? 'font-bold' : ''}`}>{analyte.analyteName}</TableCell>
                </TableRow>
              ))}
              </TableBody>
          </Table>
        </div>
        {/**absolute bottom-3 right-3 flex space-x-4*/}
        <div className="flex items-center justify-center space-x-2 py-4"> 
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
          <table>
            <tbody>
              <tr>
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
              </tr>
            </tbody>
          </table>
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
