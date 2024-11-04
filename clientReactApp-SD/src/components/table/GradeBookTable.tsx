import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme.tsx';
import ColorModeSelect from '../../shared-theme/ColorModeSelect.tsx';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: '10px',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '800px',
  },
  backgroundColor: theme.palette.mode === 'dark' ? '#457A64' : '#607D8B',
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

const data = [
  { firstName: 'Thomas', lastName: 'Albert', studentID: '8975795', email: 'talbert@school.edu', section: 4, instructor: 'Rose', exam1: 86, exam2: 97, exam3: 71 },
  { firstName: 'Grant', lastName: 'Allen', studentID: '9150485', email: 'gallen@school.edu', section: 1, instructor: 'Zucca', exam1: 100, exam2: 93, exam3: 95 },
  { firstName: 'Mary', lastName: 'Anderson', studentID: '8250495', email: 'manderson@school.edu', section: 3, instructor: 'Rose', exam1: 95, exam2: 70, exam3: 70 },
  { firstName: 'Donna', lastName: 'Austin', studentID: '9860968', email: 'daustin@school.edu', section: 4, instructor: 'Zucca', exam1: 91, exam2: 78, exam3: 81 },
  { firstName: 'Maxwell', lastName: 'Baker', studentID: '8693846', email: 'mbaker@school.edu', section: 1, instructor: 'Zucca', exam1: 87, exam2: 79, exam3: 79 },
  { firstName: 'Jamie', lastName: 'Barker', studentID: '9477175', email: 'jbarker@school.edu', section: 5, instructor: 'Keltyka', exam1: 91, exam2: 79, exam3: 77 },
  { firstName: 'Donna', lastName: 'Barnett', studentID: '8878750', email: 'dbarnett@school.edu', section: 2, instructor: 'Keltyka', exam1: 90, exam2: 75, exam3: 70 },
  { firstName: 'Noah', lastName: 'Barnett', studentID: '9903761', email: 'nbarnett@school.edu', section: 4, instructor: 'Rose', exam1: 78, exam2: 92, exam3: 87 },
];

function GradebookTable() {
  return (
    <>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="gradebook table">
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Student ID</TableCell>
            <TableCell>Email Address</TableCell>
            <TableCell>Section #</TableCell>
            <TableCell>Instructor</TableCell>
            <TableCell>Quiz 1</TableCell>
            <TableCell>Quiz 2</TableCell>
            <TableCell>Quiz 3</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.studentID}>
              <TableCell>{row.firstName}</TableCell>
              <TableCell>{row.lastName}</TableCell>
              <TableCell>{row.studentID}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.section}</TableCell>
              <TableCell>{row.instructor}</TableCell>
              <TableCell>{row.exam1}</TableCell>
              <TableCell>{row.exam2}</TableCell>
              <TableCell>{row.exam3}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <h1>gradebook</h1>
    </>
  );
}

export default function GradeBookTable(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
          <GradebookTable />
      </SignInContainer>
    </AppTheme>
  );
}
