import type React from 'react';

export function TestButton({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: string;
}) {
  return (
    <button type="button" className={`btn btn-${variant}`}>
      {children}
    </button>
  );
}

export default TestButton;
