import Tippy from '@tippyjs/react';
import React from 'react';

interface CopyCodeButtonProps {
  copySourceCode: any;
}

export const CopyCodeButton = ({ copySourceCode }: CopyCodeButtonProps) => (
  <Tippy
    theme="code-preview"
    arrow={false}
    placement="bottom"
    content="Copy source code"
  >
    <button
      className="code-preview__icon-button code-preview__icon-button--primary"
      onClick={copySourceCode}
    >
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M2.06667 9V9C1.47756 9 1 8.52244 1 7.93333V3C1 1.89543 1.89543 1 3 1H7.93333C8.52244 1 9 1.47756 9 2.06667V2.06667"
          stroke="current"
        />
        <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="current" />
      </svg>
    </button>
  </Tippy>
);
