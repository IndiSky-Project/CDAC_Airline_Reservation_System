
import React from 'react';
import { Carousel } from 'react-bootstrap';
import '../css/AdvertisementSlider.css';

const AdvertisementSlider = () => {
  const slides = [
    {
      image: '/ads/ad1.jpg',
      headline: 'Fly High with IndiSky',
      sub: 'Get amazing deals on domestic flights starting at ₹999!',
    },
    {
      image: '/ads/ad2.jpg',
      headline: 'Book Early & Save More',
      sub: 'Advance booking discounts available now!',
    },
    {
      image: '/ads/ad3.jpg',
      headline: 'Weekend Getaways',
      sub: 'Plan your perfect weekend trip with exciting offers.',
    }
  ];

  return (
    <div className="ad-slider my-5">
      <Carousel fade indicators={true} controls={false} interval={4000} pause={false}>
        {slides.map((slide, idx) => (
          <Carousel.Item key={idx}>
            <img className="d-block w-100" src={slide.image} alt={`Slide ${idx}`} />
            <Carousel.Caption>
              <h3>{slide.headline}</h3>
              <p>{slide.sub}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default AdvertisementSlider;
