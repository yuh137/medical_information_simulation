import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme';
import ColorModeSelect from '../../shared-theme/ColorModeSelect';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import QCSubmitButton from './Buttons/QCSubmitButton';
import SubmittedQCTable from './SubmittedQCTable';

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';


const Card = styled(MuiCard)(({ theme }) => ({

  margin: '50px',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '150px',
  },
  [theme.breakpoints.up('lg')]: {
    width: '300px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const DataTableContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  alignSelf: 'center',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'fixed',
    zIndex: -1,
    inset: 0,
    backgroundColor: theme.palette.mode === 'dark' ? '#457A64' : '#607D8B', // Darker steel blue for dark mode, lighter steel blue for light mode
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
  { field: 'description', headerName: 'Description', width: 200 },
  {
    field: 'value',
    headerName: 'Value',
    width: 200,
    renderCell: (params: GridRenderCellParams) => (
      <TextField
        variant="outlined"
        size="small"
        value={params.row.value || ''}
        onChange={(event) => params.row.onChangeValue(params.id, event.target.value)}
      />
    ),
  },
];

// Retrieve rows from localStorage and transform them into the format required for displaying in the grid.
const getItemsFromLocalStorage = () => {
  const storedItems = localStorage.getItem('selectedQualityControls');
  if (storedItems) {
    const selectedItems = JSON.parse(storedItems) as string[]; // Expecting an array of strings (panel names)
    return selectedItems.map((panelName, index) => ({
      id: index + 1,
      description: panelName, // Use the panel name directly
      value: '', // Initialize value field for user input
    }));
  }
  return [];
};

export default function PanelsToOrderTable(props: { disableCustomTheme?: boolean }) {
  const [items, setItems] = React.useState(getItemsFromLocalStorage());

  const handleSubmitQC = () => {
    // Log current items for debugging
    console.log("Submitting QC values:", items);
  
    // Retrieve existing submitted quality controls array from localStorage
    const existingSubmissions = JSON.parse(localStorage.getItem('SubmittedQCs') || '[]');
  
    // Append the current submission to the existing array with date and time
    const submissionWithTimestamp = {
      items,
      submittedAt: new Date().toISOString(),
    };
    const updatedSubmissions = [...existingSubmissions, submissionWithTimestamp];
  
    // Save the updated array back to localStorage
    localStorage.setItem('SubmittedQCs', JSON.stringify(updatedSubmissions));
  
    // Provide feedback to the user (can be a toast, alert, or UI update)
    alert('Quality Control values submitted successfully.');
  
    // Optionally reset the form
    setItems(getItemsFromLocalStorage());
    location.reload();
  };

  return (
    <AppTheme {...props}>
    <CssBaseline enableColorScheme />
    <ColorModeSelect
        sx={{ position: "absolute", top: "6.5rem", left: "2rem" }}
      />
      <DataTableContainer direction="column" sx={{ alignItems: 'center' }}>
          <Typography variant="h1" component="div">Quality Control Panels to be ordered</Typography>
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Grid container direction="column" sx={{ alignItems: 'center' }}>
            <QCSubmitButton onSubmitQC={handleSubmitQC} />
          </Grid>
          <Grid container direction="column" sx={{ alignItems: 'center' }}>
            <SubmittedQCTable></SubmittedQCTable>
          </Grid>
      </DataTableContainer>
    </AppTheme>
  );
}
