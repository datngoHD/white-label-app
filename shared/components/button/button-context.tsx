import { createContext, use } from 'react';

import { ButtonSize, ButtonVariant } from './button.types';

interface ButtonContextValue {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  loading: boolean;
}

export const ButtonContext = createContext<ButtonContextValue | null>(null);

/**
 * Hook to access Button context in compound components
 * Uses React 19's use() instead of useContext() per Vercel Composition Patterns 4.1
 */
export function useButtonContext(): ButtonContextValue {
  const context = use(ButtonContext);
  if (!context) {
    throw new Error('Button compound components must be used within a Button');
  }
  return context;
}
