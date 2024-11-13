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

  // Check if IndexedDB has data and delete if it does
  useEffect(() => {
    async function checkIndexedDB() {
      try {
        // Fetch data from your API endpoints
        const [studentsResponse, adminsResponse] = await Promise.all([
          axios.get("http://localhost:5029/api/students"),
          axios.get("http://localhost:5029/api/admins"),
        ]);

        const students = studentsResponse.data;
        const admins = adminsResponse.data;

        console.log("Fetched student data: ", students);
        console.log("Fetched admin data: ", admins);

        // Check if IndexedDB has existing data
        const accountData = await getAccountData();
        if (accountData && accountData.length > 0) {
          // Delete existing data from IndexedDB
          for (const account of accountData) {
            const id = account.id;
            if (account.type === "student") {
              await deleteData("students", id);
            }
            if (account.type === "admin") {
              await deleteData("admins", id);
            }
          }
          console.log("Deleted existing data from IndexedDB.");
        }
      } catch (error) {
        console.error("Error fetching data or clearing IndexedDB:", error);
      }
    }

    checkIndexedDB();
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
