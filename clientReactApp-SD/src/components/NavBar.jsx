import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material';
import Button from '@mui/material/Button';
import DrawerToggle from './DrawerToggle.jsx';
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
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          {/*Change below with MIS logo*/}
          <Typography variant="h2" component="div">
            MIS    
          </Typography>
        </Link>
        </ThemeProvider>

        {/*keeps buttons to the right of nav bar*/}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
        
        {/*Buttons, they only show up past the splash page*/}
        {location.pathname !== '/' && (                                                                 

          <div className='navTabs'>
            <Link to="/qc" style={{ textDecoration: 'none', color: 'inherit' }}>                          {/*style prop keeps the button white*/}
              <Button color="inherit" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>QC</Button>         {/*sx prop changes text properties*/}
            </Link>
            <Link to="/account" style={{ textDecoration: 'none', color: 'inherit' }}>                   
              <Button color="inherit" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Account</Button> 
            </Link>
          </div>
        )}
        
        {/*toggle button with drawer component. drawer component has links*/}
        {location.pathname !== '/' && (
          <div id='toggle'>
            <DrawerToggle />
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
