import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const submissionColumns: GridColDef[] = [
  { field: 'id', headerName: 'QC Report ID', width: 150 },
  { field: 'issuer', headerName: 'Student Name', width: 150 },
  { field: 'submittedAt', headerName: 'Submitted At', width: 300 },
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
  { field: 'description', headerName: 'Description', width: 200 },
  {
    field: 'input',
    headerName: 'Input Analyte Values',
    width: 200,
    renderCell: (params) => (
      <Button variant="contained" onClick={() => { handleInputAnalyte(params.row.id); console.log("hello"); }}>
        Input Analyte Values
      </Button>
    ),
  },
  {
    field: 'review',
    headerName: 'Review',
    width: 200,
    renderCell: (params) => (
      <Button variant="contained" onClick={() => { handleInputAnalyte(params.row.id); console.log("hello"); }}>
        Review QC Panel
      </Button>
    ),
  },
  
];

//CHANGE FROM LOCAL STORAGE TO THE DATABASE WHEN READY
const getSubmittedItemsFromLocalStorage = () => {
  const storedSubmissions = localStorage.getItem('SubmittedQCs');
  if (storedSubmissions) {
    try {
      return JSON.parse(storedSubmissions).map((submission: any, index: number) => ({
        id: index + 1, // Use index as unique ID for each submission batch
        issuer: submission.issuer || 'Unknown',
        submittedAt: new Date(submission.submittedAt).toLocaleString(),
        onView: (id: number) => {}, // Placeholder for view handler
      }));
    } catch (error) {
      console.error('Error parsing SubmittedQCs:', error);
      return [];
    }
  }
  return [];
};

const handleInputAnalyte = (id: number) => {
  // Placeholder for the logic to handle input analyte values
  console.log(`Input analyte values for row with ID: ${id}`);
};

export default function SubmittedQCTable() {
  const [submissions, setSubmissions] = React.useState(getSubmittedItemsFromLocalStorage());
  const [openDialog, setOpenDialog] = React.useState(false);
  const [details, setDetails] = React.useState([]);

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
