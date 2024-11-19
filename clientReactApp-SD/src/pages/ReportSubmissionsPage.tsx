import React from "react";
import ReportSubTable from "../components/table/Report_Submission_Table";
import HandleSubmit from "../components/HandleSubmit";
import AppTheme from "../shared-theme/AppTheme";
import  CssBaseline  from "@mui/material/CssBaseline";
import {styled} from "@mui/material/styles"

const PageContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? '#457A64' : '#607D8B',
  backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  ...theme.applyStyles('dark', {
    backgroundImage:
      'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}));

const BottomRightContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  padding: theme.spacing(2),
}));

export default function ReportSubmissionsPage() {
  const isStudent = true; // Replace with your actual condition for checking student vs. staff
  return (
    <AppTheme>
      <CssBaseline enableColorScheme/>
      {isStudent ? (
        <PageContainer>
        <div>
          <h2>Report Submission Page for Students</h2>
          <p>Students can submit reports to professors.</p>
        </div>
        <BottomRightContainer>
          <ReportSubTable />
        </BottomRightContainer>
      </PageContainer>
      ) : (
        <PageContainer>
          <h2>Report Submission Page for Professors</h2>
          <p>Professors can view submitted reports from students.</p>
          {/* Add professor-specific content here */}
        </PageContainer>
      )}
    </AppTheme>
  );
}
