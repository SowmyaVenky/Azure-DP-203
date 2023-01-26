import * as markerjs2 from 'markerjs2';
import {createRef} from 'react';
import engine from './engine.jpg';
import car1 from './car1.jpg';
import car2 from './car2.jpg';
import car3 from './car3.jpg';
import "./App.css";
import {
    Grid,
    Image,
  } from '@fluentui/react-northstar'


export default function Photos(props) {

    const imgRef = createRef();
    const car1Ref = createRef();
    const car2Ref = createRef();
    const car3Ref = createRef();

    const showMarkerArea = ()  => {
        if (imgRef.current !== null) {
            const markerArea = new markerjs2.MarkerArea(imgRef.current);
            // attach an event handler to assign annotated image back to our image element
            markerArea.addEventListener('render', event => {
              if (imgRef.current) {
                imgRef.current.src = event.dataUrl;
              }
            });
            // launch marker.js
            markerArea.show();
        }
    }

    const imageButtonStyles = {
        minWidth: '72px',
        maxWidth: '72px',
        height: '72px',
        padding: '0',
        margin: '0',
      }

    // const renderImages = () => {
    //     return  (
    //       <>
    //         <Image
    //             ref={imgRef} 
    //             key="engine"
    //             src={engine}
    //             data-is-focusable="true"
    //             onClick={showMarkerArea}
    //             styles={imageButtonStyles}
    //         />
    //         <Image
    //             ref={car1Ref} 
    //             key="car1"
    //             src={car1}
    //             data-is-focusable="true"
    //             onClick={showMarkerArea}
    //             styles={imageButtonStyles}
    //         />
    //         <Image
    //             ref={car2Ref} 
    //             key="car2"
    //             src={car2}
    //             data-is-focusable="true"
    //             onClick={showMarkerArea}
    //             styles={imageButtonStyles}
    //         />
    //         <Image
    //             ref={car3Ref} 
    //             key="car3"
    //             src={car3}
    //             data-is-focusable="true"
    //             onClick={showMarkerArea}
    //             styles={imageButtonStyles}
    //         />
    //       </>
    //     )
    // }

    const renderImages = () => {
        return (
            <>
            <img 
                ref={imgRef} 
                src={engine}
                alt="engine" 
                style={{ maxWidth: '90%' }} 
                onClick={showMarkerArea}
            />
            <img 
                ref={car1Ref} 
                src={car1}
                alt="car1" 
                style={{ maxWidth: '90%' }} 
                onClick={showMarkerArea}
            /> 
            <img 
                ref={car2Ref} 
                src={car2}
                alt="car2" 
                style={{ maxWidth: '90%' }} 
                onClick={showMarkerArea}
            />
            <img 
                ref={car3Ref} 
                src={car3}
                alt="car3" 
                style={{ maxWidth: '90%' }} 
                onClick={showMarkerArea}
            />
            </>
        )
    }

    return (

            <div className="page padding" > 
            {/* style="text-align:center" */}
            <div>
                <h3 className="header">Your Vehicle Images</h3>
            </div>

            <Grid columns="4" content={renderImages()} />
  
            {/* <div className="row">
                <div className="column"> 
                    <img 
                        ref={imgRef} 
                        src={engine}
                        alt="engine" 
                        style={{ maxWidth: '100%' }} 
                        onClick={showMarkerArea}
                    />
                </div>
                <div className="column">
                    <img 
                        ref={car1Ref} 
                        src={car1}
                        alt="car1" 
                        style={{ maxWidth: '100%' }} 
                        onClick={showMarkerArea}
                    />
                 </div>
                <div className="column">   
                    <img 
                        ref={car2Ref} 
                        src={car2}
                        alt="car2" 
                        style={{ maxWidth: '100%' }} 
                        onClick={showMarkerArea}
                    />
                </div>
                <div className="column">
                    <img 
                        ref={car3Ref} 
                        src={car3}
                        alt="car3" 
                        style={{ maxWidth: '100%' }} 
                        onClick={showMarkerArea}
                    />
                </div> 
            </div>  */}
            {/* <div >
                <span onClick="this.parentElement.style.display='none'" >&times;</span>
                <img id="expandedImg" />
                <div id="imgtext"></div>
            </div> */}
        </div>

    
    );
}