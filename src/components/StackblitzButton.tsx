import Tippy from '@tippyjs/react';
import React from 'react';

interface StackblitzButtonProps {
  onClick: () => void;
  tooltip?: string;
}

export const StackblitzButton = ({
  onClick,
  tooltip,
}: StackblitzButtonProps) => (
  <Tippy
    theme="code-preview"
    arrow={false}
    placement="bottom"
    content={tooltip ?? 'Open in StackBlitz'}
  >
    <button
      className="code-preview__icon-button code-preview__icon-button--primary"
      onClick={onClick}
    >
      <svg
        aria-hidden="true"
        width="10"
        height="14"
        viewBox="0 0 10 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.53812 5.91743L7.52915 1L1 8.01835H4.42601L2.42601 13L9 5.91743H5.53812Z"
          stroke="#73849A"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  </Tippy>
);
