/**
 * Rafters MCP (Model Context Protocol) Server
 *
 * Provides AI agents with direct access to design token intelligence,
 * component metadata, and design system reasoning.
 *
 * Features:
 * - Progressive intelligence delivery (immediate → quick → computed → deep)
 * - Vector-based design reasoning with confidence scoring
 * - Real-time streaming for live design collaboration
 * - Cross-modal design intelligence (color-sound-texture-emotion)
 * - Business context integration with predictive capabilities
 */

import { RaftersDesignIntelligenceServer } from './server.js';

export async function startMCPServer(): Promise<void> {
  const server = new RaftersDesignIntelligenceServer();
  await server.start();
}

export function createMCPTools(): void {
  // Tools are automatically registered in the server class
  // This function exists for compatibility but is not needed
}
