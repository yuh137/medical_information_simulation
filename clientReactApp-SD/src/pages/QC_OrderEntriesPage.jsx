import QCOrderTable from "../components/table/QC_Order_Table";

export default function QC_OrderEntriesPage(){
    return(
      <>
          <QCOrderTable></QCOrderTable>
          <div>
            Quality Controls Current Order Entries Page
          </div>
          <div>
            View current in progress quality controls .
          </div>
      </>
    );
  }