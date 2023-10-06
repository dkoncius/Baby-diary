import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Header } from '../components/feed/FeedHeader';
import { Highlights } from '../components/feed/FeedHighlights';

import MonthImage from "/assets/feed-2.jpg"


const ImageSwiper = () => {
    return (
      <div className="images">
        <Swiper
          slidesPerView={1.2}
          freeMode={true}
          spaceBetween={10}
          breakpoints={{
            768: {slidesPerView: 3.2}
          }}>
         {[1, 2, 3, 4, 5, 7, 8, 9].map((index, _, array) => (
          <SwiperSlide className="memory-image" key={index}>
            <img src={MonthImage} alt={`Slide ${index}`} />
            <p className="memory-image-number">{index}/{array.length + 1}</p>
          </SwiperSlide>
        ))}
        </Swiper>
      </div>
    );
  };


const FeedPage = () => {
  return (
    <>
       <Header/>
       <Highlights image={MonthImage}/>
        
        <div className="metrics">
            <h2>Mėnesio pokyčiai </h2>
            <div className="metrics-grid">
                <div className="metric-box">
                    <p>ŪGIS</p>
                    <div className="data"></div>
                </div>
                <div className="metric-box">
                    <p>SVORIS</p>
                    <div className="data"></div>
                </div>
                <div className="metric-box">
                    <p>NUOTAIKA</p>
                    <div className="data"></div>
                </div>
            </div>
        </div>

        <div className="feed">
            <h2>Prisiminimai</h2>
            <div className="memory">
                <p className="date">Spalio 10</p>
                <ImageSwiper/>

                <div className="memory-metrics">
                    <div className="metric-box">
                        <p>ŪGIS</p>
                        <p className='metric-number'>48</p>
                    </div>
                    <div className="metric-box">
                        <p>SVORIS</p>
                        <p className='metric-face'>:)</p>
                    </div>
                    <div className="metric-box">
                        <p>NUOTAIKA</p>
                        <p className='metric-number'>3</p>
                    </div>
                </div>

                <div className="memory-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam repellat enim perferendis voluptas illum quod facere in nam, beatae ullam eligendi maiores blanditiis quia sed ducimus autem ex quo deserunt cum amet voluptates cupiditate itaque rerum! Natus cupiditate commodi, nesciunt, dolorum mollitia magnam cumque aperiam eligendi perspiciatis distinctio consequuntur iure.</div>
            </div>
        </div>

        <footer>
          <div className="container">
              <a className='copy'>2023 © Kūdikio dienoraštis</a>
              <div className="social">

                  <a href="#">
                      <i className="fa-brands fa-facebook"></i>
                  </a>
                  
                  <a href="#">
                      <i className="fa-brands fa-spotify"></i>
                  </a>

                  <a href="#">
                      <i className="fa-brands fa-youtube"></i>
                  </a>

              </div>
          </div>
        </footer>
    </>
  )
}

export default FeedPage;