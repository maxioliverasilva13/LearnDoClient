import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

const GlobalImage = ({ src, className, objectFit, layout }) => {
  const [isLoading, setIsLoading] = useState(true);
  const imageSrc = src || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <Image
      onLoadingComplete={handleLoadingComplete}
      src={imageSrc}
      loader={() => imageSrc}
      className={clsx(
        className,
        "transition-all",
        isLoading && "animate-pulse bg-gray-200"
      )}
      objectFit={objectFit}
      layout={layout}
    />
  );
};

export default GlobalImage;
