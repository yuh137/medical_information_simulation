import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme.tsx";
import ColorModeSelect from "../shared-theme/ColorModeSelect.tsx";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";

import { useEffect, useState } from "react";
import { UserProvider,useUser } from "./AccessIndexedDB.tsx"
import { getAccountData, getDataByKey } from "../util/indexedDB/getData.ts";
import { Admin, Student } from "../util/indexedDB/IDBSchema";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "10px",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "1920px",
  },
  backgroundColor: theme.palette.mode === "dark" ? "#457A64" : "#607D8B", // Darker steel blue for dark mode, lighter steel blue for light mode
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
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
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundColor: theme.palette.mode === "dark" ? "#457A64" : "#607D8B", // Darker steel blue for dark mode, lighter steel blue for light mode
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const StyledFormBox = styled(Box)(({ theme }) => ({
  "& > :not(style)": {
    margin: theme.spacing(1),
    width: "80%",
  },
  //position: 'fixed',
  //top: '44%',       // 44% down from the top of the viewport
  //left: '65%',      // 65% from the left of the viewport
  //transform: 'translate(-50%, -25%)',  // Centers the box based on its own size
  [theme.breakpoints.down("sm")]: {
    //top: '30%',      // Adjust for smaller screens if necessary
    //left: '50%',
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));
// Styled container for the grid layout
const StyledGridContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
}));

// Styled grid items
const StyledGridItem = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.primary,
}));

/* The main BasicGrid component
const BasicGrid = () => (
  <StyledGridContainer>
    <Grid container spacing={2}>
      <StyledGridItem item xs={8}>
        <Item>size=8</Item>
      </StyledGridItem>
      <StyledGridItem item xs={4}>
        <Item>size=4</Item>
      </StyledGridItem>
      <StyledGridItem item xs={4}>
        <Item>size=4</Item>
      </StyledGridItem>
      <StyledGridItem item xs={8}>
        <Item>size=8</Item>
      </StyledGridItem>
    </Grid>
  </StyledGridContainer>
);
*/
/*
async function getData(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MIS_database");

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const dataRequest = id ? store.get(id) : store.getAll();

      dataRequest.onsuccess = () => resolve(dataRequest.result);
      dataRequest.onerror = (event) => reject(event);
    };

    request.onerror = (event) => reject(event);
  });
}
*/
const AccountDataPage = () => {
  const [accountData, setAccountData] = useState<Admin[] | Student[] | null>(
    JSON.parse(localStorage.getItem('accountData') || 'null')
  );

  useEffect(() => {
    async function fetchData() {
      if (!accountData) {
        const data = await getAccountData();
        setAccountData(data);
        localStorage.setItem('accountData', JSON.stringify(data)); // Save data in localStorage
      }
    }

    fetchData();
  }, [accountData]);
}
type Admin = {
    id: string;
    email: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    initials: string;
  }
type Student = {
    id: string;
    email: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    initials: string;
}
export default function AccountMessage(props: {
  disableCustomTheme?: boolean;
}) {
  const [userData, setUserData] = useState<Admin[] | Student[] | null>(null);

  useEffect(() => {
    async function fetchAccountData() {
      try {
        const storeName = "students"; // Example: "students" store
        const id = "5a1f9e80-5b21-11d3-9a0c-0305e82c3301"; // Example user ID
        const data = await getDataByKey(storeName, id);

        if (data === null) {
          console.error("No data found for this ID");
        } else if (typeof data === "string") {
          console.error("Error:", data);
        } else {
          setUserData(data); // Store data in state if it's not null or an error message
        }/*
        const data = await getDataByKey("students", "5a1f9e80-5b21-11d3-9a0c-0305e82c3301");//getAccountData();
        if (data) {
          setUserData(data);
        } else {
          console.error("No data found");
        }*/
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchAccountData();
  }, []);
  //getData("students", "5a1f9e80-5b21-11d3-9a0c-0305e82c3301");
  //const userData = getAccountData();
  
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        {/* Replace card with you*/}
        {/*<h1>Account Page</h1>*/}
        {/*<UserProvider>*/}
        <Card>
          <h1>Account Page</h1>
          <div>
            <Grid container spacing={4}>
              <Grid size={6}>
                <Item>
                  <div>
                    {userData && userData[1] ? (
                      <>
                        First Name: <p>{userData[1].firstname}</p>
                        <br />
                        Last Name: <p>{userData[1].lastname}</p>
                        <br />
                        E-mail: <p>{userData[1].email}</p>
                        <br />
                        Department, Section: NULL
                      </>
                    ) : (
                      <p>Loading...</p>
                    )}
                    {/*
                    <h3>Basic Info</h3>
                    First Name: <p>userData[1].firstname</p>
                    <br />
                    Last Name: {/*user.lastname/}
                    <br />
                    E-mail: {/*user.email/}
                    <br />
                    Department, Section: NULL
                    <br />
                    */}
                  </div>
                </Item>
              </Grid>
              <Grid size={6}>
                <Item>
                  <div>
                    <br />
                    <h3>User Settings</h3>
                    Privacy Info? <br />
                    <br />
                    <Button variant="outlined">SIGN OUT</Button> <br />
                    <br />
                    Send message to Professor: <br />
                    <StyledFormBox
                      component="form"
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        id="standard-basic"
                        label="professor@email.com"
                        variant="standard"
                      />
                    </StyledFormBox>
                    <StyledFormBox
                      component="form"
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        id="standard-basic"
                        label="Enter message here."
                        variant="standard"
                        multiline
                        rows={4}
                      />
                    </StyledFormBox>{" "}
                    <br />
                    <Button variant="outlined">SEND</Button> <br />
                  </div>
                </Item>
              </Grid>
            </Grid>
            {/*
            <div>
            <h3>Basic Info</h3>
            First Name: <br />
            Last Name: <br />
            E-mail: <br />
            Department, Section: <br />
            </div>
            <div>
            <br />
            <h3>User Settings</h3>
            Privacy Info? <br />
            <br />
            <Button variant="outlined">SIGN OUT</Button> <br />
            <br />
            Send message to Professor: <br />
            <StyledFormBox component="form" noValidate autoComplete="off">
            <TextField
              id="standard-basic"
              label="professor@email.com"
              variant="standard"
              /*multiline
              rows={1}
            />
            </StyledFormBox>
            <StyledFormBox component="form" noValidate autoComplete="off">
            <TextField
              id="standard-basic"
              label="Enter message here."
              variant="standard"
              multiline
              rows={4}
            />
            </StyledFormBox> <br />
            <Button variant="outlined">SEND</Button> <br />
            </div>*/}
          </div>
        </Card>
        {/*</UserProvider>*/}
      </SignInContainer>
    </AppTheme>
  );
}
