import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { withErrorHandler } from '../../src/utils/ui.js';

describe('withErrorHandler', () => {
  let savedExitCode: number | undefined;

  beforeEach(() => {
    savedExitCode = process.exitCode;
    process.exitCode = undefined;
  });

  afterEach(() => {
    process.exitCode = savedExitCode;
  });

  it('calls the wrapped action with arguments', async () => {
    const action = vi.fn<[string], Promise<void>>().mockResolvedValue(undefined);
    const wrapped = withErrorHandler(action);

    await wrapped('hello');

    expect(action).toHaveBeenCalledWith('hello');
  });

  it('sets process.exitCode to 1 on Error', async () => {
    const action = vi.fn().mockRejectedValue(new Error('boom'));
    const wrapped = withErrorHandler(action);

    await wrapped();

    expect(process.exitCode).toBe(1);
  });

  it('sets process.exitCode to 1 on string throw', async () => {
    const action = vi.fn().mockRejectedValue('string error');
    const wrapped = withErrorHandler(action);

    await wrapped();

    expect(process.exitCode).toBe(1);
  });

  it('does not set exitCode when action succeeds', async () => {
    const action = vi.fn().mockResolvedValue(undefined);
    const wrapped = withErrorHandler(action);

    await wrapped();

    expect(process.exitCode).toBeUndefined();
  });
});
