import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Admin, Student } from '../../util/indexedDB/IDBSchema';
import { getAccountData } from '../../util/indexedDB/getData';


//Grab user sname from table created at sign in.
async function fetchUserName(): Promise<string> {
  const accountData = await getAccountData();
  if (accountData && Array.isArray(accountData) && accountData.length > 0) {
    const user = accountData[0] as Admin | Student;
    return `${user.firstname} ${user.lastname}`;
  }
  return 'doos';
}


const submissionColumns: GridColDef[] = [
  { field: 'id', headerName: 'QC Report ID', width: 150 },
  { field: 'issuer', headerName: 'Student Name', width: 150 },
  { field: 'submittedAt', headerName: 'Submitted At', width: 200 },
  { field: 'AdminQCLotID', headerName: 'Admin QC Lot ID', width: 200 },
  { field: 'LotNumber', headerName: 'Lot Number', width: 150 },
  { field: 'OpenDate', headerName: 'Open Date', width: 200 },
  { field: 'Department', headerName: 'Department', width: 150 },
  { field: 'ExpirationDate', headerName: 'Expiration Date', width: 200 },
  { field: 'FileDate', headerName: 'File Date', width: 200 },
  { field: 'QCName', headerName: 'QC Name', width: 200 },
  { field: 'IsActive', headerName: 'Is Active', width: 100 },
  {
    field: 'view',
    headerName: 'Details',
    width: 150,
    renderCell: (params) => (
      <Button variant="contained" onClick={() => params.row.onView(params.row.id)}>
        View Details
      </Button>
    ),
  },
];

const detailColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'input',
    headerName: 'Select QC Orders to Edit',
    width: 200,
    renderCell: (params) => (
      <Button variant="contained" onClick={() => { handleInputAnalyte(params.row.id); }}>
        Edit Analyte Values
      </Button>
    ),
  },
  {
    field: 'review',
    headerName: 'Review',
    width: 200,
    renderCell: (params) => (
      <Button variant="contained" onClick={() => { handleInputAnalyte(params.row.id); }}>
        Review QC Panel
      </Button>
    ),
  },
];

// Fetch data from local storage
const getSubmittedItemsFromLocalStorage = () => {
  const storedSubmissions = localStorage.getItem('SubmittedQCs');
  if (storedSubmissions) {
    try {
      return JSON.parse(storedSubmissions).map((submission: any, index: number) => ({
        id: index + 1,
        issuer: submission.issuer || 'Unknown',
        submittedAt: new Date(submission.submittedAt).toLocaleString(),
        AdminQCLotID: submission.AdminQCLotID || 'N/A',
        LotNumber: submission.LotNumber || 'N/A',
        OpenDate: submission.OpenDate ? new Date(submission.OpenDate).toLocaleString() : 'N/A',
        Department: submission.Department || 'N/A',
        ExpirationDate: submission.ExpirationDate ? new Date(submission.ExpirationDate).toLocaleDateString() : 'N/A',
        FileDate: submission.FileDate ? new Date(submission.FileDate).toLocaleString() : 'N/A',
        QCName: submission.QCName || 'N/A',
        IsActive: submission.IsActive ? 'Yes' : 'No',
        onView: (id: number) => {},
      }));
    } catch (error) {
      console.error('Error parsing SubmittedQCs:', error);
      return [];
    }
  }
  return [];
};

const handleInputAnalyte = (id: number) => {
  console.log(`Input analyte values for row with ID: ${id}`);
};

export default function SubmittedQCTable() {
  const [userName, setUserName] = useState<string>('User');
  const [submissions, setSubmissions] = React.useState(getSubmittedItemsFromLocalStorage());
  const [openDialog, setOpenDialog] = React.useState(false);
  const [details, setDetails] = React.useState([]);

  // Fetch the user's name from IndexedDB on component mount
  useEffect(() => {
    async function fetchName() {
      const name = await fetchUserName();
      setUserName(name);
    }
    fetchName();
  }, []);



  const handleViewDetails = (id: number) => {
    const storedSubmissions = JSON.parse(localStorage.getItem('SubmittedQCs') || '[]');
    setDetails(storedSubmissions[id - 1]?.items || []);
    setOpenDialog(true);
  };

  return (
    <Paper sx={{ padding: 2, marginTop: 4 }}>
      <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
        Ordered Quality Control Reports in Progress
      </Typography>
      <DataGrid
        rows={submissions.map((submission: any) => ({
          ...submission,
          onView: handleViewDetails,
        }))}
        columns={submissionColumns}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{ style: { minHeight: '80vh' } }}
      >
        <DialogTitle>QC Submission Details</DialogTitle>
        <DialogContent>
          <DataGrid
            rows={details.map((item, index) => ({ ...item, id: index + 1 }))}
            columns={detailColumns}
            autoHeight
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
