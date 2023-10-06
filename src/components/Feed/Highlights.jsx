import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { AiOutlineDown } from 'react-icons/ai';

export const Highlights = ({ image }) => {
  return (
    <div className="highlights">
      <div className="year">2023 <AiOutlineDown /></div>
      <Swiper
        className='my-swiper'
        slidesPerView={3}
        freeMode={true}
        spaceBetween={10}
        breakpoints={{
            550: { slidesPerView: 6}
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(monthNumber => (
          <SwiperSlide key={monthNumber}>
            <div className="month">
              <img className='month-image' src={image} />
              <p className="month-number">{monthNumber}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
