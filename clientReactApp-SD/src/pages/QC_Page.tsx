import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import QCSelectAction from "../components/Dropdowns/QCSelectAction";
import CheckboxLabels from "../components/checkboxes/CheckboxLabels";
import OrderQC_SelectAllTransferList from "../components/transferlists/OrderQC_SelectAllTransferList";
import CreateNewQC_SelectAllTransferList from "../components/transferlists/CreateNewQC_SelectAllTransferList";
import SubmittedQCTable from "../components/table/SubmittedQCTable";
import QCChoices from "../components/QCChoices";
import QC_Edit_Table from "../components/table/QC_Edit_Table";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "10px",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const QCTableContainer = styled(Stack)(({ theme }) => ({
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

export default function QC_Page(props: { disableCustomTheme?: boolean }) {
  const [selectedQC, setSelectedQC] = React.useState<string | null>(null); // State to track which QC is selected
  const [QCBuildOption, setQCBuild] = React.useState<string | null>(null); // State if admin will create or edit QC

  const handleQCChange = (qcType: string) => {
    setSelectedQC(qcType);
  };

  const handleQCBuilder = (QCBuildOption: string) => {
    setQCBuild(QCBuildOption);
  };

  return (
    <AppTheme {...props}>
      <QCTableContainer>
        <CssBaseline enableColorScheme />
        <h1>Quality Controls</h1>
        <CheckboxLabels onQCChange={handleQCChange} />
        <QCSelectAction />
        {selectedQC === "orderQC" && <OrderQC_SelectAllTransferList />}
        {selectedQC === "reviewQC" && <SubmittedQCTable />}
        {selectedQC === "buildQC" && (
          <QCChoices onQCBuildChange={handleQCBuilder} />
        )}
        {QCBuildOption === "editQC" && <QC_Edit_Table />}
        {QCBuildOption === "createQC" && <CreateNewQC_SelectAllTransferList />}
      </QCTableContainer>
    </AppTheme>
  );
}
