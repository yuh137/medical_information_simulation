
import { useLocation, Link } from 'react-router-dom'; // Import Link
import './pageStyles/splashPage.css';
import SignUp from '../components/SignUp';

export default function RegisterPage(){
  return(
    <>
        <SignUp></SignUp>
    </>
  );
}