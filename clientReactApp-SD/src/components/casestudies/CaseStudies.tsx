import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import MainContent from './components_blog/MainContent';
import Latest from './components_blog/Latest';
import Footer from './components_blog/Footer';
import AppTheme from '../../shared-theme/AppTheme';

export default function CaseStudies(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <MainContent />
        {/*<Latest />*/}
      </Container>
      {/*<Footer />*/}
    </AppTheme>
  );
}
