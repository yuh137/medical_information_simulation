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

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

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

const DataTableContainer = styled(Stack)(({ theme }) => ({
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
    const selectedItems = JSON.parse(storedItems) as number[];
    return selectedItems.map((item, index) => ({
      id: index + 1,
      description: `Quality Control Item ${item + 1}`, // You can modify this to use the actual description if available
      value: '', // Add value field to store user input
    }));
  }
  return [];
};

export default function InputQCValuesTable(props: { disableCustomTheme?: boolean }) {
  const [items, setItems] = React.useState(getItemsFromLocalStorage());

  // Handler to update the value field in the items state
  const handleValueChange = (id: number, newValue: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, value: newValue } : item
      )
    );
  };
  const handleSubmitQC = () => {
    // Log current items for debugging
    console.log("Submitting QC values:", items);
  
    // Save selected quality controls with their input values to localStorage
    localStorage.setItem('submittedQualityControls', JSON.stringify(items));
  
    // Provide feedback to the user (can be a toast, alert, or UI update)
    alert('Quality Control values submitted successfully.');
  
    // Optionally reset the form
    setItems(getItemsFromLocalStorage());
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <DataTableContainer direction="column" justifyContent="space-between">
        <Paper sx={{ padding: 2, width: '100%' }}>
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {item.description}
                    </Typography>
                    <TextField
                      fullWidth
                      label="Value"
                      variant="outlined"
                      size="small"
                      value={item.value}
                      onChange={(event) =>
                        handleValueChange(item.id, event.target.value)
                      }
                      sx={{ marginTop: 2 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Grid container direction="column" sx={{ alignItems: 'center' }}>
            <QCSubmitButton onSubmitQC={handleSubmitQC} />
          </Grid>
        </Paper>
      </DataTableContainer>
    </AppTheme>
  );
}