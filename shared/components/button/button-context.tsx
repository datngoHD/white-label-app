import { createContext, useContext } from 'react';

import { ButtonSize, ButtonVariant } from './button.types';

interface ButtonContextValue {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  loading: boolean;
}

export const ButtonContext = createContext<ButtonContextValue | null>(null);

export function useButtonContext(): ButtonContextValue {
  const context = useContext(ButtonContext);
  if (!context) {
    throw new Error('Button compound components must be used within a Button');
  }
  return context;
}
