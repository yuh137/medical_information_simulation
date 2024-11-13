import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme.tsx';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import LeevyorQual from '../checkboxes/LeevyorQual.tsx';
import TextField from '@mui/material/TextField';
import ColorTextFields from '../ColorTextFields.tsx';
import { Button } from '@mui/material';


interface Analyte {
  analyteID: string;
  analyteName: string;
  analyteAcronym: string;
  unitOfMeasure: string;
  minLevel: number;
  maxLevel: number;
  mean: number;
  stdDevi: number;
  adminQCLotID: string;
}

interface Panel {
  adminQCLotID: string;
  qcName: string;
  openDate: string;
  closedDate: string;
  expirationDate: string;
}

// Styled Card component
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  width: '150px',
  height: '100px',
  backgroundColor: theme.palette.mode === 'dark' ? '#457A64' : '#607D8B',
  color: 'white',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  ...theme.applyStyles('dark', {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
  }),
}));


const GreenCard = styled(Card)(({ theme }) => ({
  border: '2px solid #4caf50', // Green border
  color: theme.palette.mode === 'dark' ? '#4caf50' : '#2e7d32', // Green text color
}));

const EditableTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#4caf50', // Green border
    },
    '&:hover fieldset': {
      borderColor: '#66bb6a', // Darker green on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2e7d32', // Even darker green when focused
    },
  },
  width: '100%',
  input: {
    textAlign: 'center',
    color: 'white',
  },
}));


// Container for cards
const CardContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
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
    position: 'fixed',
    zIndex: -1,
    inset: 0,
    backgroundColor: theme.palette.mode === 'dark' ? '#457A64' : '#607D8B',
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function QCAnalytesGrid(props: { disableCustomTheme?: boolean }) {
  const { adminQCLotID } = useParams<{ adminQCLotID: string }>();
  const [analytes, setAnalytes] = useState<Analyte[]>([]);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState('qualitative');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const fetchPanelAndAnalytes = async () => {
      if (!adminQCLotID) return;

      try {
        const panelResponse = await axios.get<Panel>(`http://localhost:5029/api/AdminQCLots/${adminQCLotID}`);
        setPanel(panelResponse.data);

        const analytesResponse = await axios.get<Analyte[]>(`http://localhost:5029/api/Analytes/${adminQCLotID}`);
        setAnalytes(analytesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPanelAndAnalytes();
  }, [adminQCLotID]);

  // Handle changes from the LeevyorQual component
  const handleTestChange = (label: string) => {
    setSelectedTest(label);
    console.log('Selected Test:', label);
  };

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress />
      </Stack>
    );
  }

  if (!panel) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <Typography>No Panel Found</Typography>
      </Stack>
    );
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer>
        {/* Display the panel name and dates */}
        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          Analytes for {panel.qcName} <br />
          Open Date: {formatDate(panel.openDate)}, Closed Date: {formatDate(panel.closedDate)}, Expiration Date: {formatDate(panel.expirationDate)}
        </Typography>

        {/* Display Cards side-by-side */}
        <CardContainer>
          <Card>{panel.qcName}</Card>
   
          <GreenCard>      
            <EditableTextField
              variant="outlined"
              placeholder={`Open: ${formatDate(panel.openDate)}`}
              size="small"
            />
            </GreenCard>
          <GreenCard>
          <EditableTextField
              variant="outlined"
              placeholder={`QCLotNumber: ${adminQCLotID}`}
              size="small"
            />
          </GreenCard>

          <GreenCard>
          <EditableTextField
              variant="outlined"
              placeholder={`Closed: ${formatDate(panel.closedDate)}`}
              size="small"
            />
           </GreenCard>
          <GreenCard>
            <EditableTextField
              variant="outlined"
              placeholder={`Expires: ${formatDate(panel.expirationDate)}`}
              size="small"
            />
          </GreenCard>
    
          <LeevyorQual onTestChange={handleTestChange} />
          <GreenCard><Button variant="contained" color="success"> Save QC File</Button></GreenCard>
        </CardContainer>

        <TableContainer component={Paper} >
          <Table>
            <TableHead>
              <TableRow sx={{alignContent:'center'}}>
                <TableCell>Name</TableCell>
                <TableCell>Acronym</TableCell>
                <TableCell>Expected Range</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytes.map((analyte) => (
                <TableRow key={analyte.analyteID}>
                  <TableCell>{analyte.analyteName}</TableCell>
                  <TableCell>{analyte.analyteAcronym}</TableCell>
                  <TableCell>
                  <ColorTextFields></ColorTextFields>
                </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SignInContainer>
    </AppTheme>
  );
}
