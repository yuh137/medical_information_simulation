import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material';
import Button from '@mui/material/Button';
import DrawerToggle from './DrawerToggle.jsx';
import { Link } from 'react-router-dom'; // Import Link
import './componentStyles/navbar.css';

const logoTheme = createTheme({
  typography: {
    fontFamily: [
      'Lemon',
      'serif',
    ].join(','),
  },
});

export default function ButtonAppBar() {
  return (
    <AppBar className='Appbar' position="relative" sx={{ backgroundColor: "transparent", boxShadow: 'none', width: '100%' }}>
      <Toolbar>
        <ThemeProvider theme={logoTheme}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h2" component="div">
            JD    
          </Typography>
        </Link>
        </ThemeProvider>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />

        <div className='navTabs'>
          <Link to="/projects" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button color="inherit">Projects</Button>
          </Link>
          <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button color="inherit">About Me</Button>
          </Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button color="inherit">Contact</Button>
          </Link>
        </div>

        <div id='toggle'>
          <DrawerToggle />
        </div>
      </Toolbar>
    </AppBar>
  );
}
