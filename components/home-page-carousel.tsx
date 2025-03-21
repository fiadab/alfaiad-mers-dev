"use client";
import Slider from "react-slick";
import Box from "@/components/box";
import Image from "next/image";

const images = [
  "/img/Logo.png",
  "/img/Logo2.jpg",
  "/img/Logo3.png",
  "/img/Logo4.jpg"
];

const HomePageCarousel = () => {
  return (
    <Box className="relative overflow-hidden h-64 justify-center rounded-lg mt-12">
      <Slider
        dots={true}
        infinite={true}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        autoplay={true}
        autoplaySpeed={3000}
      >
        {images.map((src, index) => (
          <div key={index}>
            <Image
              alt={`Carousel Image ${index + 1}`}
              src={src}
              width={1000}
              height={240}
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </Box>
  );
};

export default HomePageCarousel;
