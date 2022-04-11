import Tippy from '@tippyjs/react';
import React from 'react';

interface ToggleSourceCodeButtonProps {
  codeExpanded: boolean;
  setCodeExpanded: any;
}

export const ToggleSourceCodeButton = ({
  codeExpanded,
  setCodeExpanded,
}: ToggleSourceCodeButtonProps) => (
  <Tippy
    theme="code-preview"
    arrow={false}
    placement="bottom"
    content={codeExpanded ? 'Hide source code' : 'Show full source'}
  >
    <button
      className="code-preview__icon-button code-preview__icon-button--primary"
      aria-label={codeExpanded ? 'Hide source code' : 'Show full source'}
      onClick={() => setCodeExpanded(!codeExpanded)}
    >
      <svg
        width="16"
        height="10"
        aria-hidden="true"
        viewBox="0 0 16 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 9L1 5L5 1"
          stroke="current"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 9L15 5L11 1"
          stroke="current"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  </Tippy>
);
