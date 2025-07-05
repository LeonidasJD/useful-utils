const useMediaQuery = () => {
  if (typeof window !== "undefined") {
    return {
      isMobile: window.matchMedia("(max-width: 767px)").matches,
      isTablet: window.matchMedia("(max-width: 1024px)").matches,
      isDesktop: window.matchMedia("(min-width: 1025px)").matches,
    };
  } else {
    return {
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    };
  }
};

export default useMediaQuery;
