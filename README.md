# LogiFlow 3D

🇧🇷 Centro de distribuição interativo com simulação de decisões operacionais. Projeto de portfólio de **Renan Augusto dos Santos**.

[Abrir demonstração pública](https://logiflow-3d-renan.renan-gabba.chatgpt.site)

## O problema

Tabelas isoladas nem sempre mostram onde um gargalo acontece. O LogiFlow conecta uma representação espacial do centro logístico a indicadores e cenários comparáveis. É uma prova de conceito visual, sem conexão com instalações reais.

## Funcionalidades

- Cena isométrica procedural com armazéns, docas, silos, pallets, caminhões e empilhadeiras selecionáveis.
- Modo de exploração do interior dos armazéns com estantes e estoque.
- Acompanhamento de cargas em cinco etapas, com baixa de estoque na saída.
- Seleção de setores pelo mapa e por botões HTML acessíveis por teclado.
- Camada de ocupação, pausa da animação e restauração da câmera.
- Cenários normal, pico de demanda e doca bloqueada.
- Balanceamento determinístico e indicadores derivados da mesma função de domínio.
- Expedição demonstrativa por carga, mantida somente durante a sessão.
- Interface responsiva, preferência de movimento reduzido e fallback para falha de WebGL.

## Stack

React 19 · TypeScript · Three.js · React Three Fiber 9 · Drei · Lucide React · CSS · Vinext/Vite (App Router compatível com Next.js) · Cloudflare Workers.

React Three Fiber foi identificado no print da referência. As demais escolhas são da implementação deste projeto; a stack completa do post original não foi confirmada.

## Executar

Requer Node.js >= 22.13 e pnpm (versão declarada em package.json).

```bash
pnpm install --frozen-lockfile
pnpm dev
```

```bash
pnpm exec tsc --noEmit
node --experimental-strip-types --test lib/logiflow/simulation.test.ts
pnpm build
```

## Arquitetura

- `app/page.tsx`: estado e controles da operação; carregamento da cena somente no cliente.
- `components/logiflow/Scene.tsx`: renderização, geometria procedural, picking e animação com delta time limitado.
- `lib/logiflow/simulation.ts`: dados fictícios e função pura de projeção.
- `docs/linkedin.md`: texto e roteiro para divulgação.

A cena é carregada sob demanda para separar o bundle 3D. DPR limitado a 1,5, sombras de resolução limitada e geometrias simples ajudam a reduzir o custo gráfico. Os modelos são criados por código, sem assets externos de terceiros.

## Premissas e limites

| Cenário | Demanda (pallets/h) | Capacidade base | Após balanceamento |
| --- | ---: | ---: | ---: |
| Normal | 120 | 144 | 180 |
| Pico | 168 | 144 | 180 |
| Doca bloqueada | 120 | 72 | 108 |

Fluxo = mínimo entre demanda e capacidade. Fila projetada = máximo entre zero e demanda menos capacidade, por hora. Espera adicional = fila/capacidade × 60. Demanda atendida = fluxo/demanda. Trata-se de uma aproximação didática em regime constante, não de uma simulação de eventos discretos nem de um SLA contratual.

O estoque parte de um snapshot fictício. A transição de carregamento para trânsito debita o volume uma vez. A doca bloqueada impede a saída da carga do setor C até aplicar o balanceamento. As etapas são avançadas manualmente para facilitar a demonstração. Caminhões são animações ilustrativas, não telemetria. O estado é reiniciado ao recarregar. Não há backend operacional, autenticação, WMS, WebSocket, otimizador matemático ou IA de decisão. Apoio de IA foi usado durante o desenvolvimento.

Uma ferramenta WebMCP opcional seleciona setores em navegadores compatíveis. O recurso é experimental e não é necessário para utilizar o aplicativo.

## Inspiração

Conceito de interfaces corporativas 3D do [post fornecido como referência](https://lnkd.in/p/dHPpbUN). Identidade, código e regras desta implementação foram desenvolvidos para este projeto; não foi copiado código do autor da referência.

## Evolução possível

Integração com APIs de estoque, eventos de telemetria, testes de interação em dispositivos reais, otimização com restrições, internacionalização e estudo de usabilidade. São próximos passos, não recursos implementados.

---

## 🇺🇸 English

An interactive 3D logistics operations demo by **Renan Augusto dos Santos**. Built with React, TypeScript, Three.js and React Three Fiber. Explore warehouse sectors, simulate demand peaks and blocked docks, and compare explicit capacity assumptions.

All data is fictional. Shipment actions are session-only. Truck and forklift movement is illustrative. Shipment stages advance manually; departure deducts the corresponding pallet count. There is no live WMS integration or AI decision engine. The domain model is deterministic and covered by focused tests. Run the commands above with Node.js >=22.13 and pnpm.
