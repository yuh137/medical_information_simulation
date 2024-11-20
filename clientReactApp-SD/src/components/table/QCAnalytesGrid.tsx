import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import AppTheme from "../../shared-theme/AppTheme.tsx";
import Typography from "@mui/material/Typography";
import MuiCard from "@mui/material/Card";
import LeevyorQual from "../checkboxes/LeevyorQual.tsx";
import TextField from "@mui/material/TextField";
import ColorTextFields from "../ColorTextFields.tsx";
import { Button, Select, MenuItem } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

interface Analyte {
  analyteID: string;
  analyteName: string;
  analyteAcronym: string;
  unitOfMeasure: string;
  minLevel: number;
  maxLevel: number;
  mean: number;
  stdDevi: number;
  adminQCLotID: string;
  expInRange: boolean;
}

interface Panel {
  qcName: string;
  lotNumber: string;
  openDate: string;
  closedDate: string;
  expirationDate: string;
}
// interface Panel {
//   adminQCLotID: string;
//   qcName: string;
//   openDate: string;
//   closedDate: string;
//   expirationDate: string;
//   lotNumber: string;
// }

// Styled Card component
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  width: "150px",
  height: "100px",
  backgroundColor: theme.palette.mode === "dark" ? "#457A64" : "#607D8B",
  color: "white",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  ...theme.applyStyles("dark", {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  }),
}));

const GreenCard = styled(Card)(({ theme }) => ({
  border: "2px solid #4caf50", // Green border
  color: theme.palette.mode === "dark" ? "#4caf50" : "#2e7d32", // Green text color
}));

const EditableTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#4caf50", // Green border
    },
    "&:hover fieldset": {
      borderColor: "#66bb6a", // Darker green on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2e7d32", // Even darker green when focused
    },
  },
  width: "100%",
  input: {
    textAlign: "center",
    color: "white",
  },
}));

