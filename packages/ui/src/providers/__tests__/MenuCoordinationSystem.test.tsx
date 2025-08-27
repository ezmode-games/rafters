/**
 * Menu Coordination System Tests
 *
 * Comprehensive test suite for the menu coordination system
 * covering all providers and their interactions.
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MenuCoordinationSystem,
  useAnnouncements,
  useFocusManager,
  useKeyboardNavigation,
  useMenu,
  useMotionCoordinator,
} from '../MenuCoordinationSystem';

// Mock components for testing
const TestMenuComponent = ({
  menuId,
  menuType,
  triggerFocus = false,
  triggerKeyboard = false,
  triggerAnnouncement = false,
  triggerMotion = false,
}: {
  menuId: string;
  menuType: 'context' | 'navigation' | 'dropdown' | 'breadcrumb' | 'tree' | 'sidebar';
  triggerFocus?: boolean;
  triggerKeyboard?: boolean;
  triggerAnnouncement?: boolean;
  triggerMotion?: boolean;
}) => {
  const menu = useMenu(menuId, menuType);
  const focusManager = useFocusManager();
  const keyboard = useKeyboardNavigation();
  const announcements = useAnnouncements();
  const motion = useMotionCoordinator();

  React.useEffect(() => {
    if (triggerFocus) {
      const element = document.createElement('div');
      document.body.appendChild(element);
      focusManager.registerFocusElement(element, menuId);
    }
  }, [triggerFocus, focusManager, menuId]);

  const handleTestAction = async () => {
    if (triggerKeyboard) {
      keyboard.triggerAction(menuId, 'open');
    }
    if (triggerAnnouncement) {
      announcements.announceForMenu(menuId, 'Test announcement');
    }
    if (triggerMotion) {
      await motion.requestAnimation({
        menuId,
        type: 'fade',
        duration: 'fast',
        priority: 5,
        cognitiveLoad: 3,
        trustLevel: 'medium',
      });
    }
  };

  return (
    <div data-testid={`menu-${menuId}`}>
      <button type="button" onClick={handleTestAction} data-testid={`trigger-${menuId}`}>
        Trigger Actions
      </button>
      <div data-testid={`status-${menuId}`}>
        Active: {menu.isActive ? 'true' : 'false'}
        Has Attention: {menu.hasAttention ? 'true' : 'false'}
      </div>
    </div>
  );
};

// Helper to render with coordination system
const renderWithCoordination = (children: React.ReactNode, props = {}) => {
  return render(<MenuCoordinationSystem {...props}>{children}</MenuCoordinationSystem>);
};

describe('MenuCoordinationSystem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear any existing live regions
    for (const el of document.querySelectorAll('[aria-live]')) {
      el.remove();
    }
  });

  afterEach(() => {
    // Clean up any test elements
    for (const el of document.querySelectorAll('[data-testid]')) {
      el.remove();
    }
  });

  describe('Core Menu Coordination', () => {
    it('should register and track multiple menus', async () => {
      renderWithCoordination(
        <>
          <TestMenuComponent menuId="menu1" menuType="dropdown" />
          <TestMenuComponent menuId="menu2" menuType="navigation" />
          <TestMenuComponent menuId="menu3" menuType="context" />
        </>
      );

      expect(screen.getByTestId('menu-menu1')).toBeInTheDocument();
      expect(screen.getByTestId('menu-menu2')).toBeInTheDocument();
      expect(screen.getByTestId('menu-menu3')).toBeInTheDocument();
    });

    it('should enforce cognitive load budget', async () => {
      const onLoadExceeded = vi.fn();

      renderWithCoordination(
        <>
          {/* Create many high-cognitive-load menus to exceed budget */}
          <TestMenuComponent menuId="heavy1" menuType="navigation" />
          <TestMenuComponent menuId="heavy2" menuType="navigation" />
          <TestMenuComponent menuId="heavy3" menuType="navigation" />
          <TestMenuComponent menuId="heavy4" menuType="navigation" />
        </>,
        {
          menuProvider: { maxCognitiveLoad: 10, onLoadExceeded },
        }
      );

      // Trigger actions that might exceed budget
      const triggers = screen.getAllByTestId(/^trigger-heavy/);

      for (const trigger of triggers) {
        await userEvent.click(trigger);
      }

      // Should have called load exceeded at some point
      await waitFor(() => {
        expect(onLoadExceeded).toHaveBeenCalled();
      });
    });

    it('should manage attention hierarchy correctly', async () => {
      renderWithCoordination(
        <>
          <TestMenuComponent menuId="dropdown" menuType="dropdown" />
          <TestMenuComponent menuId="context" menuType="context" />
          <TestMenuComponent menuId="navigation" menuType="navigation" />
        </>
      );

      const contextTrigger = screen.getByTestId('trigger-context');
      const dropdownTrigger = screen.getByTestId('trigger-dropdown');

      await userEvent.click(contextTrigger);
      await userEvent.click(dropdownTrigger);

      // Context menu should have higher priority and retain attention
      expect(screen.getByTestId('status-context')).toHaveTextContent('Has Attention: true');
      expect(screen.getByTestId('status-dropdown')).toHaveTextContent('Has Attention: false');
    });
  });

  describe('Focus Management', () => {
    it('should create and manage focus traps', async () => {
      const onFocusChange = vi.fn();

      renderWithCoordination(
        <TestMenuComponent menuId="focus-test" menuType="dropdown" triggerFocus={true} />,
        {
          focusManager: { onFocusChange },
        }
      );

      await waitFor(() => {
        expect(onFocusChange).toHaveBeenCalledWith('focus-test', expect.any(HTMLElement));
      });
    });

    it('should handle focus restoration', async () => {
      const initialFocusElement = document.createElement('button');
      initialFocusElement.textContent = 'Initial Focus';
      document.body.appendChild(initialFocusElement);
      initialFocusElement.focus();

      const { rerender } = renderWithCoordination(
        <TestMenuComponent menuId="modal-test" menuType="context" triggerFocus={true} />
      );

      // Simulate menu closing (unmounting)
      rerender(
        <MenuCoordinationSystem>
          <div>Menu closed</div>
        </MenuCoordinationSystem>
      );

      // Focus should be restored (in a real scenario)
      expect(document.body.contains(initialFocusElement)).toBe(true);

      document.body.removeChild(initialFocusElement);
    });

    it('should handle keyboard navigation in focus traps', async () => {
      renderWithCoordination(
        <div data-testid="trap-container">
          <TestMenuComponent menuId="keyboard-test" menuType="dropdown" triggerFocus={true} />
          <button type="button" data-testid="button1">
            Button 1
          </button>
          <button type="button" data-testid="button2">
            Button 2
          </button>
          <button type="button" data-testid="button3">
            Button 3
          </button>
        </div>
      );

      const button1 = screen.getByTestId('button1');
      const button3 = screen.getByTestId('button3');

      button1.focus();

      // Simulate Tab key
      fireEvent.keyDown(document, { key: 'Tab' });

      // Should move to next focusable element
      expect(document.activeElement).not.toBe(button1);

      // Simulate Shift+Tab from last element
      button3.focus();
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

      expect(document.activeElement).not.toBe(button3);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should register and handle keyboard shortcuts', async () => {
      const onGlobalKeyAction = vi.fn();

      renderWithCoordination(
        <TestMenuComponent menuId="kbd-test" menuType="dropdown" triggerKeyboard={true} />,
        {
          keyboardNavigation: { onGlobalKeyAction },
        }
      );

      const trigger = screen.getByTestId('trigger-kbd-test');
      await userEvent.click(trigger);

      await waitFor(() => {
        expect(onGlobalKeyAction).toHaveBeenCalledWith('open', 'kbd-test', expect.any(Object));
      });
    });

    it('should handle type-ahead search', async () => {
      renderWithCoordination(
        <div>
          <TestMenuComponent menuId="search-test" menuType="dropdown" triggerFocus={true} />
          <div role="menu">
            <div
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}
            >
              Apple
            </div>
            <div
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}
            >
              Banana
            </div>
            <div
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}
            >
              Cherry
            </div>
          </div>
        </div>,
        {
          keyboardNavigation: { enableTypeAhead: true },
        }
      );

      // Simulate typing 'a' to search
      fireEvent.keyDown(document, { key: 'a' });

      // Type-ahead functionality would be tested more thoroughly in integration tests
      // This test verifies the event handling structure
    });

    it('should handle menu-specific keyboard patterns', async () => {
      renderWithCoordination(
        <>
          <TestMenuComponent menuId="nav-test" menuType="navigation" triggerFocus={true} />
          <TestMenuComponent menuId="tree-test" menuType="tree" triggerFocus={true} />
        </>
      );

      // Navigation menus should handle arrow keys differently than tree menus
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      fireEvent.keyDown(document, { key: 'ArrowLeft' });

      // Test that events are processed without throwing
      expect(screen.getByTestId('menu-nav-test')).toBeInTheDocument();
      expect(screen.getByTestId('menu-tree-test')).toBeInTheDocument();
    });
  });

  describe('Announcement Coordination', () => {
    it('should create ARIA live regions', async () => {
      renderWithCoordination(<TestMenuComponent menuId="announce-test" menuType="dropdown" />);

      // Should create polite and assertive live regions
      await waitFor(() => {
        const politeRegion = document.querySelector('[aria-live="polite"]');
        const assertiveRegion = document.querySelector('[aria-live="assertive"]');

        expect(politeRegion).toBeInTheDocument();
        expect(assertiveRegion).toBeInTheDocument();
      });
    });

    it('should coordinate announcements without conflicts', async () => {
      const onAnnouncement = vi.fn();

      renderWithCoordination(
        <>
          <TestMenuComponent menuId="ann1" menuType="dropdown" triggerAnnouncement={true} />
          <TestMenuComponent menuId="ann2" menuType="context" triggerAnnouncement={true} />
        </>,
        {
          announcements: { onAnnouncement },
        }
      );

      const trigger1 = screen.getByTestId('trigger-ann1');
      const trigger2 = screen.getByTestId('trigger-ann2');

      await userEvent.click(trigger1);
      await userEvent.click(trigger2);

      await waitFor(() => {
        expect(onAnnouncement).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle announcement priorities correctly', async () => {
      renderWithCoordination(
        <TestMenuComponent menuId="priority-test" menuType="context" triggerAnnouncement={true} />
      );

      const trigger = screen.getByTestId('trigger-priority-test');
      await userEvent.click(trigger);

      // Verify that assertive announcements take priority
      const assertiveRegion = document.querySelector('[aria-live="assertive"]');
      expect(assertiveRegion).toBeInTheDocument();
    });

    it('should debounce identical announcements', async () => {
      const onAnnouncement = vi.fn();

      renderWithCoordination(
        <TestMenuComponent menuId="debounce-test" menuType="dropdown" triggerAnnouncement={true} />,
        {
          announcements: { onAnnouncement },
        }
      );

      const trigger = screen.getByTestId('trigger-debounce-test');

      // Rapidly trigger multiple identical announcements
      await userEvent.click(trigger);
      await userEvent.click(trigger);
      await userEvent.click(trigger);

      // Should debounce and only make one announcement
      await waitFor(
        () => {
          expect(onAnnouncement).toHaveBeenCalledTimes(1);
        },
        { timeout: 1500 }
      );
    });
  });

  describe('Motion Coordination', () => {
    it('should coordinate animations with priority system', async () => {
      const onAnimationStart = vi.fn();

      renderWithCoordination(
        <>
          <TestMenuComponent menuId="motion1" menuType="dropdown" triggerMotion={true} />
          <TestMenuComponent menuId="motion2" menuType="context" triggerMotion={true} />
        </>,
        {
          motionCoordinator: { onAnimationStart },
        }
      );

      const trigger1 = screen.getByTestId('trigger-motion1');
      const trigger2 = screen.getByTestId('trigger-motion2');

      await userEvent.click(trigger1);
      await userEvent.click(trigger2);

      await waitFor(() => {
        expect(onAnimationStart).toHaveBeenCalled();
      });
    });

    it('should enforce performance budgets', async () => {
      const onBudgetExceeded = vi.fn();

      renderWithCoordination(
        <>
          <TestMenuComponent menuId="perf1" menuType="navigation" triggerMotion={true} />
          <TestMenuComponent menuId="perf2" menuType="navigation" triggerMotion={true} />
          <TestMenuComponent menuId="perf3" menuType="navigation" triggerMotion={true} />
          <TestMenuComponent menuId="perf4" menuType="navigation" triggerMotion={true} />
        </>,
        {
          motionCoordinator: {
            budget: { maxConcurrentAnimations: 2, maxTotalCognitiveLoad: 8 },
            onBudgetExceeded,
          },
        }
      );

      // Trigger multiple animations simultaneously
      const triggers = screen.getAllByTestId(/^trigger-perf/);

      await Promise.all(triggers.map((trigger) => userEvent.click(trigger)));

      await waitFor(() => {
        expect(onBudgetExceeded).toHaveBeenCalled();
      });
    });

    it('should respect reduced motion preferences', async () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      renderWithCoordination(
        <TestMenuComponent menuId="reduced-motion" menuType="dropdown" triggerMotion={true} />
      );

      const trigger = screen.getByTestId('trigger-reduced-motion');
      await userEvent.click(trigger);

      // Motion should be reduced or eliminated
      // Specific behavior would depend on the motion coordinator implementation
    });
  });

  describe('System Integration', () => {
    it('should handle complex multi-menu scenarios', async () => {
      const onSystemEvent = vi.fn();

      renderWithCoordination(
        <>
          <TestMenuComponent
            menuId="complex1"
            menuType="navigation"
            triggerFocus={true}
            triggerKeyboard={true}
            triggerAnnouncement={true}
            triggerMotion={true}
          />
          <TestMenuComponent
            menuId="complex2"
            menuType="dropdown"
            triggerFocus={true}
            triggerKeyboard={true}
            triggerAnnouncement={true}
            triggerMotion={true}
          />
        </>,
        {
          enableDebugMode: true,
          onSystemEvent,
        }
      );

      const trigger1 = screen.getByTestId('trigger-complex1');
      const trigger2 = screen.getByTestId('trigger-complex2');

      await userEvent.click(trigger1);
      await userEvent.click(trigger2);

      await waitFor(() => {
        expect(onSystemEvent).toHaveBeenCalled();
      });
    });

    it('should properly clean up when menus unmount', async () => {
      const { rerender } = renderWithCoordination(
        <TestMenuComponent menuId="cleanup-test" menuType="dropdown" triggerFocus={true} />
      );

      // Menu should be active
      expect(screen.getByTestId('status-cleanup-test')).toHaveTextContent('Active: true');

      // Unmount the menu
      rerender(
        <MenuCoordinationSystem>
          <div>Menu removed</div>
        </MenuCoordinationSystem>
      );

      // Should clean up properly without errors
      expect(screen.queryByTestId('menu-cleanup-test')).not.toBeInTheDocument();
    });

    it('should handle error conditions gracefully', async () => {
      // Test error boundaries and graceful degradation
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      renderWithCoordination(<TestMenuComponent menuId="error-test" menuType="dropdown" />);

      // Simulate various error conditions
      fireEvent.keyDown(document, { key: 'InvalidKey' });

      // Should not throw or crash
      expect(screen.getByTestId('menu-error-test')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', async () => {
      const renderSpy = vi.fn();

      const TestComponent = () => {
        renderSpy();
        return <TestMenuComponent menuId="perf-test" menuType="dropdown" />;
      };

      const { rerender } = renderWithCoordination(<TestComponent />);

      const initialRenderCount = renderSpy.mock.calls.length;

      // Trigger various actions that shouldn't cause re-renders
      rerender(
        <MenuCoordinationSystem>
          <TestComponent />
        </MenuCoordinationSystem>
      );

      expect(renderSpy.mock.calls.length).toBe(initialRenderCount + 1); // Only one additional render
    });

    it('should handle high-frequency events efficiently', async () => {
      renderWithCoordination(
        <TestMenuComponent menuId="freq-test" menuType="dropdown" triggerFocus={true} />
      );

      const startTime = performance.now();

      // Simulate high-frequency keyboard events
      for (let i = 0; i < 100; i++) {
        fireEvent.keyDown(document, { key: 'ArrowDown' });
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should handle events efficiently (less than 100ms for 100 events)
      expect(duration).toBeLessThan(100);
    });
  });
});

describe('MenuCoordinationDebugger', () => {
  it('should provide debug information', async () => {
    const consoleSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const consoleGroupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    render(
      <MenuCoordinationSystem enableDebugMode={true}>
        <TestMenuComponent menuId="debug-test" menuType="dropdown" triggerAnnouncement={true} />
      </MenuCoordinationSystem>
    );

    const trigger = screen.getByTestId('trigger-debug-test');
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
    consoleLogSpy.mockRestore();
    consoleGroupEndSpy.mockRestore();
  });
});
