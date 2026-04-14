/**
 * Example Rule Plugin
 *
 * Shows the plugin pattern -- pure function over typed inputs, no registry access.
 * The executor resolves all necessary data and passes it as a typed input object.
 */

export interface ExamplePluginInput {
  /** The token name being processed, provided by the executor for debugging. */
  tokenName: string;
}

export default function example(input: ExamplePluginInput): string {
  return `example-result-for-${input.tokenName}`;
}
