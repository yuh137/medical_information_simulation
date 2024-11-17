import React from "react";
import ReportSubTable from "../components/table/Report_Submission_Table";
import HandleSubmit from "../components/HandleSubmit";

export default function ReportSubmissionsPage() {
  const isStudent = true; // Replace with your actual condition for checking student vs. staff


  return (
    <>
      {isStudent ? (
        <div style={styles.pageContainer}>
          <div>
            <h2>Report Submission Page for Students</h2>
            <p>Students can submit reports to professors.</p>
          </div>
          <div style={styles.bottomRightContainer}>
            <HandleSubmit/>
            <div style={styles.fixedBottomRight}>
              <button style={styles.button} onClick={() => console.log("Printing report as PDF")}>
                Print Report as PDF
              </button>
              <button style={styles.button} onClick={() => console.log("Submitting report")}>
                Submit Report
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2>Staff View</h2>
          <p>This is the staff page content.</p>
        </div>
      )}
    </>
  );
}

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100vh",
    padding: "20px",
    position: "relative",
  },
  bottomRightContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    position: "absolute",
    bottom: "20px",
    right: "20px",
    gap: "10px", // Adds spacing between the table, submit button, and print button
  },
  fixedBottomRight: {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};