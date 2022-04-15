import React, { useEffect, useMemo, useRef } from 'react';
import { FrameSize, FRAME_SIZES } from '../utils/frame-sizes';

interface PreviewFrameProps {
  src: (baseUrl: string) => string;
  /**
   * Developers can set a predefined height
   * or an explicit pixel value.
   */
  height: FrameSize | string;
  /**
   * Developers can set a predefined width
   * or an explicit pixel value.
   */
  width: string | number;
  /**
   * The base URL of the site.
   */
  baseUrl: string;
  /**
   * `true` if the selected viewport matches the frame source.
   */
  isVisible: boolean;
  /**
   * `true` if the frame should display the preview in dark mode.
   */
  isDarkMode: boolean;
  /**
   * `true` if the iframe should be rendered inside of a device shell.
   */
  devicePreview?: boolean;
  /**
   * The title to be assigned to the iframe.
   */
  title?: string;
}

export const PreviewFrame = ({
  src,
  height,
  width,
  baseUrl,
  isVisible,
  isDarkMode,
  title,
  devicePreview,
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
  }, [isDarkMode]);

  function renderFrame() {
    return (
      <iframe
        ref={frameRef}
        src={frameSrc}
        title={title}
        height={
          [height in FRAME_SIZES] ? FRAME_SIZES[height as FrameSize] : height
        }
        width={width}
        className={!isVisible ? 'frame-hidden' : ''}
      />
    );
  }

  if (devicePreview) {
    const isIOS = frameSrc.includes('mode=ios');
    return (
      <div className={!isVisible ? 'frame-hidden' : ''}>
        <device-preview mode={isIOS ? 'ios' : 'md'}>
          {renderFrame()}
        </device-preview>
      </div>
    );
  }

  return renderFrame();
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
