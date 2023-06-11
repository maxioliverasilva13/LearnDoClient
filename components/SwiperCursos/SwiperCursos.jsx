import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectFade, Navigation, Pagination } from "swiper";
import SwiperCurso from "./components/SwiperCruso";

const cursos = [
  {
    nombre: "Curso php",
    imagen: "https://kinsta.com/es/wp-content/uploads/sites/8/2023/01/que-es-pseudocodigo-1024x512.png",
    clases: 30,
    mainCategoria: "Programacion",
  },
  {
    nombre: "Java de cero a experto",
    imagen: "https://process.fs.teachablecdn.com/ADNupMnWyR7kCWRvm76Laz/resize=width:705/https://www.filepicker.io/api/file/X3O3nWaR16Wiw1vbloQq",
    clases: 12,
    mainCategoria: "Java Developer",
  },
];

const SwiperCursos = () => {
  return (
    <div className="w-full md:w-[70%] m-auto px-10 md:px-20 overflow-hidden">
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        loop={true}
        modules={[EffectFade, Navigation, Pagination]}
        className="mySwiper md:max-h-[500px] md:h-[500px] max-h-[400px] h-[400px] w-full"
      >
        {cursos?.map((item) => {
          return (
            <SwiperSlide key={item?.nombre} className="w-full h-full">
              <SwiperCurso {...item} />{" "}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default SwiperCursos;
