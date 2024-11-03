
import { useLocation, Link } from 'react-router-dom'; // Import Link
import './pageStyles/splashPage.css';
import SignUp from '../components/SignUp';

export default function RegisterPage(){
  return(
    <>
    <div>
          RegisterPage
        </div>
        <div>
          register page. Add account to database
        </div>
        <SignUp></SignUp>
        <div><Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontSize: '2rem', fontWeight: 'bold' }}>Go To SplashPage</Link></div>
    </>
  );
}