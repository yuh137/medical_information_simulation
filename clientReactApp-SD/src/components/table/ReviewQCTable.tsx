import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import { v4 as uuidv4 } from 'uuid';
import { getAccountData } from '../../util/indexedDB/getData';
import { Admin, Student } from '../../util/indexedDB/IDBSchema';

const submissionColumns: GridColDef[] = [
  { field: 'id', headerName: 'QC Report ID', width: 150 },
  { field: 'submittedAt', headerName: 'Submitted At', width: 300 },
  {
    field: 'viewReport',
    headerName: 'View Report',
    width: 150,
    renderCell: (params) => (
      <Button
        variant="contained"
        onClick={() => params.row.onViewReport(params.row.id)}
      >
        View
      </Button>
    ),
  },
  {
    field: 'submitReport',
    headerName: 'Submit Report',
    width: 200,
    renderCell: (params) => (
      <Button
        variant="contained"
        onClick={() => params.row.onSubmitReport(params.row.id)}
      >
        Submit
      </Button>
    ),
  },
];

const getSubmittedItemsFromLocalStorage = () => {
  const storedSubmissions = localStorage.getItem('SubmittedQCs');
  if (storedSubmissions) {
    try {
      const submissions = JSON.parse(storedSubmissions);

      const persistedIds = JSON.parse(localStorage.getItem('SubmissionIDs') || '{}');
      const updatedIds = { ...persistedIds };

      const mappedSubmissions = submissions.map((submission: any) => {
        const key = submission.submittedAt;
        if (!updatedIds[key]) {
          updatedIds[key] = uuidv4();
        }
        return {
          id: updatedIds[key],
          submittedAt: new Date(submission.submittedAt).toLocaleString(),
          panels: submission.items || [],
        };
      });

      localStorage.setItem('SubmissionIDs', JSON.stringify(updatedIds));

      return mappedSubmissions;
    } catch (error) {
      console.error('Error parsing SubmittedQCs:', error);
      return [];
    }
  }
  return [];
};

async function fetchUserName(): Promise<string> {
  const accountData = await getAccountData();
  if (accountData && Array.isArray(accountData) && accountData.length > 0) {
    const user = accountData[0] as Admin | Student;
    return `${user.firstname} ${user.lastname}`;
  }
  return 'User';
}

export default function ReviewQCTable() {
  const [userName, setUserName] = useState<string>('User');
  const [submissions, setSubmissions] = useState(getSubmittedItemsFromLocalStorage());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState('yes');
  const [profEmail, setProfEmail] = useState('');

  useEffect(() => {
    async function fetchName() {
      const name = await fetchUserName();
      setUserName(name);
    }
    fetchName();
  }, []);

  const handleViewReport = (id: string) => {
    window.open(`/editreportpage?id=${id}`, '_blank');
  };

  const handleSubmitReport = (id: string) => {
    setSelectedReportId(id);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedReportId(null);
    setSelectedOption('yes');
    setProfEmail('');
  };

  const handleFormSubmit = () => {
    console.log({
      reportId: selectedReportId,
      decision: selectedOption,
      profEmail,
    });
    handleDialogClose();
  
    if (selectedReportId) {
      window.open(`/reviewSubmission/${selectedReportId}`, '_blank');
    } else {
      console.error("No report ID selected.");
    }
  };
  
  return (
    <Paper sx={{ padding: 2, marginTop: 4 }}>
      <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
        Review and Submit Reports
      </Typography>
      <DataGrid
        rows={submissions.map((submission) => ({
          ...submission,
          onViewReport: handleViewReport,
          onSubmitReport: handleSubmitReport,
        }))}
        columns={submissionColumns}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Submit Report</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <FormControlLabel value="LJennings" control={<Radio />} label="Levvy-Jennings" />
              <FormControlLabel value="Qualitatives" control={<Radio />} label="Qualitative" />
            </RadioGroup>
          </FormControl>
          <TextField
            fullWidth
            label="Professor Email"
            rows={4}
            value={profEmail}
            onChange={(e) => setProfEmail(e.target.value)}
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleFormSubmit}>
            Submit to Professor
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
