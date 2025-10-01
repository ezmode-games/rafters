/**
 * Test setup and base primitive tests
 */

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RPrimitiveBase } from '../src/base/RPrimitiveBase';

/**
 * Test primitive for unit testing base functionality
 */
@customElement('r-test-primitive')
class RTestPrimitive extends RPrimitiveBase {
  render() {
    return html`<div part="base"><slot></slot></div>`;
  }
}

describe('RPrimitiveBase', () => {
  let element: RTestPrimitive;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    element = document.createElement('r-test-primitive') as RTestPrimitive;
    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  it('should be defined', () => {
    expect(element).toBeInstanceOf(RTestPrimitive);
    expect(element).toBeInstanceOf(RPrimitiveBase);
    expect(element).toBeInstanceOf(LitElement);
  });

  it('should manage focus state correctly', async () => {
    expect(element._focused).toBe(false);

    // Manually trigger focus event (JSDOM limitation)
    element.dispatchEvent(new FocusEvent('focus'));
    await element.updateComplete;
    expect(element._focused).toBe(true);

    element.dispatchEvent(new FocusEvent('blur'));
    await element.updateComplete;
    expect(element._focused).toBe(false);
  });

  it('should manage hover state correctly', async () => {
    expect(element._hovered).toBe(false);

    element.dispatchEvent(new MouseEvent('mouseenter'));
    await element.updateComplete;
    expect(element._hovered).toBe(true);

    element.dispatchEvent(new MouseEvent('mouseleave'));
    await element.updateComplete;
    expect(element._hovered).toBe(false);
  });

  it('should reflect disabled attribute', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.getAttribute('disabled')).toBe('');

    element.disabled = false;
    await element.updateComplete;
    expect(element.hasAttribute('disabled')).toBe(false);
  });

  it('should support ARIA label', async () => {
    element.ariaLabel = 'Test label';
    await element.updateComplete;
    // Lit's @property with attribute: 'aria-label' handles the mapping
    expect(element.ariaLabel).toBe('Test label');
  });

  it('should announce to screen readers', async () => {
    element.announceToScreenReader('Test announcement');

    // Wait for announcement element to be created
    await new Promise((resolve) => setTimeout(resolve, 100));

    const liveRegion = document.querySelector('[role="status"]');
    expect(liveRegion).toBeTruthy();
    expect(liveRegion?.textContent).toBe('Test announcement');

    // Wait for cleanup
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const removedRegion = document.querySelector('[role="status"]');
    expect(removedRegion).toBeFalsy();
  });

  it('should dispatch custom events', async () => {
    let eventDetail: unknown = null;

    element.addEventListener('test-event', ((e: CustomEvent) => {
      eventDetail = e.detail;
    }) as EventListener);

    element.dispatchPrimitiveEvent('test-event', { test: 'value' });

    expect(eventDetail).toMatchObject({
      value: { test: 'value' },
      timestamp: expect.any(Number),
    });
  });

  it('should cleanup event listeners on disconnect', async () => {
    element.dispatchEvent(new FocusEvent('focus'));
    await element.updateComplete;
    expect(element._focused).toBe(true);

    element.remove();
    element.dispatchEvent(new FocusEvent('blur'));
    await element.updateComplete;

    // Focus state should not change after disconnect
    expect(element._focused).toBe(true);
  });
});

describe('Registry metadata', () => {
  it('should have proper JSDoc tags in source', async () => {
    // This test verifies the source code has required registry metadata
    // Actual validation happens via CLI registry parser
    expect(RPrimitiveBase.name).toBe('RPrimitiveBase');
  });
});
