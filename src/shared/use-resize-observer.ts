import { useCallback, useRef, useState } from 'react';

const useResizeObserver = () => {
  const [size, setSize] = useState<DOMRect>();
  const observerRef = useRef<ResizeObserver | null>(null);

  const refCallback = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node) {
      const updateSize = () => {
        const rect = node.getBoundingClientRect();
        setSize(rect);
      };

      updateSize();

      const observer = new ResizeObserver(() => {
        updateSize();
      });

      observer.observe(node);
      observerRef.current = observer;
    }
  }, []);

  return { ref: refCallback, width: size?.width, height: size?.height } as const;
};

export default useResizeObserver;
