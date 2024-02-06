import * as React from "react";

export default function useCountDown(
  duration: number,
  runTimer: boolean,
  setRunTimer: any,
  dependencies: any[]
) {
  const [countDown, setCountDown] = React.useState<number>(60 * duration);
  React.useEffect(() => {
    let timerId: any = null;
    if (!countDown && runTimer) {
      setCountDown(60 * duration);
    }
    if (runTimer) {
      timerId = setInterval(() => {
        setCountDown((countDown) => countDown - 1);
      }, 1000);
    } else {
      clearInterval(timerId);
    }
    return () => clearInterval(timerId);
    // eslint-disable-next-line
  }, dependencies);

  React.useEffect(() => {
    if (countDown < 0 && runTimer) {
      setRunTimer(false);
      setCountDown(0);
    }
    // eslint-disable-next-line
  }, [countDown, runTimer]);
  return countDown;
}
