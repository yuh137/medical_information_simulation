import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material';
import Button from '@mui/material/Button';
import DrawerToggle from './DrawerToggle.tsx';
import { useLocation, Link } from 'react-router-dom'; // Import Link
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

  const location = useLocation(); // Get current location

  return (
    <AppBar className='Appbar' position="relative" sx={{ backgroundColor: "transparent", boxShadow: 'none', width: '100%' }}>
      <Toolbar>
        <ThemeProvider theme={logoTheme}>
        {/*Logo can't be used as button on splash page*/}
        {(location.pathname !== '/' && location.pathname !== '/register') && (
          <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
            {/*Change below with MIS logo*/}
            <img className='MIS_Logo' src="https://i.imgur.com/qdxXVgn.png" />
          </Link>
        )}
        {location.pathname === '/' && (
          <img className='MIS_Logo' src="https://i.imgur.com/qdxXVgn.png" />
        )}

        </ThemeProvider>

        {/*keeps buttons to the right of nav bar*/}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
        
        {/*Buttons, they only show up past the splash page*/}
        {location.pathname !== '/' && location.pathname !== '/register' && (                                                                 

          <div className='navTabs'>
            <Link to="/qc" style={{ textDecoration: 'none', color: 'inherit' }}>                          {/*style prop keeps the button white*/}
              <Button color="inherit" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>QC</Button>         {/*sx prop changes text properties*/}
            </Link>
            <Link to="/account" style={{ textDecoration: 'none', color: 'inherit' }}>                   
              <Button color="inherit" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Account</Button> 
            </Link>
          </div>
        )}
        
        {/*toggle button with drawer component only on non splash/register page. drawer component has links*/}
        {location.pathname !== '/' && location.pathname !== '/register' && (
          <div id='toggle'>
            <DrawerToggle />
          </div>
        )}
        
      </Toolbar>
    </AppBar>
  );
}
