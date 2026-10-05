'use client';

import { lazy, Suspense, useRef, type RefObject } from 'react';
import { Layers, Pause, Play, RotateCcw } from 'lucide-react';
import type { OperationAction, OperationState } from '@/lib/logiflow/application/operation';
import { FLEET, WAREHOUSES } from '@/lib/logiflow/domain/fixtures';
import { OCCUPANCY_THRESHOLDS } from '@/lib/logiflow/domain/inventory';
import { useIsClient } from '@/hooks/logiflow/use-media-query';
import { AssetPanel } from './AssetPanel';
import { SceneBoundary } from './SceneBoundary';
import type { SceneHandle } from './scene/Scene';
import type { SectorId } from '@/lib/logiflow/domain/types';

/** Bundle 3D separado do shell da página. */
const Scene = lazy(() => import('./scene/Scene'));

interface MapCardProps {
  readonly state: OperationState;
  readonly dispatch: (action: OperationAction) => void;
  readonly running: boolean;
  readonly reducedMotion: boolean;
  readonly sceneRef: RefObject<SceneHandle | null>;
}

const pct = (ratio: number) => `${Math.round(ratio * 100)}%`;

function Loading() {
  return <div className="fallback">Preparando o centro logístico…</div>;
}

export function MapCard({ state, dispatch, running, reducedMotion, sceneRef }: MapCardProps) {
  const isClient = useIsClient();
  const labelRegistry = useRef(new Map<string, HTMLElement>());
  const { heat, cutaway } = state.layers;
  const selectSector = (sector: SectorId) => dispatch({ type: 'sector/select', sector });
  const selectedAsset = state.selectedAsset ? FLEET.find((asset) => asset.id === state.selectedAsset) : undefined;

  return (
    <section className="map-card" aria-labelledby="map-title">
      <div className="map-heading">
        <div>
          <span className="tiny">DIGITAL TWIN · MODELO DEMONSTRATIVO</span>
          <h2 id="map-title">Centro logístico</h2>
        </div>
        <button
          type="button"
          className={heat ? 'sub-button active' : 'sub-button'}
          aria-pressed={heat}
          aria-keyshortcuts="H"
          onClick={() => dispatch({ type: 'layer/toggle', layer: 'heat' })}
        >
          <Layers size={16} aria-hidden="true" />
          {heat ? 'Ocupação' : 'Camadas'}
        </button>
      </div>

      <div className="scene" role="application" aria-label="Mapa 3D interativo do centro logístico. Use as abas de setor abaixo para navegar pelo teclado.">
        <SceneBoundary>
          {isClient ? (
            <Suspense fallback={<Loading />}>
              <Scene
                ref={sceneRef}
                fleet={FLEET}
                selectedSector={state.selectedSector}
                selectedAsset={state.selectedAsset}
                scenario={state.scenario}
                balanced={state.balanced}
                progress={state.progress}
                running={running}
                reducedMotion={reducedMotion}
                heat={heat}
                cutaway={cutaway}
                labelRegistry={labelRegistry}
                onSelectSector={selectSector}
                onSelectAsset={(asset) => dispatch({ type: 'asset/select', asset })}
              />
            </Suspense>
          ) : (
            <Loading />
          )}
        </SceneBoundary>
        {isClient && (
          // Rótulos na árvore React principal, posicionados pelo LabelProjector.
          // Fora da ordem de tabulação: o teclado usa as abas de setor.
          <div className="scene-labels">
            {WAREHOUSES.map((warehouse) => (
              <button
                type="button"
                tabIndex={-1}
                key={warehouse.id}
                ref={(element) => {
                  if (element) labelRegistry.current.set(warehouse.id, element);
                  else labelRegistry.current.delete(warehouse.id);
                }}
                className={`map-label ${state.selectedSector === warehouse.id ? 'active' : ''}`}
                onClick={() => selectSector(warehouse.id)}
              >
                <b>{warehouse.id}</b>
                {warehouse.name}
              </button>
            ))}
          </div>
        )}
        {selectedAsset && (
          <AssetPanel asset={selectedAsset} running={running} onClose={() => dispatch({ type: 'asset/clear' })} />
        )}
        <div className="scene-tools">
          <button type="button" aria-pressed={cutaway} aria-keyshortcuts="I" onClick={() => dispatch({ type: 'layer/toggle', layer: 'cutaway' })}>
            <Layers size={16} aria-hidden="true" />
            {cutaway ? 'Exibir cobertura' : 'Explorar interior'}
          </button>
          <span>Selecione armazéns, caminhões ou empilhadeiras</span>
        </div>
      </div>

      <div className="map-footer">
        {heat ? (
          <span className="heat-legend" aria-label="Legenda de ocupação">
            <i className="low" /> &lt; {pct(OCCUPANCY_THRESHOLDS.moderate)}
            <i className="moderate" /> {pct(OCCUPANCY_THRESHOLDS.moderate)}–{pct(OCCUPANCY_THRESHOLDS.high)}
            <i className="high" /> ≥ {pct(OCCUPANCY_THRESHOLDS.high)}
          </span>
        ) : (
          <span>
            <span className="mint" aria-hidden="true">
              ●
            </span>{' '}
            Arraste para girar · role para aproximar
          </span>
        )}
        <div>
          <button
            type="button"
            aria-label={running ? 'Pausar movimento' : 'Retomar movimento'}
            aria-keyshortcuts="Space"
            onClick={() => dispatch({ type: 'motion/set', running: !running })}
          >
            {running ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
          </button>
          <button type="button" aria-label="Restaurar câmera" aria-keyshortcuts="R" onClick={() => sceneRef.current?.reset()}>
            <RotateCcw size={17} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="sector-tabs" role="group" aria-label="Selecionar setor">
        {WAREHOUSES.map((warehouse, index) => {
          const selected = state.selectedSector === warehouse.id;
          return (
            <button
              type="button"
              key={warehouse.id}
              aria-pressed={selected}
              aria-keyshortcuts={String(index + 1)}
              className={selected ? 'selected' : ''}
              onClick={() => selectSector(warehouse.id)}
            >
              <span style={{ background: warehouse.color }} aria-hidden="true" />
              {warehouse.id} · {warehouse.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}
