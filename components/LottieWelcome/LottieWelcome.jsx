import Lottie from "lottie-react";
import lottieWelcome from "../../lottie/lottie_welcome.json";

const LottieWelcome = () => {
  return (
    <div className="w-full h-auto flex flex-col gap-2 items-center justify-center">
      <div className="w-[500px] h-auto">
        <Lottie animationData={lottieWelcome} loop={false} />
      </div>
    </div>
  );
};

export default LottieWelcome;
