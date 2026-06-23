import { ReactNode } from 'react';

export interface KeyboardShortcut {
  combination: string;
  handler: () => void;
  label: string;
}

export interface ScaffoldProps {
  title: string;
  shortcuts?: KeyboardShortcut[];
  leftPanel?: ReactNode;
  mainPanel?: ReactNode;
}
