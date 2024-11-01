import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme.tsx';
import ColorModeSelect from '../shared-theme/ColorModeSelect.tsx';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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



export default function AccountMessage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        {/* Replace card with you*/}
        {/*<h1>Account Page</h1>*/}
        <Card><h1>Account Page</h1></Card>
        <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '30ch' },
      position: 'fixed',
      top: '44%',    // 25% down from the top of the viewport
      left: '65%',   // Centered horizontally
      transform: 'translate(-50%, -25%)', // Centers box based on its own size
       }}
      noValidate
      autoComplete="off"
    >
      {/*<TextField id="filled-basic" label="Enter message here." variant="filled" multiline rows={4}/>*/}
      <TextField id="standard-basic" label="Enter message here." variant="standard" multiline rows={4}/>
    </Box>
    <Stack spacing={2} direction="row"
      sx={{
        position: 'fixed',
        top: '50%',    // 25% down from the top of the viewport
        left: '75%',   // Centered horizontally
        transform: 'translate(-50%, -25%)', // Centers box based on its own size
        //width: '200px',
        //height: '100px',
        //backgroundColor: 'secondary.main'
      }}
    >
      {/*<Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>*/}
      <Button variant="outlined">SEND</Button>
    </Stack>
      </SignInContainer>
    </AppTheme>
  );
}