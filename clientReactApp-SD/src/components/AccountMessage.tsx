import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme.tsx";
//import ColorModeSelect from "../shared-theme/ColorModeSelect.tsx";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";

import { useEffect, useState } from "react";
//import { UserProvider,useUser } from "./AccessIndexedDB.tsx"
import { getAccountData } from "../util/indexedDB/getData.ts";
import { Admin, Student } from "../util/indexedDB/IDBSchema";
import { To, useNavigate } from 'react-router-dom';

import { Resend } from 'resend';
//import { Email } from 'email';

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

//Grab user info from one of the account tables
async function fetchFirstName(): Promise<string> {
  const accountData = await getAccountData();
  if (accountData && Array.isArray(accountData) && accountData.length > 0) {
    const user = accountData[0] as Admin | Student;
    return `${user.firstname}`;
  }
  return 'Error';
}
async function fetchLastName(): Promise<string> {
  const accountData = await getAccountData();
  if (accountData && Array.isArray(accountData) && accountData.length > 0) {
    const user = accountData[0] as Admin | Student;
    return `${user.lastname}`;
  }
  return 'Error';
}
async function fetchUserEmail(): Promise<string> {
  const accountData = await getAccountData();
  if (accountData && Array.isArray(accountData) && accountData.length > 0) {
    const user = accountData[0] as Admin | Student;
    return `${user.email}`;
  }
  return 'Error';
}
//Grab name from one of the account tables
async function fetchUserType(): Promise<string> {
  const accountData = await getAccountData();
  if (accountData && Array.isArray(accountData) && accountData.length > 0) {
    const user = accountData[0] as Admin | Student;
    return `${user.type}`;
  }
  return 'Not registered as student or admin';
}

//Email stuff
const resend = new Resend('re_123456789');//Update with Resend API key (need to generate one for the project)
async function sendEmail(fromEmail, toEmail, text){
  await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: 'MIS Notification',
    react: <Email url="https://example.com" />,
  });
}

export default function AccountMessage(props: {
  disableCustomTheme?: boolean;
}) {
  const [userFirstName, setUserFirstName] = useState<string>('User');
  const [userLastName, setUserLastName] = useState<string>('User');
  const [userType, setUserType] = useState<string>('Type');
  const [userEmail, setUserEmail] = useState<string>('User');
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const validateInputs = () => {
    let isValid = true;

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    return isValid;
  };

  // Fetch the user's name from IndexedDB on component mount
  useEffect(() => {
    async function fetchName() {
      const firstname = await fetchFirstName();
      const lastname = await fetchLastName();
      const email = await fetchUserEmail();
      setUserFirstName(firstname);
      setUserLastName(lastname);
      setUserEmail(email);
    }
    fetchName();
    async function fetchType() {
      const user_type = await fetchUserType();
      setUserType(user_type);
    }
    fetchType();
  }, []);
  //for log out
  const navigate = useNavigate();
  const clearObjectStore = (dbName: string, storeName: string) => {
    const request = indexedDB.open(dbName);
    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      store.clear();
      console.log(`Cleared object store: ${storeName}`);
    
    };
  };
  const handleNavigation = (path: To) => {
    navigate(path);
  };
  
  //for email

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        {/* Replace card with you*/}
        <Card>
          <h1>Account Page</h1>
          <div>
            <Grid container spacing={4}>
              <Grid size={6}>
                <Item>
                  <div>
                    <br />
                    <h3>User Information</h3>
                    {userFirstName && userLastName && userEmail ? (
                      <>
                        
                        First Name: {userFirstName}
                        <br /><br />
                        Last Name: {userLastName}
                        <br /><br />
                        E-mail: {userEmail}
                        <br /><br />
                      </>
                    ) : (
                      <p>Error getting user information</p>
                    )}
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
                    <Button variant="outlined"
                      onClick={() => {
                      // Clear all relevant object stores
                      clearObjectStore('MIS_database', 'admins');
                      clearObjectStore('MIS_database', 'students');
                      clearObjectStore('MIS_database', 'qc_store');
                      handleNavigation('/');
                      }}
                    >SIGN OUT</Button> <br />
                    <br />
                    Send message to Professor: <br />
                    <StyledFormBox
                      component="form"
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        error={emailError}
                        helperText={emailErrorMessage}
                        id="email"
                        type="email"
                        name="email"
                        label="professor@email.com"
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </StyledFormBox>
                    <StyledFormBox
                      component="form"
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        //id="standard-basic"
                        id="body"
                        type="body"
                        name="body"
                        label="Enter message here."
                        variant="standard"
                        multiline
                        rows={4}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                      />
                    </StyledFormBox>{" "}
                    <br />
                    <Button variant="outlined"
                      onClick={() => {
                        //Grab the data entered and build the email 
                        if(validateInputs()){
                          sendEmail({userEmail}, {email}, {body});
                          setEmail("");  // Clear the email field
                          setBody("");   // Clear the body field
                        }else{
                          setEmailError(true);
                          setEmailErrorMessage("Please enter a valid email address.")
                        }
                        
                      }}
                    >SEND</Button> <br />
                  </div>
                </Item>
              </Grid>
            </Grid>
          </div>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
