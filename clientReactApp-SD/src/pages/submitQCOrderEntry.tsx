
import './pageStyles/homePage.css';
import PanelsToOrderTable from '../components/table/PanelsToOrderTable';

export default function SubmitQCOrderEntry(){
  return(
    <>
        <PanelsToOrderTable></PanelsToOrderTable>
        <div>
            Input QC results page 
        </div>
    </>
  );
}