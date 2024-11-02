
import { useLocation, Link } from 'react-router-dom'; // Import Link
import './pageStyles/splashPage.css';
import SignIn from '../components/SignIn';
import BaseCard from '../components/BaseCard';
import SliderComponent from '../components/SliderComponent';
import APITest from '../components/APITest';
import SignUp from '../components/SignUp';

export default function SplashPage(){
  return(
    <>
        <SignIn></SignIn>
        <div>
          add login and button to register page. Authentit
        </div>
         <div><Link to="/home" style={{ textDecoration: 'none', color: 'inherit', fontSize: '2rem', fontWeight: 'bold' }}>Go To HomePage</Link></div>
         <div><Link to="/register" style={{ textDecoration: 'none', color: 'inherit', fontSize: '2rem', fontWeight: 'bold' }}>Register Account</Link></div>
    </>
  );
}