import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  TextField,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme.tsx";
import ColorModeSelect from "../shared-theme/ColorModeSelect.tsx";

// Import utility functions
import initIDB from "../util/indexedDB/initIDB";
import addData from "../util/indexedDB/addData";

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

const SignUpContainer = styled(Stack)(({ theme }) => ({
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
    backgroundColor: theme.palette.mode === 'dark' ? '#457A64' : '#607D8B', // Darker steel blue for dark mode, lighter steel blue for light mode
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [studentChecked, setStudentChecked] = useState(false);
  const [facultyChecked, setFacultyChecked] = useState(false);

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const username = document.getElementById("name") as HTMLInputElement;
    const firstname = document.getElementById("firstname") as HTMLInputElement;
    const lastname = document.getElementById("lastname") as HTMLInputElement;
    const initials = document.getElementById("initials") as HTMLInputElement;

    let isValid = true;

    // Validate email
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // Validate password
    if (!password.value || password.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 8 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    // Validate username
    if (!username.value || username.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Username is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    // Validate firstname
    if (!firstname.value || firstname.value.length < 1) {
      setResultMessage("First name is required.");
      isValid = false;
    } else {
      setResultMessage(null);
    }

    // Validate lastname
    if (!lastname.value || lastname.value.length < 1) {
      setResultMessage("Last name is required.");
      isValid = false;
    } else {
      setResultMessage(null);
    }

    // Validate initials
    if (!initials.value || initials.value.length < 1) {
      setResultMessage("Initials are required.");
      isValid = false;
    } else {
      setResultMessage(null);
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs() || (!studentChecked && !facultyChecked)) {
      setResultMessage("Please fill all required fields and select a role.");
      return;
    }

    const username = (document.getElementById("name") as HTMLInputElement)
      .value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const firstname = (document.getElementById("firstname") as HTMLInputElement)
      .value;
    const lastname = (document.getElementById("lastname") as HTMLInputElement)
      .value;
    const initials = (document.getElementById("initials") as HTMLInputElement)
      .value;
    const roles = studentChecked ? ["Student"] : ["Admin"];

    setLoading(true);
    setResultMessage(null);

    try {
      // Send registration data to the API
      // If student checked, sends to student table. If Faculty checked, sends to admin table
      if (studentChecked) {
        const response = await axios.post(
          `http://localhost:5029/api/students`,
          {
            Username: username,
            Email: email,
            Password: password,
            Firstname: firstname,
            Lastname: lastname,
            Initials: initials,
          },
        );
        if (response.status === 201) {
          setResultMessage("Registration successful.");
          navigate("/");
        }
      } else if (facultyChecked) {
        const response = await axios.post(`http://localhost:5029/api/admins`, {
          Username: username,
          Email: email,
          Password: password,
          Firstname: firstname,
          Lastname: lastname,
          Initials: initials,
        });
        if (response.status === 201) {
          setResultMessage("Registration successful.");
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      if (axios.isAxiosError(error) && error.response) {
        setResultMessage(
          `Registration failed: ${error.response.data.message || "Please try again."}`,
        );
      } else {
        setResultMessage("Failed to register. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Request Account
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Username</FormLabel>
              <TextField
                autoComplete="username"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="JonSnow123"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="firstname">First Name</FormLabel>
              <TextField
                autoComplete="given-name"
                name="firstname"
                required
                fullWidth
                id="firstname"
                placeholder="Jon"
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="lastname">Last Name</FormLabel>
              <TextField
                autoComplete="family-name"
                name="lastname"
                required
                fullWidth
                id="lastname"
                placeholder="Snow"
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="initials">Initials</FormLabel>
              <TextField
                name="initials"
                required
                fullWidth
                id="initials"
                placeholder="JS"
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@hsc.ttu.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? "error" : "primary"}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>

            {/* Role selection (Student or Faculty) */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                component="h2"
                variant="h6"
                sx={{
                  fontSize: "1rem",
                  textAlign: "left",
                  color: "red",
                  marginRight: 1,
                }}
              >
                *
              </Typography>
              <Typography
                component="h2"
                variant="h6"
                sx={{ fontSize: "1rem", textAlign: "left" }}
              >
                I am registering as a:
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={studentChecked}
                  onChange={(e) => setStudentChecked(e.target.checked)}
                  color="primary"
                />
              }
              label="Student"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={facultyChecked}
                  onChange={(e) => setFacultyChecked(e.target.checked)}
                  color="primary"
                />
              }
              label="Faculty"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign up"}
            </Button>
            {resultMessage && (
              <Typography
                variant="body2"
                color={
                  resultMessage.includes("successful") ? "primary" : "error"
                }
                align="center"
              >
                {resultMessage}
              </Typography>
            )}
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
