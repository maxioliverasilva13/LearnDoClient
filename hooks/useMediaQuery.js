import { useEffect, useState } from "react";

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isSmallMobile: false,
    isSmall: false,
  });

  useEffect(() => {
    const getWindowDimensions = () => {
      const widths = [window.innerWidth];
      const heights = [window.innerHeight];

      if (window.screen?.width) {
        widths.push(window.screen?.width);
      }
      if (window.screen?.height) {
        heights.push(window.screen?.height);
      }

      const width = Math.min(...widths);
      const height = Math.min(...heights);

      return {
        width,
        height,
        isMobile: width <= 768,
        isTablet: width >= 768 && width <= 1024,
        isSmallMobile: width <= 450,
        isSmall: width <= 640,
      };
    };

    setWindowDimensions(getWindowDimensions());

    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
