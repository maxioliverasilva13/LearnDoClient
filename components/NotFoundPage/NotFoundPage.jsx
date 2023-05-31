import Lottie from "lottie-react";
import lottieNotFound from "../../lottie/lottie_not_found.json";


const NotFoundPage = ({message}) => {
    return <div className="w-screen h-screen flex-grow gap-6 flex flex-col items-center justify-center">
    <div className="w-[400px] h-[300px]">
      <Lottie animationData={lottieNotFound} loop={true} />
      <p className="text-white font-semibold text-[30px] text-center mt-10">
        {message}
      </p>
    </div>
  </div>
}

export default NotFoundPage;
