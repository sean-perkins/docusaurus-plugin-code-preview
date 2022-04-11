import React from 'react';

import { ControlButton } from './ControlButton';

interface OutputTargetButtonProps {
  label: string;
  isSelected: boolean;
  onClick?: () => void;
}

export const OutputTargetButton = ({
  label,
  isSelected,
  onClick,
}: OutputTargetButtonProps) => {
  return (
    <ControlButton
      isSelected={isSelected}
      title={`Show ${label} code`}
      label={label}
      onClick={onClick}
    />
  );
};
