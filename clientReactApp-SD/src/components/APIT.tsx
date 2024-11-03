import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

interface Student {
  studentID: string;
  firstname: string;
  lastname: string;
}

const APIT: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5029/api/students");
        console.log(response.data);
        setStudents(response.data);
      } catch (err) {
        setError(true);
      }
    };

    fetchStudents();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" component="div" gutterBottom>
        Student List
      </Typography>

      {students.length > 0 ? (
        <List>
          {students.map((student) => (
            <ListItem key={student.studentID} divider>
              <ListItemText
                primary={`${student.firstname} ${student.lastname}`}
                secondary={`ID: ${student.studentID}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No students found.
        </Typography>
      )}

      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => setError(false)}
      >
        <MuiAlert
          onClose={() => setError(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to load students. Please try again.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default APIT;
