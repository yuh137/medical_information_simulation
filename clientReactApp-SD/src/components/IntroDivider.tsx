import * as React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme.tsx';
import ColorModeSelect from '../shared-theme/ColorModeSelect.tsx';
import PinnedSubheaderList from './PinnedSubheaderList.tsx';


export default function IntroDivider(props: { disableCustomTheme?: boolean }) {

  const Card = styled(MuiCard)(({ theme }) => ({
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
    
  return (
    <AppTheme {...props}>
    <CssBaseline enableColorScheme />
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined" sx={{ maxWidth: 360 }}>
      <Box sx={{ p: 2, justifyContent:' center' }}>
        <Stack
          direction="row"
          sx={{ justifyContent:' center' , alignItems: 'center' }}
        >
          <Typography gutterBottom variant="h5" component="div" >
            Notifications
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Upcoming Due Dates, Messages and Announcemnts from Professors, etc.
        </Typography>
      </Box>
      <Divider />

      <PinnedSubheaderList></PinnedSubheaderList>

    </Card>
    </SignInContainer>
  </AppTheme>
    
  );
}
