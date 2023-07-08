import React from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { motion } from 'framer-motion';

function App() {
  // eslint-disable-next-line
  const [bg, setBG] = React.useState();
  const [image, setImage] = React.useState(null);
  const [fileErr, setFileErr] = React.useState();
  const inputRef = React.useRef();

  // React.useEffect(() => {
  //   const localStorageColor = localStorage.getItem('bg-colour');
  //   if (!localStorageColor) {
  //     setBG('#2c2c2c');
  //     localStorage.setItem('bg-colour', bg);
  //   } else {
  //     setBG(localStorageColor);
  //   }
  // }, []);


  //convert hex string to rgb colour (got from Chat-GPT ðŸ˜‚)
  function hexToRgb(hex) {
    // Expand shorthand hexadecimal form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

    if (hex == null) {
      return null;
    }
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    // Parse the hexadecimal string into an object with r, g, and b properties
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }

  //function to determine whether colour inputed is too dark or light (got from Chat-GPT ðŸ˜‚)
  function isLightHexColor(hexColor) {
    if (!hexColor) {
      hexColor = "#004d65";
    }
    // Convert the hex color string to an RGB color object
    const color = hexToRgb(hexColor);

    // Calculate the relative luminance of the color
    const luminance = (0.2126 * color.r) + (0.7152 * color.g) + (0.0722 * color.b);

    // Return true if the luminance is greater than or equal to 128,
    // which is considered to be a "light" color according to the W3C's
    // "Accessibility in HTML and CSS" guideline.
    // Otherwise, return false.
    return luminance >= 128;
  }

  return (
    <div className='outerContainer' style={{ backgroundColor: localStorage.getItem('bg-colour') ? localStorage.getItem('bg-colour') : '#004d65' }}>
      <h1 style={{ color: isLightHexColor(localStorage.getItem('bg-colour')) ? 'black' : 'white', marginBottom: '10px' }}>WhiskerWoof</h1>
      <div className="imageContainer">
        {image ? <motion.img
          className="img"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.1,
            ease: [0, 0.91, 0.2, 1.01]
          }}
          src={URL.createObjectURL(image)} alt={image.name} title={image.name}
        /> : ''}
      </div>
      <div className='card'>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Control type="file" onChange={(e) => {
            if (!inputRef.current.files[0] || !inputRef.current.files[0].type.includes('image/')) {
              setFileErr("Please upload an image !!");
              setImage("");

            } else {
              setImage(e.target.files[0]);
              setFileErr("");
            }
          }} ref={inputRef} name='my-file' />
        </Form.Group>
        <div className='innerDiv'> <button style={{ backgroundColor: localStorage.getItem('bg-colour') ? localStorage.getItem('bg-colour') : "#004d65", color: isLightHexColor(localStorage.getItem('bg-colour')) ? 'black' : 'white' }} onClick={() => {
          if (inputRef.current.files[0]) {
            // Get the file input field
            const input = document.querySelector('input[type="file"]');

            // Create a new FormData object
            const data = new FormData();

            // Add the file to the FormData object
            data.append('my-file', input.files[0]);

            //Make request to upload path for node js server running on port: 8000
            axios
              .post('http://localhost:8000/upload', data)
              .then((res) => {
                if (res.status === 200) {
                  console.log(res.data.prediction);
                  const text = `This is a: ${ res.data.prediction[0].className }`;
                  setFileErr(text);
                  const synth = window.speechSynthesis;
                  const utterThis = new SpeechSynthesisUtterance(text);
                  synth.speak(utterThis);
                };
              })
              .catch((err) => console.log(err));
          } else {
            setFileErr("Please enter an image !!");
          }
        }}><b>Upload</b></button>
          <Form.Control
            type="color"
            id="exampleColorInput"
            defaultValue={localStorage.getItem('bg-colour') ? localStorage.getItem('bg-colour') : "#004d65"}
            title="Choose your color"
            onChange={(e) => {
              //For elements with background set to 'bg-colour' in local stroage, a state update is needed for it to take effect
              setBG(e.target.value);
              //Set 'bg-colour' in local storage to the value in colour input field
              localStorage.setItem('bg-colour', e.target.value);
            }}
          /></div>
      </div>
      <h2 style={{ color: isLightHexColor(localStorage.getItem('bg-colour')) ? 'black' : 'white', marginLeft: '10px', marginRight: '10px', marginTop: "10px" }}>{fileErr}</h2>
    </div >
  );
}

export default App;
