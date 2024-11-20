import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme.tsx';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

interface AnalyteData {
  analyteID: string;
  analyteName: string;
  description: string;
  createdDate: string;
  modifiedDate: string;
  isActive: boolean;
  adminQCLotID: string; // Add the AdminQCLotID field
}

interface AnalytesEditTableProps {
  disableCustomTheme?: boolean;
  adminQCLotID: string; // Accept AdminQCLotID as a prop
}

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

function formatValue(value: any) {
  return value === null || value === undefined || value === '' ? 'NULL' : value;
}

function AnalyteTable({ adminQCLotID }: { adminQCLotID: string }) {
  const [details, setDetails] = React.useState<AnalyteData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  const handleEditClick = (analyteID: string) => {
    console.log('Editing analyte with ID:', analyteID);
    navigate(`/analyteedit/${analyteID}`);
  };

  React.useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const responseAnalytes = await axios.get("http://localhost:5029/api/Analytes");
        const dataAnalytes = responseAnalytes.data;
        console.log("Analytes", dataAnalytes);

        // Filter data by AdminQCLotID
        const filteredData = dataAnalytes.filter(
          (analyte: AnalyteData) => analyte.adminQCLotID === adminQCLotID
        );

        setDetails(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBackendData();
  }, [adminQCLotID]);

  if (loading) {
    return <CircularProgress />;
  }

  if (details.length === 0) {
    return <Typography>No analytes found for the specified AdminQCLotID.</Typography>;
  }

  return (
    <>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Analytes Available to Edit
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Analytes table">
          <TableHead>
            <TableRow>
              <TableCell>Analyte Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Modified</TableCell>
              <TableCell>Active?</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.map((row) => (
              <TableRow key={row.analyteID}>
                <TableCell>{formatValue(row.analyteName)}</TableCell>
                <TableCell>{formatValue(row.description)}</TableCell>
                <TableCell>{formatValue(row.createdDate)}</TableCell>
                <TableCell>{formatValue(row.modifiedDate)}</TableCell>
                <TableCell>{row.isActive ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleEditClick(row.analyteID)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default function Analytes_Edit_Table({
  disableCustomTheme,
  adminQCLotID,
}: AnalytesEditTableProps) {
  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column">
        <AnalyteTable adminQCLotID={adminQCLotID} />
      </SignInContainer>
    </AppTheme>
  );
}
