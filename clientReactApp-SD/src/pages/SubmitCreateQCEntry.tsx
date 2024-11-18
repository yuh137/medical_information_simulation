import "./pageStyles/homePage.css";
import PanelsToOrderTable from "../components/table/PanelsToOrderTable";
import CreateQCPanelGrid from "../components/table/CreateQCPanelGrid";

export default function SubmitCreateQCEntry() {
  return (
    <>
      <CreateQCPanelGrid></CreateQCPanelGrid>
      <div>Create new QC Panel</div>
    </>
  );
}
