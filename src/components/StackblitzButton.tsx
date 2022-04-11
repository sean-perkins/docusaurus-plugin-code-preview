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
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 11L11 11"
          stroke="#92A0B3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.88491 1.36289C9.11726 1.13054 9.43241 1 9.76101 1C9.92371 1 10.0848 1.03205 10.2351 1.09431C10.3855 1.15658 10.5221 1.24784 10.6371 1.36289C10.7522 1.47794 10.8434 1.61453 10.9057 1.76485C10.968 1.91517 11 2.07629 11 2.23899C11 2.4017 10.968 2.56281 10.9057 2.71314C10.8434 2.86346 10.7522 3.00004 10.6371 3.11509L3.33627 10.4159L1 11L1.58407 8.66373L8.88491 1.36289Z"
          stroke="current"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  </Tippy>
);
