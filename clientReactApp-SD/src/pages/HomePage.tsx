
import './pageStyles/homePage.css';
import HomeTable from '../components/table/DataTable';
import HomePageComponents from '../components/homepage_Components/HomePageComponents';


export default function HomePage(){
  return(
    <>
        <HomePageComponents></HomePageComponents>
        <div>
            Home page
        </div>
    </>
  );
}