// Container for cards
const CardContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function QCAnalytesGrid(props: {
  disableCustomTheme?: boolean;
}) {
  const { adminQCLotID } = useParams<{ adminQCLotID: string }>();
  const [analytes, setAnalytes] = useState<Analyte[]>([]);
  // const [panel, setPanel] = useState<Panel | null>(null);
  const [panel, setPanel] = useState<Panel>({
    qcName: "",
    lotNumber: "",
    openDate: "",
    closedDate: "",
    expirationDate: "",
  });
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState("qualitative");

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString();
  // };

  useEffect(() => {
    const fetchPanelAndAnalytes = async () => {
      if (!adminQCLotID) return;

      try {
        const panelResponse = await axios.get<Panel>(
          `http://localhost:5029/api/AdminQCLots/${adminQCLotID}`,
        );
        setPanel(panelResponse.data);

        const analytesResponse = await axios.get<Analyte[]>(
          `http://localhost:5029/api/Analytes/${adminQCLotID}`,
        );
        console.log("Panel Open Date", panelResponse.data.openDate);
        setAnalytes(analytesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPanelAndAnalytes();
  }, [adminQCLotID]);

  // Handle change for Panel inputs
  const handlePanelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPanel((prevPanel) => ({
      ...prevPanel,
      [name]: value,
    }));
  };

  // Check if all panel fields are filled
  useEffect(() => {
    const { qcName, lotNumber, openDate, closedDate, expirationDate } = panel;
    setIsSaveDisabled(
      !qcName || !lotNumber || !openDate || !closedDate || !expirationDate,
    );
  }, [panel]);

  // Handle change for Analyte inputs
  const handleAnalyteInputChange = (
    analyteID: string,
    fieldName: string,
    value: string,
  ) => {
    setAnalytes((prevAnalytes) =>
      prevAnalytes.map((analyte) =>
        analyte.analyteID === analyteID
          ? { ...analyte, [fieldName]: value }
          : analyte,
      ),
    );
  };

  // Handle changes from the LeevyorQual component
  // const handleTestChange = (label: string) => {
  //   setSelectedTest(label);
  //   console.log("Selected Test:", label);
  // };

  // Handle Save Button
  const handleSave = async () => {
    localStorage.setItem("panelData", JSON.stringify(panel));
    localStorage.setItem("analyteData", JSON.stringify(analytes));
    console.log("Panel Data Saved:", panel);
    console.log("Analytes Data Saved:", analytes);
    // console.log("Panel Name:", panel.qcName);
    try {
      // Prepare the data for the DTO
      const payload = {
        // QCName: panel.qcName,
        // LotNumber: panel.lotNumber,
        OpenDate: panel.openDate,
        ClosedDate: panel.closedDate,
        ExpirationDate: panel.expirationDate,
        FileDate: new Date().toISOString(), // Example for FileDate
        // Department: 0,
        Analytes: analytes.map((analyte) => ({
          analyteID: analyte.analyteID,
          analyteName: analyte.analyteName,
          analyteAcronym: analyte.analyteAcronym,
          unitOfMeasure: analyte.unitOfMeasure,
          minLevel: analyte.minLevel,
          maxLevel: analyte.maxLevel,
          mean: analyte.mean,
          stdDevi: analyte.stdDevi,
          expInRange: analyte.expInRange,
        })),
      };

      // Make the POST request
      // const deleteResponse = await axios.delete(
      //   `http://localhost:5029/api/AdminQCLots/${adminQCLotID}`,
      // );
      console.log("Payload: ", payload.Analytes);
      console.log("First Analyte range value: ", analytes[0].expInRange);
      const response = await axios.put(
        `http://localhost:5029/api/AdminQCLots/UpdateQCLot/${adminQCLotID}`, // Update the URL accordingly
        payload,
      );
      console.log("Panel Data Saved Successfully:", response.data);

      // Store the data locally if needed
      // localStorage.setItem("panelData", JSON.stringify(panel));
      // localStorage.setItem("analyteData", JSON.stringify(analytes));
      alert("QC Panel Successfully Updated!");
      window.location.href = "/qc";
    } catch (error) {
      console.error("Error saving panel data:", error);
      alert("An error occurred while saving the QC Panel data.");
    }
  };

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress />
      </Stack>
    );
  }

  if (!panel) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <Typography>No Panel Found</Typography>
      </Stack>
    );
  }
  const formatDate = (dateString: any) => {
    if (!dateString) {
      return ""; // Return an empty string if dateString is null or undefined
    }
    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }
    return dateString;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer>
        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          Edit QC: {panel.qcName}
          <br />
          Lot Number: {panel.lotNumber}
        </Typography>

        {/* Panel Information Fields */}
        <CardContainer>
          {/* <GreenCard> */}
          {/*   <FormControl fullWidth> */}
          {/*     <FormLabel sx={{ color: "white" }}>QC Name</FormLabel> */}
          {/*     <EditableTextField */}
          {/*       variant="outlined" */}
          {/*       name="qcName" */}
          {/*       value={panel.qcName} */}
          {/*       onChange={handlePanelInputChange} */}
          {/*       size="small" */}
          {/*     /> */}
          {/*   </FormControl> */}
          {/* </GreenCard> */}
          {/* <GreenCard> */}
          {/*   <FormControl fullWidth> */}
          {/*     <FormLabel sx={{ color: "white" }}>Lot Number</FormLabel> */}
          {/*     <EditableTextField */}
          {/*       variant="outlined" */}
          {/*       name="lotNumber" */}
          {/*       value={panel.lotNumber} */}
          {/*       onChange={handlePanelInputChange} */}
          {/*       size="small" */}
          {/*     /> */}
          {/*   </FormControl> */}
          {/* </GreenCard> */}
          <GreenCard>
            <FormControl fullWidth>
              <FormLabel sx={{ color: "white" }}>Open Date</FormLabel>
              <EditableTextField
                variant="outlined"
                name="openDate"
                type="date"
                value={formatDate(panel.openDate)}
                onChange={handlePanelInputChange}
                size="small"
              />
            </FormControl>
          </GreenCard>
          <GreenCard>
            <FormControl fullWidth>
              <FormLabel sx={{ color: "white" }}>Closed Date</FormLabel>
              <EditableTextField
                variant="outlined"
                name="closedDate"
                type="date"
                value={formatDate(panel.closedDate)}
                onChange={handlePanelInputChange}
                size="small"
              />
            </FormControl>
          </GreenCard>
          <GreenCard>
            <FormControl fullWidth>
              <FormLabel sx={{ color: "white" }}>Expiration Date</FormLabel>
              <EditableTextField
                variant="outlined"
                name="expirationDate"
                type="date"
                value={formatDate(panel.expirationDate)}
                onChange={handlePanelInputChange}
                size="small"
              />
            </FormControl>
          </GreenCard>
          <GreenCard>
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              disabled={isSaveDisabled}
            >
              Save QC Panel
            </Button>
          </GreenCard>
        </CardContainer>

        {/* Analyte Information Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {analytes.map((analyte) => (
                <TableRow key={analyte.analyteID}>
                  <TableCell>{analyte.analyteName}</TableCell>
                  <TableCell>{analyte.analyteAcronym}</TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <FormLabel>Expected in Range</FormLabel>
                      {/* <Select */}
                      {/*   value={analyte.expInRange ? "true" : "false"} */}
                      {/*   onChange={(e) => */}
                      {/*     handleAnalyteInputChange( */}
                      {/*       analyte.analyteID, */}
                      {/*       "expInRange", */}
                      {/*       e.target.value === "true" ? true : false, */}
                      {/*     ) */}
                      {/*   } */}
                      {/* > */}
                      {/*   <MenuItem value={"true"}>True</MenuItem> */}
                      {/*   <MenuItem value={"false"}>False</MenuItem> */}
                      {/* </Select> */}
                      <Select
                        value={analyte.expInRange ? "true" : "false"}
                        onChange={(e) =>
                          handleAnalyteInputChange(
                            analyte.analyteID,
                            "expInRange",
                            e.target.value === "true",
                          )
                        }
                        style={{
                          border: "2px solid #4caf50",
                          borderRadius: "4px",
                        }}
                      >
                        <MenuItem value={"true"}>True</MenuItem>
                        <MenuItem value={"false"}>False</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  {/* <TableCell> */}
                  {/*   <FormControl fullWidth> */}
                  {/*     <FormLabel>Edit Mean Value</FormLabel> */}
                  {/*     <EditableTextField */}
                  {/*       variant="outlined" */}
                  {/*       name="mean" */}
                  {/*       type="number" */}
                  {/*       value={analyte.mean} */}
                  {/*       onChange={(e) => */}
                  {/*         handleAnalyteInputChange( */}
                  {/*           analyte.analyteID, */}
                  {/*           "mean", */}
                  {/*           e.target.value, */}
                  {/*         ) */}
                  {/*       } */}
                  {/*       size="small" */}
                  {/*     /> */}
                  {/*   </FormControl> */}
                  {/* </TableCell> */}
                  {/* <TableCell> */}
                  {/*   <FormControl fullWidth> */}
                  {/*     <FormLabel>Edit Mean Value</FormLabel> */}
                  {/*     <EditableTextField */}
                  {/*       variant="outlined" */}
                  {/*       name="mean" */}
                  {/*       type="number" */}
                  {/*       value={analyte.mean} */}
                  {/*       onChange={(e) => */}
                  {/*         handleAnalyteInputChange( */}
                  {/*           analyte.analyteID, */}
                  {/*           "mean", */}
                  {/*           e.target.value, */}
                  {/*         ) */}
                  {/*       } */}
                  {/*       size="small" */}
                  {/*     /> */}
                  {/*   </FormControl> */}
                  {/* </TableCell> */}
                  {/* <TableCell> */}
                  {/*   <FormControl fullWidth> */}
                  {/*     <FormLabel>Edit Min Level</FormLabel> */}
                  {/*     <EditableTextField */}
                  {/*       variant="outlined" */}
                  {/*       name="minLevel" */}
                  {/*       type="number" */}
                  {/*       value={analyte.minLevel} */}
                  {/*       onChange={(e) => */}
                  {/*         handleAnalyteInputChange( */}
                  {/*           analyte.analyteID, */}
                  {/*           "minLevel", */}
                  {/*           e.target.value, */}
                  {/*         ) */}
                  {/*       } */}
                  {/*       size="small" */}
                  {/*     /> */}
                  {/*   </FormControl> */}
                  {/* </TableCell> */}
                  {/* <TableCell> */}
                  {/*   <FormControl fullWidth> */}
                  {/*     <FormLabel>Edit Max Level</FormLabel> */}
                  {/*     <EditableTextField */}
                  {/*       variant="outlined" */}
                  {/*       name="maxLevel" */}
                  {/*       type="number" */}
                  {/*       value={analyte.maxLevel} */}
                  {/*       onChange={(e) => */}
                  {/*         handleAnalyteInputChange( */}
                  {/*           analyte.analyteID, */}
                  {/*           "maxLevel", */}
                  {/*           e.target.value, */}
                  {/*         ) */}
                  {/*       } */}
                  {/*       size="small" */}
                  {/*     /> */}
                  {/*   </FormControl> */}
                  {/* </TableCell> */}
                  <TableCell>
                    <FormControl fullWidth>
                      <FormLabel>Min Level</FormLabel>
                      <TextField
                        variant="outlined"
                        name="minLevel"
                        type="number"
                        value={analyte.minLevel}
                        size="small"
                        InputProps={{ readOnly: true }}
                      />
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <FormLabel>Max Level</FormLabel>
                      <TextField
                        variant="outlined"
                        name="maxLevel"
                        type="number"
                        value={analyte.maxLevel}
                        size="small"
                        InputProps={{ readOnly: true }}
                      />
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <FormLabel>Mean</FormLabel>
                      <TextField
                        variant="outlined"
                        name="Mean"
                        type="number"
                        value={analyte.mean}
                        size="small"
                        InputProps={{ readOnly: true }}
                      />
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <FormLabel>Std Deviation</FormLabel>
                      <TextField
                        variant="outlined"
                        name="stdDevi"
                        type="number"
                        value={analyte.stdDevi}
                        size="small"
                        InputProps={{ readOnly: true }}
                      />
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SignInContainer>
    </AppTheme>
  );
}
