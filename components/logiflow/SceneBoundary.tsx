'use client';

import { Component, type ReactNode } from 'react';

interface SceneBoundaryProps {
  readonly children: ReactNode;
}

interface SceneBoundaryState {
  readonly failed: boolean;
}

/** Falha de WebGL não derruba a página: os controles HTML seguem funcionais. */
export class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state: SceneBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneBoundaryState {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <div className="fallback">Seu dispositivo não disponibilizou o 3D. Todos os controles continuam acessíveis nos painéis.</div>;
    }
    return this.props.children;
  }
}
