import { useRef, useEffect } from "react";

interface UsePollingOptions {
  interval: number;
  timeout?: number;
  onPoll: () => Promise<boolean>;
  onTimeout?: () => void;
  onComplete?: () => void;
}

export const usePolling = ({
  interval,
  timeout,
  onPoll,
  onTimeout,
  onComplete,
}: UsePollingOptions) => {
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const isCompletedRef = useRef(false);

  // ** function which stops all timers and intervals (stop pulling)
  const stopPolling = () => {
    const currentInterval = intervalIdRef.current;
    const currentTimeout = timeoutIdRef.current;

    intervalIdRef.current = null;
    timeoutIdRef.current = null;

    if (currentInterval) {
      clearInterval(currentInterval);
    }

    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
  };

  const startPolling = async () => {
    isCompletedRef.current = false;

    stopPolling();

    const shouldContinue = await onPoll();

    if (!shouldContinue || isCompletedRef.current) {
      if (onComplete) onComplete();
      return;
    }

    intervalIdRef.current = setInterval(async () => {
      if (isCompletedRef.current) {
        const currentInterval = intervalIdRef.current;
        if (currentInterval) {
          clearInterval(currentInterval);
          intervalIdRef.current = null;
        }
        return;
      }
      const shouldContinue = await onPoll();

      if (!shouldContinue) {
        isCompletedRef.current = true;
        stopPolling();
        if (onComplete) onComplete();
      }
    }, interval);

    if (timeout) {
      timeoutIdRef.current = setTimeout(() => {
        isCompletedRef.current = true;
        stopPolling();
        if (onTimeout) onTimeout();
      }, timeout);
    }
  };

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return {
    isCompleted: isCompletedRef,
    startPolling,
    stopPolling,
    resetPolling: startPolling,
    markAsCompleted: () => {
      isCompletedRef.current = true;
    },
  };
};
