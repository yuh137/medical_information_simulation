import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme.tsx';
import ColorModeSelect from '../shared-theme/ColorModeSelect.tsx';
import { Typography } from '@mui/material';
import ReportSubTable from './table/Report_Submission_Table.tsx';

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

/*export default function HandleSubmit(props: { disableCustomTheme?: boolean }) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
    }
  };
commenting out in for the submission of files to be accepted to the local web browser for now*/

export default function HandleSubmit(props: { disableCustomTheme?: boolean }) {
  const[fileData, setFileData] = React.useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();//Reading tee files as a Base64 string to accept documents
      reader.onload = () => {
        if(reader.result){
          const base64Data = reader.result.toString();
          setFileData(base64Data);
          localStorage.setItem('uploadedReport', base64Data);
          console.log('File saved to localStorage:', file.name);
      }
    };
  reader.readAsDataURL(file); //read the file as a Base64 string
  }
};

const handleSubmit = () => {
  if(fileData){
    console.log('Submitted file save in localStorage');
    alert('File successfully submitted and saved locally!');
    } else {
      alert('No file selected');
  }

};

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card>
          <Typography variant='h4' align ='center' gutterBottom>
            Student Report Submissions</Typography>
          <input type="file" onChange= {handleFileChange} style={{marginBottom: '16px'}}/>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
          
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}

