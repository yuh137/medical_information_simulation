import * as React from 'react';
import { useParams } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme.tsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const ReviewContainer = styled(Stack)(({ theme }) => ({
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

const sampleChartData = [
  { name: '11/12/2024', value: 1.4 },
  { name: '11/13/2024', value: 1.2 },
  { name: '11/14/2024', value: 1.7 },
  { name: '11/15/2024', value: .8 },
  { name: '11/16/2024', value: 1.2 },
  { name: '11/17/2024', value: 1.5 },
  { name: '11/18/2024', value: 1.5 },
];

export default function ReviewSubmission(props: { disableCustomTheme?: boolean }) {
  const { selectedReportId } = useParams(); // Extract selectedReportId from route params

  const handleDownload = () => {
    // Mock download logic
    const reportData = { id: selectedReportId, content: "This is the report content." };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `report-${selectedReportId}.json`;
    link.click();
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ReviewContainer direction="column" justifyContent="space-between" spacing={4}>
        <h1>Review Submission: {selectedReportId}</h1>
        <h2>Sent to professor!</h2>

        <Button variant="contained" color="primary" onClick={handleDownload}>
          Download Report
        </Button>

        <div>
          <h2>Report Data Visualization</h2>
          <LineChart
            width={600}
            height={300}
            data={sampleChartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </div>
      </ReviewContainer>
    </AppTheme>
  );
}