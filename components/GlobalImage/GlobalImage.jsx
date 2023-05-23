import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

const GlobalImage = ({ src, className, objectFit, layout }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <Image
      onLoadingComplete={handleLoadingComplete}
      src={src}
      loader={() => src}
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
