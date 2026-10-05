import type { ReactNode } from 'react';
import { Activity, AlertTriangle, Package, Truck } from 'lucide-react';
import type { FlowMetrics, MetricsDelta } from '@/lib/logiflow/domain/capacity';
import { TOTAL_CAPACITY } from '@/lib/logiflow/domain/inventory';
import { formatInteger, formatPercent, formatSigned } from '@/lib/logiflow/presentation/notice';

/** Direção em que o indicador melhora — define a cor do delta. */
type Polarity = 'higher-is-better' | 'lower-is-better';

interface MetricCardProps {
  readonly icon: ReactNode;
  readonly label: string;
  readonly value: ReactNode;
  readonly unit: string;
  readonly caption: string;
  readonly tone?: 'mint' | 'amber';
  readonly delta?: { readonly value: number; readonly polarity: Polarity; readonly unit: string };
}

function DeltaChip({ value, polarity, unit }: NonNullable<MetricCardProps['delta']>) {
  if (value === 0) return null;
  const improved = polarity === 'higher-is-better' ? value > 0 : value < 0;
  return (
    <span className={`delta ${improved ? 'up' : 'down'}`} aria-label={`Variação após balanceamento: ${formatSigned(value)} ${unit}`}>
      {formatSigned(value)}
      {unit}
    </span>
  );
}

function MetricCard({ icon, label, value, unit, caption, tone, delta }: MetricCardProps) {
  return (
    <article>
      <div>
        {icon} {label}
      </div>
      <strong className={tone}>
        {value}
        <small> {unit}</small>
        {delta && <DeltaChip {...delta} />}
      </strong>
      <span>{caption}</span>
    </article>
  );
}

interface MetricsGridProps {
  readonly metrics: FlowMetrics;
  readonly delta: MetricsDelta | null;
  readonly stock: number;
}

export function MetricsGrid({ metrics, delta, stock }: MetricsGridProps) {
  return (
    <section className="metrics" aria-label="Indicadores">
      <MetricCard
        icon={<Package size={18} aria-hidden="true" />}
        label="Estoque total"
        value={formatInteger(stock)}
        unit="pallets"
        caption={`${formatPercent(stock / TOTAL_CAPACITY)} da capacidade de armazenagem`}
      />
      <MetricCard
        icon={<Truck size={18} aria-hidden="true" />}
        label="Fluxo de saída"
        value={metrics.throughput}
        unit="pallets/h"
        caption={`Capacidade operacional: ${metrics.capacity}/h`}
        delta={delta ? { value: delta.throughput, polarity: 'higher-is-better', unit: '/h' } : undefined}
      />
      <MetricCard
        icon={<Activity size={18} aria-hidden="true" />}
        label="Demanda atendida"
        value={metrics.sla}
        unit="%"
        tone={metrics.sla < 100 ? 'amber' : 'mint'}
        caption={`Demanda do cenário: ${metrics.demand} pallets/h`}
        delta={delta ? { value: delta.sla, polarity: 'higher-is-better', unit: ' p.p.' } : undefined}
      />
      <MetricCard
        icon={<AlertTriangle size={18} aria-hidden="true" />}
        label="Fila projetada"
        value={metrics.queue}
        unit="pallets/h"
        caption={metrics.wait ? `Espera adicional estimada: ${metrics.wait} min` : 'Sem acúmulo previsto neste cenário'}
        delta={delta ? { value: delta.queue, polarity: 'lower-is-better', unit: '/h' } : undefined}
      />
    </section>
  );
}
