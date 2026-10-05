import { useEffect, useRef } from 'react';
import { WAREHOUSES, isSectorId } from '@/lib/logiflow/domain/fixtures';
import type { SectorId } from '@/lib/logiflow/domain/types';

interface WebMcpTool<Input> {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: Record<string, unknown>;
  readonly annotations?: { readonly readOnlyHint?: boolean };
  readonly execute: (input: Input) => Promise<unknown>;
}

interface ModelContext {
  registerTool<Input>(tool: WebMcpTool<Input>, options?: { signal?: AbortSignal }): Promise<void> | void;
}

type DocumentWithModelContext = Document & { readonly modelContext?: ModelContext };

/** Ferramenta WebMCP experimental — no-op em navegadores sem suporte. */
export function useWebMcpSectorTool(onSelect: (sector: SectorId) => void): void {
  const latest = useRef(onSelect);

  useEffect(() => {
    latest.current = onSelect;
  });

  useEffect(() => {
    const context = (document as DocumentWithModelContext).modelContext;
    if (!context) return;

    const controller = new AbortController();
    const tool: WebMcpTool<{ id: unknown }> = {
      name: 'select_logistics_sector',
      description: 'Seleciona um setor do centro logístico demonstrativo.',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string', enum: WAREHOUSES.map((warehouse) => warehouse.id) } },
        required: ['id'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: async ({ id }) => {
        if (!isSectorId(id)) throw new TypeError('Setor inválido');
        latest.current(id);
        return { selected: id };
      },
    };

    Promise.resolve(context.registerTool(tool, { signal: controller.signal })).catch(() => undefined);
    return () => controller.abort();
  }, []);
}
