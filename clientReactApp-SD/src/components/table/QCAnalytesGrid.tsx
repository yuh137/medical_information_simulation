import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme.tsx';
import CircularProgress from '@mui/material/CircularProgress';

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

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export default function QCAnalytesGrid(props: { disableCustomTheme?: boolean }) {
  const { adminQCLotID } = useParams<{ adminQCLotID: string }>();
  const [analytes, setAnalytes] = useState<Analyte[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchAnalytesData = async () => {
      try {
        const response = await axios.get('http://localhost:5029/api/Analytes');
        const data: Analyte[] = response.data;
        const filteredData = data.filter(analyte => analyte.adminQCLotID === adminQCLotID);
        setAnalytes(filteredData);
      } catch (error) {
        console.error('Error fetching analytes data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytesData();
  }, [adminQCLotID]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Analytes Table">
            <TableHead>
              <TableRow>
                <TableCell>Analyte ID</TableCell>
                <TableCell>Analyte Name</TableCell>
                <TableCell>Analyte Acronym</TableCell>
                <TableCell>Unit of Measure</TableCell>
                <TableCell>Min Level</TableCell>
                <TableCell>Max Level</TableCell>
                <TableCell>Mean</TableCell>
                <TableCell>Std Deviation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytes.map((analyte) => (
                <TableRow key={analyte.analyteID}>
                  <TableCell>{analyte.analyteID}</TableCell>
                  <TableCell>{analyte.analyteName}</TableCell>
                  <TableCell>{analyte.analyteAcronym}</TableCell>
                  <TableCell>{analyte.unitOfMeasure}</TableCell>
                  <TableCell>{analyte.minLevel}</TableCell>
                  <TableCell>{analyte.maxLevel}</TableCell>
                  <TableCell>{analyte.mean}</TableCell>
                  <TableCell>{analyte.stdDevi}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SignInContainer>
    </AppTheme>
  );
}
