import { Activity, Check, FlaskConical, RotateCcw } from 'lucide-react';
import { canBalance } from '@/lib/logiflow/domain/capacity';
import { SCENARIOS, SCENARIO_ORDER } from '@/lib/logiflow/domain/fixtures';
import type { Scenario } from '@/lib/logiflow/domain/types';

interface DecisionLabProps {
  readonly scenario: Scenario;
  readonly balanced: boolean;
  readonly onScenario: (scenario: Scenario) => void;
  readonly onBalance: () => void;
  readonly onReset: () => void;
}

export function DecisionLab({ scenario, balanced, onScenario, onBalance, onReset }: DecisionLabProps) {
  return (
    <section className="lab" aria-labelledby="lab-title">
      <div className="lab-title">
        <FlaskConical size={22} aria-hidden="true" />
        <div>
          <h2 id="lab-title">Laboratório de decisões</h2>
          <p>Altere o cenário e compare o impacto no fluxo.</p>
        </div>
      </div>
      <div className="scenario-options" role="radiogroup" aria-label="Cenário da simulação">
        {SCENARIO_ORDER.map((id) => (
          <button
            type="button"
            role="radio"
            key={id}
            aria-checked={scenario === id}
            className={scenario === id ? 'chosen' : ''}
            onClick={() => onScenario(id)}
          >
            {SCENARIOS[id].label}
          </button>
        ))}
      </div>
      <div className="lab-actions">
        <button type="button" className="ghost" onClick={onReset} aria-label="Reiniciar simulação">
          <RotateCcw size={16} aria-hidden="true" /> Reiniciar
        </button>
        <button type="button" className="primary" disabled={balanced || !canBalance(scenario)} onClick={onBalance}>
          {balanced ? <Check size={17} aria-hidden="true" /> : <Activity size={17} aria-hidden="true" />}{' '}
          {balanced ? 'Balanceamento aplicado' : 'Balancear operação'}
        </button>
      </div>
    </section>
  );
}
