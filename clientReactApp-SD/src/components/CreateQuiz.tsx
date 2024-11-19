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
import { on } from 'events';

interface CreateQuizProps {

    disableCustomTheme?: boolean;
    onSubmit: (quizName: string) => void;
    onClose: () => void;
  
  }

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: '10px',
    backgroundColor: theme.palette.mode === 'dark' ? '#457A64' : '#607D8B', // Darker steel blue for dark mode, lighter steel blue for light mode
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

  export default function createQuiz({ onClose, onSubmit }: CreateQuizProps) {
    const [quizName, setQuizName] = React.useState('');


    const handleSubmit = () => {
        if(quizName.trim()){
            onSubmit(quizName);
            setQuizName('');
            onClose();
        }
    }

    return(
        <Card>
         <h2>Create a New Quiz</h2>
         <p>Enter a quiz name below.</p>
         <input type="text" 
          placeholder= "Quiz Name"
         value={quizName}
         onChange={(e) => setQuizName(e.target.value)}
         style ={{padding:'8px', fontSize:'16px', width:'100%'}}
         />
         <Button variant= "contained" color="secondary" onClick={handleSubmit}>
            Submit    
        </Button>
        <Button variant= "contained" color="primary" onClick={onClose}>
            Close
        </Button>
        </Card>
    );
  }