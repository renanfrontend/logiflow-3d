'use client';

import { useRef } from 'react';
import { DecisionLab } from '@/components/logiflow/DecisionLab';
import { FleetBar } from '@/components/logiflow/FleetBar';
import { MapCard } from '@/components/logiflow/MapCard';
import { MetricsGrid } from '@/components/logiflow/MetricsGrid';
import { NavRail } from '@/components/logiflow/layout/NavRail';
import { PageFooter } from '@/components/logiflow/layout/PageFooter';
import { Topbar } from '@/components/logiflow/layout/Topbar';
import type { SceneHandle } from '@/components/logiflow/scene/Scene';
import { SectorDetails } from '@/components/logiflow/SectorDetails';
import { ShipmentsTable } from '@/components/logiflow/ShipmentsTable';
import { ShortcutHints } from '@/components/logiflow/ShortcutHints';
import { StatusMessage } from '@/components/logiflow/StatusMessage';
import { Tracking } from '@/components/logiflow/Tracking';
import { useKeyboardShortcuts } from '@/hooks/logiflow/use-keyboard-shortcuts';
import { useOperation } from '@/hooks/logiflow/use-operation';
import { useWebMcpSectorTool } from '@/hooks/logiflow/use-webmcp-sector-tool';
import { totalStock } from '@/lib/logiflow/domain/inventory';

export default function Home() {
  const { state, dispatch, metrics, delta, advance, running, reducedMotion } = useOperation();
  const sceneRef = useRef<SceneHandle>(null);

  useWebMcpSectorTool((sector) => dispatch({ type: 'sector/select', sector }));

  useKeyboardShortcuts({
    '1': () => dispatch({ type: 'sector/select', sector: 'A' }),
    '2': () => dispatch({ type: 'sector/select', sector: 'B' }),
    '3': () => dispatch({ type: 'sector/select', sector: 'C' }),
    Space: () => dispatch({ type: 'motion/set', running: !running }),
    r: () => sceneRef.current?.reset(),
    h: () => dispatch({ type: 'layer/toggle', layer: 'heat' }),
    i: () => dispatch({ type: 'layer/toggle', layer: 'cutaway' }),
    escape: () => dispatch({ type: 'asset/clear' }),
  });

  return (
    <main>
      <Topbar />
      <div className="workspace">
        <NavRail />
        <div className="content">
          <section className="heading">
            <div>
              <div className="eyebrow">OPERAÇÕES / VISÃO GERAL</div>
              <h1>Sua operação, em perspectiva.</h1>
              <p>Explore o centro logístico e teste decisões antes de agir.</p>
            </div>
            <div className="status">
              <span /> Simulação local
            </div>
          </section>

          <MetricsGrid metrics={metrics} delta={delta} stock={totalStock(state.progress)} />

          <div className="main-grid">
            <MapCard state={state} dispatch={dispatch} running={running} reducedMotion={reducedMotion} sceneRef={sceneRef} />
            <SectorDetails sector={state.selectedSector} scenario={state.scenario} progress={state.progress} metrics={metrics} />
          </div>

          <ShortcutHints />
          <FleetBar selected={state.selectedAsset} onSelect={(asset) => dispatch({ type: 'asset/select', asset })} />

          <Tracking
            shipmentId={state.trackedShipment}
            progress={state.progress}
            advance={advance}
            onSelect={(shipment) => dispatch({ type: 'shipment/track', shipment })}
            onAdvance={() => dispatch({ type: 'shipment/advance' })}
          />

          <DecisionLab
            scenario={state.scenario}
            balanced={state.balanced}
            onScenario={(scenario) => dispatch({ type: 'scenario/change', scenario })}
            onBalance={() => dispatch({ type: 'scenario/balance' })}
            onReset={() => dispatch({ type: 'simulation/reset' })}
          />

          <StatusMessage notice={state.notice} scenario={state.scenario} balanced={state.balanced} />

          <ShipmentsTable progress={state.progress} tracked={state.trackedShipment} onTrack={(shipment) => dispatch({ type: 'shipment/track', shipment })} />

          <PageFooter />
        </div>
      </div>
    </main>
  );
}
