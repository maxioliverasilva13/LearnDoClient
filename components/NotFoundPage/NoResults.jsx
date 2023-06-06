import Lottie from "lottie-react";
import lottieNoResults from "../../lottie/lottie_not_results.json";
import clsx from "clsx";


const NoResults = ({message, customSizes = null}) => {
    return <div className="w-full h-auto flex flex-col gap-2 items-center justify-center">
        <div className={clsx(customSizes ? customSizes : "w-[400px] h-[400px]")}>
      <Lottie animationData={lottieNoResults} loop={true} />
      <p className="text-white font-semibold text-[30px] text-center mt-10">
        {message}
      </p>
    </div>
    </div>
}

export default NoResults;