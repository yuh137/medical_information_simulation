
import Button from '@mui/material/Button';
import SlidingGallery from '../components/SlidingGallery.jsx';
import Introduction from '../components/Introduction.jsx';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CodeIcon from '@mui/icons-material/Code';

import './pageStyles/homePage.css';


export default function HomePage(){
  return(
    <>

        <div className='mobileIntro'>
          Hi, I'm Joshua Duplaa
        </div>
        <div className='intro'>
          <div className='profileContainer'>
            
            <div className='profilePic'>
              <img src="https://i.imgur.com/Z8vq1nH.jpg"/>
            </div>
            <div className='professionalTitle'>
              <p>Aspiring<br/>Computer Scientist<br/>and Software Engineer
              <br/> <a className='iconLink' href='https://github.com/joshduplaa'><GitHubIcon/></a> <a className='iconLink' href='https://www.linkedin.com/in/joshua-duplaa-487502178/'><LinkedInIcon/></a> <a className='iconLink' href='https://leetcode.com/joshduplaa/'><CodeIcon/></a> </p>
            </div>
          </div>
          <div id = 'personalStatement'>
            <Introduction></Introduction>
          </div>
          
        </div>
        <div id = "resume">
            <Button
              variant="outlined"
              color="success"
              href="https://drive.google.com/uc?export=download&id=1_X__liQI7fJLtBbgVuGKJ67_sS49ZaMo"
              download="JoshuaDuplaa_Resume.pdf"
              sx = {{fontWeight: '900'}}
            >
              Download Resume
            </Button>
        </div>
        <h2 className='Projects'>Projects</h2>
        <div className='ProjectsSub'>*click and drag images to scroll*</div>

        <SlidingGallery></SlidingGallery>
    
    </>
  );
}