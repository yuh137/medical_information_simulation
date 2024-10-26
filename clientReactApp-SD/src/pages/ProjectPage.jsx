import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Import Link

import "./pageStyles/projectPages.css"

export default function ProjectPage(){
  return(
    <>
      <h2>Project Page</h2>
      <p><b>*UNDER CONSTRUCTION*</b></p>
      <div className="Project-Gallery">
        <figure className="image-container">
            <img className="image lottery" src="https://i.imgur.com/itWmXTO.jpg" draggable="false" />
            <Link to="/lps" style={{ textDecoration: 'none', color: 'inherit' }}>
            <figcaption>Lottery Purchase System</figcaption>
            </Link>
        </figure>
        <figure className="image-container">
            <img className="image assembly" src="https://i.imgur.com/5dPXoTY.jpg" draggable="false" />
            <Link to="/avr" style={{ textDecoration: 'none', color: 'inherit' }}>
            <figcaption>Microcontroller Asteroids Game</figcaption>
            </Link>
        </figure>
        
        <figure className="image-container">
            <img className="image videochat" src="https://i.imgur.com/kyQobki.jpg" draggable="false" />
            <Link to="/staringcontest" style={{ textDecoration: 'none', color: 'inherit' }}>
            <figcaption>Staring Contest Video Chat</figcaption>
            </Link>
        </figure>
        <figure className="image-container">
            <img className="image bioinformatics" src="https://i.imgur.com/bRzg0cD.jpg" draggable="false" />
            <Link to="/drugdiscovery" style={{ textDecoration: 'none', color: 'inherit' }}>
            <figcaption>Drug Discovery App</figcaption>
            </Link>
        </figure>
        <figure className="image-container">
            <img className="image waterTest" src="https://i.imgur.com/BivwvkL.jpg" draggable="false" />
            <Link to="/iotwater" style={{ textDecoration: 'none', color: 'inherit' }}>
            <figcaption>IoT Water Monitor</figcaption>
            </Link>
        </figure>
        <figure className="image-container">
            <img className="image PrisonDash" src="https://i.imgur.com/cza275r.jpg" draggable="false" />
            <Link to="/prison" style={{ textDecoration: 'none', color: 'inherit' }}>
            <figcaption>Prison Analyitical Dashboard</figcaption>
            </Link>
        </figure>
      </div>
    </>
  );
}