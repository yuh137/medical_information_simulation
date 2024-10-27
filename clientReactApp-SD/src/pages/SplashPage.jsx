
import { useLocation, Link } from 'react-router-dom'; // Import Link
import './pageStyles/splashPage.css';

export default function SplashPage(){
  return(
    <>

        <div>
          Splash Page
        </div>
        <div>
          add login and button to register page. Authentication logic here.
        </div>
        <div><Link to="/home" style={{ textDecoration: 'none', color: 'inherit', fontSize: '2rem', fontWeight: 'bold' }}>Go To HomePage</Link></div>
    </>
  );
}