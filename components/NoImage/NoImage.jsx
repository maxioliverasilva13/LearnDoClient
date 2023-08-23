import Lottie from "lottie-react";
import lottieNotFound from "../../lottie/lottie_video.json";


const NoImage = () => {
    return <div className="w-full h-full">
      <Lottie className="w-full h-full" animationData={lottieNotFound} loop={true} />
  </div>
}

export default NoImage;
