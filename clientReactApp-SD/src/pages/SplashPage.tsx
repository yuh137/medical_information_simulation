import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './pageStyles/splashPage.css';
import SignIn from '../components/SignIn';
import { getAccountData } from '../util/indexedDB/getData';
import { deleteData } from "../util/indexedDB/deleteData";
import addData from "../util/indexedDB/addData";
import { Admin, Student } from "../util/indexedDB/IDBSchema";
import axios from "axios";


export default function SplashPage() {
  const navigate = useNavigate();


  //Check if user is logged in, redirect to home if they are.
  async function checkIfLoggedIn(): Promise<string> {
    const accountData = await getAccountData();
    if (accountData && Array.isArray(accountData) && accountData.length > 0) {
      const account = accountData[0];
      console.log(`User of type ${account.type} already logged in`);
      navigate('/home');
      return "loggedIn";
    }
    return "loggedOut";
  }

  useEffect(() => {
    checkIfLoggedIn();
  }, [navigate]);


  return (
    <>
      <SignIn />
      <div>
        Add login and button to register page. Authenticate
      </div>
      <div>
        <Link
          to="/home"
          style={{ textDecoration: 'none', color: 'inherit', fontSize: '2rem', fontWeight: 'bold' }}
        >
          Go To HomePage
        </Link>
      </div>
      <div>
        <Link
          to="/register"
          style={{ textDecoration: 'none', color: 'inherit', fontSize: '2rem', fontWeight: 'bold' }}
        >
          Register Account
        </Link>
      </div>
    </>
  );
}
