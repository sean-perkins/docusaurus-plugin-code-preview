import React from 'react';

interface ControlButtonProps {
  isSelected: boolean;
  onClick?: () => void;
  title?: string;
  label: string;
}

export const ControlButton = ({
  isSelected,
  onClick,
  title,
  label,
}: ControlButtonProps) => {
  return (
    <button
      type="button"
      title={title}
      className={`code-preview__control-button ${
        isSelected ? 'code-preview__control-button--selected' : ''
      }`}
      onClick={onClick}
      data-text={label}
    >
      {label}
    </button>
  );
};
