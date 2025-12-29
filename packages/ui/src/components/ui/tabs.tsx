/**
 * Tabs component - accessible tabbed interface
 * Built with framework-agnostic primitives
 */

import * as React from 'react';
import classy from '../../primitives/classy';

// Context for sharing tab state
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within Tabs');
  }
  return context;
}

// ==================== Tabs (Root) ====================

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
}

export function Tabs({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  // State management (controlled vs uncontrolled)
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange],
  );

  // Generate stable base ID for ARIA relationships
  const baseId = React.useId();

  const contextValue = React.useMemo(
    () => ({
      value,
      onValueChange: handleValueChange,
      baseId,
    }),
    [value, handleValueChange, baseId],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={classy(className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

Tabs.displayName = 'Tabs';

// ==================== TabsList ====================

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TabsList({ className, children, ...props }: TabsListProps) {
  const listRef = React.useRef<HTMLDivElement>(null);

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const list = listRef.current;
    if (!list) return;

    const tabs = Array.from(
      list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'),
    );
    const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);

    if (currentIndex === -1) return;

    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      tabs[nextIndex]?.focus();
    }
  }, []);

  return (
    <div
      ref={listRef}
      role="tablist"
      className={classy(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className,
      )}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
}

TabsList.displayName = 'TabsList';

// ==================== TabsTrigger ====================

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Value that identifies this tab */
  value: string;
}

export function TabsTrigger({ value, className, children, disabled, ...props }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange, baseId } = useTabsContext();
  const isSelected = value === selectedValue;

  const handleClick = React.useCallback(() => {
    if (!disabled) {
      onValueChange(value);
    }
  }, [disabled, onValueChange, value]);

  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <button
      type="button"
      role="tab"
      id={tabId}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      data-state={isSelected ? 'active' : 'inactive'}
      className={classy(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5',
        'text-sm font-medium ring-offset-background transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

TabsTrigger.displayName = 'TabsTrigger';

// ==================== TabsContent ====================

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value that identifies this panel */
  value: string;
  /** Force mount content even when inactive */
  forceMount?: boolean;
}

export function TabsContent({
  value,
  forceMount,
  className,
  children,
  ...props
}: TabsContentProps) {
  const { value: selectedValue, baseId } = useTabsContext();
  const isSelected = value === selectedValue;

  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  if (!forceMount && !isSelected) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: tabpanels should be focusable per WAI-ARIA authoring practices
      tabIndex={0}
      hidden={!isSelected}
      data-state={isSelected ? 'active' : 'inactive'}
      className={classy(
        'mt-2 ring-offset-background',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

TabsContent.displayName = 'TabsContent';

// ==================== Namespaced Export ====================

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export default Tabs;
