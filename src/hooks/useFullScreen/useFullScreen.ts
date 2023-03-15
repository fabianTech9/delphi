function useFullScreen(): any {
  const toggleFullScreen = (containerRef, isFullScreen): void => {
    if (
      !isFullScreen &&
      containerRef &&
      (containerRef.requestFullscreen || containerRef.webkitRequestFullScreen)
    ) {
      if (containerRef.requestFullscreen) {
        containerRef.requestFullscreen();
      } else if (containerRef.webkitRequestFullScreen) {
        containerRef.webkitRequestFullScreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      // @ts-ignore
    } else if (document.webkitCancelFullScreen) {
      // @ts-ignore
      document.webkitCancelFullScreen();
    }
  };

  return toggleFullScreen;
}

export default useFullScreen;
