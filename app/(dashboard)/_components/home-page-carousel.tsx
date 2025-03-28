// components/home-page-carousel.tsx
"use client";
import Slider from "react-slick";
import Box from "@/components/box";
import Image from "next/image";

const images = [
  "/img/cv.png",
  "/img/Logo.jpg",
  "/img/Logo.png",
  "/img/Logo2.jpg",
  "/img/Logo3.png",
  "/img/Logo4.jpg"
];

const HomePageCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000, // سرعة الانتقال بين الشرائح
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000, // تغيير كل 10 ثواني
    adaptiveHeight: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          dots: false
        }
      }
    ]
  };

  return (
    <Box className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg mt-6 mb-6">
      <Slider {...settings} className="w-full h-full">
        {images.map((src, index) => (
          <div key={index} className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
            <Image
              alt={`Carousel Image ${index + 1}`}
              src={src}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </Box>
  );
};

export default HomePageCarousel;