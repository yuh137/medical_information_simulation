import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import { CssBaseline } from "@mui/material";

// Panel details table columns
const panelColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "description", headerName: "Description", width: 200 },
  {
    field: "editAnalytes",
    headerName: "Edit Analytes",
    width: 150,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="primary"
        onClick={() => params.row.onEditAnalytes(params.row.id)}
      >
        Edit
      </Button>
    ),
  },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Corrected: Use PascalCase for component name
const EditReportContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "fixed",
    zIndex: -1,
    inset: 0,
    backgroundColor: theme.palette.mode === "dark" ? "#457A64" : "#607D8B",
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function EditReportPage(props: { disableCustomTheme?: boolean }) {
  const query = useQuery();
  const reportId = query.get("id");
  const [panels, setPanels] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [analytes, setAnalytes] = useState([]);

  useEffect(() => {
    if (reportId) {
      // Fetch submission details from localStorage
      const storedSubmissions = localStorage.getItem("SubmittedQCs");
      if (storedSubmissions) {
        try {
          const submissions = JSON.parse(storedSubmissions);
          const submission = submissions.find((sub: any) => {
            const persistedIds = JSON.parse(localStorage.getItem("SubmissionIDs") || "{}");
            return persistedIds[sub.submittedAt] === reportId;
          });

          if (submission) {
            setPanels(
              submission.items.map((panel, index) => ({
                ...panel,
                id: index + 1,
                onEditAnalytes: handleEditAnalytes,
              }))
            );
          }
        } catch (error) {
          console.error("Error parsing SubmittedQCs:", error);
        }
      }
    }
  }, [reportId]);

  const handleEditAnalytes = (panelId: number) => {
    setSelectedPanel(panelId);

    // Fetch analytes for the selected panel
    const storedSubmissions = localStorage.getItem("SubmittedQCs");
    if (storedSubmissions) {
      try {
        const submissions = JSON.parse(storedSubmissions);
        const submission = submissions.find((sub: any) => {
          const persistedIds = JSON.parse(localStorage.getItem("SubmissionIDs") || "{}");
          return persistedIds[sub.submittedAt] === reportId;
        });

        if (submission) {
          const panel = submission.items.find((item: any) => item.id === panelId);
          if (panel) {
            setAnalytes(submission.analytes.filter((analyte: any) => analyte.panelId === panelId));
          }
        }
      } catch (error) {
        console.error("Error fetching analytes:", error);
        setAnalytes([]); // Fallback to empty array
      }
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPanel(null);
    setAnalytes([]);
  };

  const handleSubmitAnalyteEdit = () => {
    console.log("Submitting analyte edits:", analytes);
    alert("Analyte edits submitted successfully!");
    handleCloseDialog();
  };

  return (
    <>
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <Typography variant="h1" sx={{ marginBottom: 2, padding: 0, border: 0 }}>
          Review/Edit QC Panels
        </Typography>
        <EditReportContainer direction="column">
          <Paper sx={{ padding: 2, marginTop: 4 }}>
            <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
              Panels Ordered for QC Report: {reportId}
            </Typography>
            <DataGrid
              rows={panels}
              columns={panelColumns}
              autoHeight
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </Paper>
        </EditReportContainer>
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle>Edit Analytes for Panel ID: {selectedPanel}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Analytes Table</Typography>
            <DataGrid
              rows={analytes}
              columns={[
                { field: "id", headerName: "ID", width: 70 },
                { field: "name", headerName: "Name", width: 200 },
                {
                  field: "value",
                  headerName: "Value",
                  width: 200,
                  editable: true,
                },
              ]}
              autoHeight
              pageSize={5}
              rowsPerPageOptions={[5]}
              onCellEditCommit={(params) => {
                const updatedAnalytes = analytes.map((analyte) =>
                  analyte.id === params.id
                    ? { ...analyte, [params.field]: params.value }
                    : analyte
                );
                setAnalytes(updatedAnalytes);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmitAnalyteEdit} color="primary" variant="contained">
              Submit Analyte Value Edit
            </Button>
            <Button onClick={handleCloseDialog} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </AppTheme>
    </>
  );
}
