import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import DataTable from './table/DataTable';
import SignUp from './SignUp';
import AccountsDataTable from './table/AccountsDataTable';
// Import utility functions
import initIDB from '../util/indexedDB/initIDB';
import { getAllDataFromStore, getDataByCompositeKey } from '../util/indexedDB/getData';
import { deleteData } from '../util/indexedDB/deleteData';
import addData from '../util/indexedDB/addData';

// Import types
import { QCTemplateBatch } from '../util/indexedDB/IDBSchema';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: '10px',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  backgroundColor: theme.palette.mode === 'dark' ? '#457A64' : '#607D8B', // Darker steel blue for dark mode, lighter steel blue for light mode
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));


const SignInContainer = styled(Stack)(({ theme }) => ({
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


// API URL from environment
const apiUrl = import.meta.env.VITE_API_URL;

export default function APITest(props: { disableCustomTheme?: boolean }) {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [data, setData] = React.useState<QCTemplateBatch[]>([]);

  // Initialize IndexedDB and fetch initial data from API
  React.useEffect(() => {
    const initializeDB = async () => {
      setLoading(true);
      try {
        await initIDB(); // Initialize the database
        const initialData = await getAllDataFromStore<QCTemplateBatch>('qc_store');
        setData(initialData as QCTemplateBatch[]);
        setResult('IndexedDB initialized and data loaded from API');
      } catch (error) {
        console.error('Initialization error:', error);
        setResult('Failed to initialize IndexedDB and load data from API');
      } finally {
        setLoading(false);
      }
    };
    initializeDB();
  }, []);

  // Add data to IndexedDB
  const handleAddData = async () => {
    setLoading(true);
    try {
      const newItem: QCTemplateBatch = {
        fileName: 'NewFile',
        lotNumber: '123',
        closedDate: '2024-12-31',
        openDate: '2024-01-01',
        expirationDate: '2025-01-01',
        fileDate: '2024-01-01',
        analytes: [],
      };
      await addData('qc_store', newItem);
      const updatedData = await getAllDataFromStore<QCTemplateBatch>('qc_store');
      setData(updatedData as QCTemplateBatch[]);
      setResult('Data added to IndexedDB');
    } catch (error) {
      console.error('Add data error:', error);
      setResult('Failed to add data to IndexedDB');
    } finally {
      setLoading(false);
    }
  };

  // Delete data from IndexedDB
  const handleDeleteData = async (key: string) => {
    setLoading(true);
    try {
      await deleteData('qc_store', key);
      const updatedData = await getAllDataFromStore<QCTemplateBatch>('qc_store');
      setData(updatedData as QCTemplateBatch[]);
      setResult(`Data with key ${key} deleted from IndexedDB`);
    } catch (error) {
      console.error('Delete data error:', error);
      setResult('Failed to delete data from IndexedDB');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card>
          <Typography variant="h5" align="center">
            API and IndexedDB Test
          </Typography>

          <Button variant="contained" onClick={handleAddData} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Add Data to IndexedDB'}
          </Button>

          {data.map(item => (
            <Stack key={item.fileName} direction="row" justifyContent="space-between" alignItems="center">
              <Typography>{item.fileName}</Typography>
              <Button variant="outlined" color="error" onClick={() => handleDeleteData(item.fileName)}>
                Delete
              </Button>
            </Stack>
          ))}

          {result && (
            <Typography variant="body1" align="center" color={result.includes('Success') ? 'primary' : 'error'}>
              {result}
            </Typography>
          )}
          <DataTable></DataTable>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
