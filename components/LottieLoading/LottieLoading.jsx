import Lottie from "lottie-react";
import lottieLoading from "../../lottie/lottie_loading.json";

const LottieLoading = ({ message }) => {
  return (
    <div className="w-full h-auto flex flex-col gap-2 items-center justify-center">
      <div className="w-[100px] h-100px">
        <Lottie animationData={lottieLoading} loop={true} />
        <p className="text-white font-semibold text-[30px] text-center mt-10">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LottieLoading;
