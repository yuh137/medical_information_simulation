import ReportSubTable from "../components/table/Report_Submission_Table";
export default function ReportSubmissionsPage(){
  /*if statement student*/
    return(
      <>
          <ReportSubTable></ReportSubTable>
          <div>
            Report submission page for students
          </div>
          <div>
            Students can submit reports to professors
          </div>
      </>
    );
  /*if statement to return Staff page*/
  /*
    return(
      <>
          <div>
            Report submission page for students
          </div>
          <div>
            Students can submit reports to professors
          </div>
      </>
    );
  */
  }