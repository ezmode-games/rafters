export interface DesignSystemConfig {
  // Brand Identity
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  };

  // Visual Style
  borderRadius: 'sharp' | 'subtle' | 'medium' | 'rounded' | 'pill';
  shadows: 'none' | 'subtle' | 'medium' | 'dramatic';
  animation: 'none' | 'subtle' | 'medium' | 'playful';

  // Typography
  typography: {
    primaryFont: string;
    scale: 'tight' | 'medium' | 'relaxed';
  };

  // Spacing
  spacing: 'tight' | 'medium' | 'airy';
}

export interface SetupStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<SetupStepProps>;
}

export interface SetupStepProps {
  config: DesignSystemConfig;
  updateConfig: (updates: Partial<DesignSystemConfig>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}
