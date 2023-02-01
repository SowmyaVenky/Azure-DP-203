import * as markerjs2 from 'markerjs2';
import {createRef} from 'react';
import engine from './engine.jpg';
import car1 from './car1.jpg';
import car2 from './car2.jpg';
import car3 from './car3.jpg';
import {
    Carousel,
    Image,
  } from '@fluentui/react-northstar'
import style from './Photos.module.css'
import { Header, Divider, Provider} from '@fluentui/react-northstar';

export default function Photos(props) {

    const imgRef = createRef();
    const car1Ref = createRef();
    const car2Ref = createRef();
    const car3Ref = createRef();

    const showMarkerArea = (ref)  => {
        if (ref.current !== null) {
            const markerArea = new markerjs2.MarkerArea(ref.current);
            markerArea.addEventListener('render', event => {
              if (ref.current) {
                ref.current.src = event.dataUrl;
              }
            });
            markerArea.settings.displayMode = 'popup';
            markerArea.show();
        }
    }

    const carouselItems = [
        {
            key: 'engine',
            id: 'engine',
            content: (
              <Image
                ref={imgRef}
                src={engine}
                fluid
                alt='engine'
                onClick={() => showMarkerArea(imgRef)}
                className={style.image}
              />
            ),
            'aria-label': 'engine',
          },
          {
            key: 'car1',
            id: 'car1',
            content: (
              <Image
                ref={car1Ref}
                src={car1}
                fluid
                alt='car1'
                className={style.image}
                onClick={() => showMarkerArea(car1Ref)}
              />
            ),
            'aria-label': 'car1',
          },
          {
            key: 'car2',
            id: 'car2',
            content: (
              <Image
                ref={car2Ref}
                src={car2}
                fluid
                alt='car2'
                className={style.image}
                onClick={() => showMarkerArea(car2Ref)}
              />
            ),
            'aria-label': 'car2',
          },
          {
            key: 'car3',
            id: 'car3',
            content: (
              <Image
                ref={car3Ref}
                src={car3}
                fluid
                alt='car3'
                className={style.image}
                onClick={() => showMarkerArea(car3Ref)}
              />
            ),
            'aria-label': 'car3',
          },
          
    ]

    

    return (

        <div className={style.page} > 
            <div className={style.header}>
              <Divider color="brand" content="Diagnostic Vehicle Images" size={3} important/>
            </div>
            <div className={style.center}>
            <Provider
    theme={{
      animations: {
        enterFromRight: {
          keyframe: {
            '0%': {
              transform: 'translateX(100%)',
            },
            '100%': {
              transform: 'translateX(0px)',
            },
          },
          duration: '1s',
          timingFunction: 'cubic-bezier(0.33,0.00,0.67,1.00)',
          fillMode: 'forwards',
        },
        enterFromLeft: {
          keyframe: {
            '0%': {
              transform: 'translateX(-100%)',
            },
            '100%': {
              transform: 'translateX(0px)',
            },
          },
          duration: '1s',
          timingFunction: 'cubic-bezier(0.33,0.00,0.67,1.00)',
          fillMode: 'forwards',
        },
        exitToLeft: {
          keyframe: {
            '0%': {
              position: 'absolute',
              transform: 'translateX(0px)',
            },
            '100%': {
              position: 'absolute',
              transform: 'translateX(-100%)',
            },
          },
          duration: '1s',
          timingFunction: 'cubic-bezier(0.33,0.00,0.67,1.00)',
          fillMode: 'forwards',
        },
        exitToRight: {
          keyframe: {
            '0%': {
              position: 'absolute',
              transform: 'translateX(0px)',
            },
            '100%': {
              position: 'absolute',
              transform: 'translateX(100%)',
            },
          },
          duration: '1s',
          timingFunction: 'cubic-bezier(0.33,0.00,0.67,1.00)',
          fillMode: 'forwards',
        },
      },
    }}
  >
                <Carousel
                    animationEnterFromNext='enterFromRight'
                    animationEnterFromPrev='enterFromLeft'
                    animationExitToPrev='exitToLeft'
                    animationExitToNext='exitToRight'
                    className={style.carousel}
                    aria-roledescription="carousel"
                    aria-label="Image collection"
                    navigation={{
                    'aria-label': 'car images',
                    items: carouselItems.map((item, index) => ({
                        key: item.id,
                        'aria-label': item.id,
                        'aria-controls': item.id,
                        })),
                    }}
                    items={carouselItems}
                    getItemPositionText={(index, size) => `${index + 1} of ${size}`}
                />
                </Provider>
            </div>
        </div>    
    );
}