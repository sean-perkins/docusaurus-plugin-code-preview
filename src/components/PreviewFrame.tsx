import React, { useEffect, useMemo, useRef } from 'react';
import { FrameSize, FRAME_SIZES } from '../utils/frame-sizes';

interface PreviewFrameProps {
  src: (baseUrl: string) => string;
  /**
   * Developers can set a predefined size
   * or an explicit pixel value.
   */
  size: FrameSize | string;
  baseUrl: string;
  /**
   * `true` if the selected viewport matches the frame source.
   */
  isVisible: boolean;
  /**
   * `true` if the frame should display the preview in dark mode.
   */
  isDarkMode: boolean;
}

export const PreviewFrame = ({
  src,
  size,
  baseUrl,
  isVisible,
  isDarkMode,
}: PreviewFrameProps) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const frameSrc = useMemo(() => src(baseUrl), [src, baseUrl]);

  useEffect(() => {
    /**
     * Rather than encode isDarkTheme into the frame source
     * url, we post a message to each frame so that
     * dark mode can be enabled without a full page reload.
     */
    if (frameRef.current) {
      waitForFrame(frameRef.current).then(() => {
        if (frameRef.current) {
          frameRef.current.contentWindow?.postMessage(
            {
              darkMode: isDarkMode,
            },
            '*'
          );
        }
      });
    }
  }, []);
  return (
    <iframe
      ref={frameRef}
      src={frameSrc}
      height={[size in FRAME_SIZES] ? FRAME_SIZES[size as FrameSize] : size}
      className={!isVisible ? 'frame-hidden' : ''}
    />
  );
};

const waitForFrame = (frame: HTMLIFrameElement) => {
  if (isFrameReady(frame)) return Promise.resolve();

  return new Promise<void>(resolve => {
    frame.contentWindow!.addEventListener('demoReady', () => {
      resolve();
    });
  });
};

const isFrameReady = (frame: HTMLIFrameElement) => {
  return (frame.contentWindow as any)!.demoReady === true;
};
