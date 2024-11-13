
import './pageStyles/homePage.css';
import HomePageComponents from '../components/homepage_Components/HomePageComponents';
import { useEffect } from 'react';


export default function HomePage(){
    // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return(
    <>  
        <HomePageComponents></HomePageComponents>
        <div>
            Home page
        </div>
    </>
  );
}

