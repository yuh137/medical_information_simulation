
import Button from '@mui/material/Button';


export default function AboutMe(){
  return(
    <>
      <h2>About Me Page</h2>
      <p><b>*UNDER CONSTRUCTION*</b></p>
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
    </>
  );
}
