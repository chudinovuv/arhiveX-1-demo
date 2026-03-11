// tools-mcp.js — MCP mode: bridge to spec-reader via stdio
import { spawn } from 'child_process';
import { resolve } from 'path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const MCP_SERVER_PATH = resolve(
  import.meta.dirname, '..', 'spec-reader', 'dist', 'server.js'
);

/** @type {Client | null} */
let client = null;
/** @type {StdioClientTransport | null} */
let transport = null;
/** @type {Array<{name: string, description: string, input_schema: object}>} */
let cachedToolDefs = [];

/**
 * Start the MCP server process and connect client.
 * Call once before executing any tool.
 */
export async function startMcpServer() {
  if (client) return;

  transport = new StdioClientTransport({
    command: 'node',
    args: [MCP_SERVER_PATH],
  });

  client = new Client({ name: 'benchmark-runner', version: '1.0.0' });
  await client.connect(transport);

  // Fetch tool list from server
  const { tools } = await client.listTools();

  // Filter to the 5 benchmark tools (exclude spec_version)
  const allowed = ['search_spec', 'read_chain', 'list_units', 'fulltext_search', 'lookup_xref'];
  cachedToolDefs = tools
    .filter(t => allowed.includes(t.name))
    .map(t => ({
      name: t.name,
      description: t.description ?? '',
      input_schema: t.inputSchema,
    }));

  console.error(`[mcp] Connected. ${cachedToolDefs.length} tools available.`);
}

/**
 * Stop the MCP server.
 */
export async function stopMcpServer() {
  if (client) {
    try { await client.close(); } catch {}
    client = null;
  }
  if (transport) {
    try { await transport.close(); } catch {}
    transport = null;
  }
}

/**
 * Get tool definitions in Claude API format.
 * @returns {Array<{name: string, description: string, input_schema: object}>}
 */
export function getMcpToolDefs() {
  return cachedToolDefs;
}

/**
 * Execute an MCP tool call by proxying to the stdio server.
 * @param {string} name
 * @param {Record<string, any>} input
 * @returns {Promise<string>} — text result
 */
export async function executeMcpTool(name, input) {
  if (!client) throw new Error('MCP server not started. Call startMcpServer() first.');

  const result = await client.callTool({ name, arguments: input });

  // Extract text from content blocks
  const texts = result.content
    .filter(c => c.type === 'text')
    .map(c => c.text);

  return texts.join('\n');
}
