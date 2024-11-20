import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { v4 as uuidv4 } from 'uuid';
import { getAccountData } from '../../util/indexedDB/getData';
import { Admin, Student } from '../../util/indexedDB/IDBSchema';

// Submission table columns
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
];

// Fetch submitted items and assign persistent UUIDs
const getSubmittedItemsFromLocalStorage = () => {
  const storedSubmissions = localStorage.getItem('SubmittedQCs');
  if (storedSubmissions) {
    try {
      const submissions = JSON.parse(storedSubmissions);

      // Fetch existing IDs or generate and persist them
      const persistedIds = JSON.parse(localStorage.getItem('SubmissionIDs') || '{}');
      const updatedIds = { ...persistedIds };

      const mappedSubmissions = submissions.map((submission: any) => {
        const key = submission.submittedAt; // Use submittedAt as a unique key
        if (!updatedIds[key]) {
          updatedIds[key] = uuidv4();
        }
        return {
          id: updatedIds[key],
          submittedAt: new Date(submission.submittedAt).toLocaleString(),
          panels: submission.items || [], // Attach panels to the submission
        };
      });

      // Save the updated IDs back to localStorage
      localStorage.setItem('SubmissionIDs', JSON.stringify(updatedIds));

      return mappedSubmissions;
    } catch (error) {
      console.error('Error parsing SubmittedQCs:', error);
      return [];
    }
  }
  return [];
};

// Fetch user's name from IndexedDB
async function fetchUserName(): Promise<string> {
  const accountData = await getAccountData();
  if (accountData && Array.isArray(accountData) && accountData.length > 0) {
    const user = accountData[0] as Admin | Student;
    return `${user.firstname} ${user.lastname}`;
  }
  return 'User';
}

export default function SubmittedQCTable() {
  const [userName, setUserName] = useState<string>('User');
  const [submissions, setSubmissions] = useState(getSubmittedItemsFromLocalStorage());

  useEffect(() => {
    async function fetchName() {
      const name = await fetchUserName();
      setUserName(name);
    }
    fetchName();
  }, []);

  const handleViewReport = (id: string) => {
    // Open the edit report page in a new tab with the ID in the URL
    window.open(`/editreportpage?id=${id}`, '_blank');
  };

  return (
    <Paper sx={{ padding: 2, marginTop: 4 }}>
      <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
        Quality Controls ordered by {userName}
      </Typography>
      <DataGrid
        rows={submissions.map((submission) => ({
          ...submission,
          onViewReport: handleViewReport,
        }))}
        columns={submissionColumns}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </Paper>
  );
}
