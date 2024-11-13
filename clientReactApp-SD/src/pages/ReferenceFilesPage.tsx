import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: '10px',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const HomeTableContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'description', headerName: 'Description', width: 250 },
  { field: 'assignedDate', headerName: 'Assigned Date', width: 150 },
  { field: 'dueDate', headerName: 'Due Date', width: 150 },
  {
    field: 'takeQuiz',
    headerName: 'Take Quiz',
    width: 130,
    renderCell: () => (
      <Button variant="contained" color="primary">
        Take Quiz
      </Button>
    ),
  },
];

const rows = [
  { id: 1, description: 'MIS Quiz 1', assignedDate: '2024-11-01', dueDate: '2024-11-10' },
  { id: 2, description: 'MIS Quiz 2', assignedDate: '2024-11-05', dueDate: '2024-11-15' },
  { id: 3, description: 'MIS Quiz 3', assignedDate: '2024-11-08', dueDate: '2024-11-20' },
  { id: 4, description: 'MIS Quiz 4', assignedDate: '2024-11-01', dueDate: '2024-11-10' },
  { id: 5, description: 'MIS Quiz 5', assignedDate: '2024-11-05', dueDate: '2024-11-15' },
  { id: 6, description: 'MIS Quiz 6', assignedDate: '2024-11-08', dueDate: '2024-11-20' },
  
];

const paginationModel = { page: 0, pageSize: 5 };

export default function ReferenceFilesPage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <h1>Quizzes Page</h1>
      <HomeTableContainer direction="column" justifyContent="space-between">

          <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              sx={{ border: 0 }}
            />
          </Paper>

      </HomeTableContainer>
    </AppTheme>
  );
}
