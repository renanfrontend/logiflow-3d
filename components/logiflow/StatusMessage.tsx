import type { Notice } from '@/lib/logiflow/application/operation';
import { SCENARIOS } from '@/lib/logiflow/domain/fixtures';
import type { Scenario } from '@/lib/logiflow/domain/types';
import { formatNotice } from '@/lib/logiflow/presentation/notice';

interface StatusMessageProps {
  readonly notice: Notice;
  readonly scenario: Scenario;
  readonly balanced: boolean;
}

export function StatusMessage({ notice, scenario, balanced }: StatusMessageProps) {
  const assumption = SCENARIOS[scenario].balancingAssumption;
  const showAssumption = balanced && assumption && notice.kind !== 'balanced';

  return (
    <div className="message" role="status">
      {formatNotice(notice)}
      {showAssumption && <span> Premissa ativa: {assumption}.</span>}
    </div>
  );
}
