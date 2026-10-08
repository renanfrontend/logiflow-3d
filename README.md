# LogiFlow 3D

[![CI & Deploy](https://github.com/renanfrontend/logiflow-3d/actions/workflows/ci.yml/badge.svg)](https://github.com/renanfrontend/logiflow-3d/actions/workflows/ci.yml)

**Demo:** https://renanfrontend.github.io/logiflow-3d/

> © 2026 Renan Augusto dos Santos. **Todos os direitos reservados.** Código público apenas para avaliação de portfólio: copiar, adaptar ou reutilizar exige autorização por escrito. Veja [Licença e direitos autorais](#licença-e-direitos-autorais).

![Tela do LogiFlow 3D com indicadores de estoque e fluxo e a maquete isométrica do centro logístico](docs/screenshot.png)

Centro de distribuição interativo com simulação de decisões operacionais. Tabelas isoladas nem sempre mostram onde um gargalo acontece: o LogiFlow conecta uma representação espacial do centro logístico a indicadores e cenários comparáveis. É uma prova de conceito visual, sem conexão com instalações reais.

## O que dá para fazer

- Cena isométrica procedural com armazéns, docas, silos, pallets, caminhões e empilhadeiras selecionáveis.
- Modo de exploração do interior dos armazéns com estantes e estoque.
- Acompanhamento de cargas em cinco etapas, com baixa de estoque na saída.
- Seleção de setores pelo mapa e por botões HTML acessíveis por teclado.
- Camada de ocupação, pausa da animação e restauração da câmera.
- Cenários normal, pico de demanda e doca bloqueada.
- Balanceamento determinístico e indicadores derivados da mesma função de domínio.
- Expedição demonstrativa por carga, mantida somente durante a sessão.
- Comparativo antes/depois do balanceamento direto nos indicadores (+36/h, +30 p.p.).
- Card flutuante do ativo selecionado sobre a cena, sem deslocar o layout.
- Legenda da camada de ocupação com limiares definidos no domínio.
- Reinício da simulação a partir do laboratório de decisões.
- Interface responsiva, preferência de movimento reduzido e fallback para falha de WebGL.

Atalhos: `1` `2` `3` setores · `Espaço` pausa · `R` câmera · `H` ocupação · `I` interior · `Esc` fecha o ativo.

## Stack

React 19 · TypeScript · Three.js · React Three Fiber 9 · Drei · Lucide React · CSS · Vinext/Vite (App Router compatível com Next.js) · Cloudflare Workers.

A cena 3D é declarada como componentes React via React Three Fiber, o que permite compartilhar estado e tipos com o restante da interface sem uma camada de sincronização manual.

## Arquitetura

Camadas inspiradas em Clean Architecture, com dependências apontando para dentro:

```
lib/logiflow/
├── domain/          regras puras: capacidade, etapas de carga, estoque, fixtures tipadas
├── application/     reducer da operação + seletores (casos de uso, sem React)
└── presentation/    formatação de mensagens e geometria da rota (puro, testável)
hooks/logiflow/      adaptadores React: use-operation, atalhos, media queries, WebMCP
components/logiflow/ UI (MetricsGrid, MapCard, AssetPanel, Tracking, DecisionLab…)
└── scene/           Three.js / R3F: Scene, Yard, WarehouseModel, Truck, Forklift, CameraRig, LabelProjector
static/              entrypoint Vite do build estático (shim de next/link)
```

Decisões que valem a leitura:

- O estado da operação vive num `useReducer` com ações discriminadas e checagem exaustiva (`never`).
- Os indicadores são derivados por seletores puros a partir do mesmo modelo usado nos testes.
- A cena é carregada sob demanda (chunk separado). Os rótulos dos setores são botões HTML projetados pelo `LabelProjector`, sem `<Html>` por frame.
- DPR limitado a 1,5, sombras de resolução limitada e geometrias procedurais (sem assets de terceiros).

## Rodando localmente

Requer Node.js >= 22.13 e pnpm (versão declarada em package.json).

```bash
pnpm install --frozen-lockfile
pnpm dev            # App Router (vinext) em http://localhost:5173
```

| Script | O que faz |
| --- | --- |
| `pnpm typecheck` | TypeScript estrito, sem emissão |
| `pnpm lint` | ESLint (next/core-web-vitals + typescript) |
| `pnpm test` | Testes do domínio e da camada de aplicação (`node --test`) |
| `pnpm build` | Build App Router para Cloudflare Workers |
| `pnpm build:pages` | Build estático (SPA) em `out-pages/` para o GitHub Pages |

## CI/CD

`.github/workflows/ci.yml` roda typecheck, lint, testes e os dois builds em cada push e PR. Em `main`, o build estático é publicado no GitHub Pages.

> Primeira vez: em **Settings → Pages → Build and deployment**, selecione **GitHub Actions** como fonte.

## Premissas e limites

| Cenário | Demanda (pallets/h) | Capacidade base | Após balanceamento |
| --- | ---: | ---: | ---: |
| Normal | 120 | 144 | 180 |
| Pico | 168 | 144 | 180 |
| Doca bloqueada | 120 | 72 | 108 |

Fluxo = mínimo entre demanda e capacidade. Fila projetada = máximo entre zero e demanda menos capacidade, por hora. Espera adicional = fila/capacidade × 60. Demanda atendida = fluxo/demanda. Trata-se de uma aproximação didática em regime constante, não de uma simulação de eventos discretos nem de um SLA contratual.

O estoque parte de um snapshot fictício. A transição de carregamento para trânsito debita o volume uma vez. A doca bloqueada impede a saída da carga do setor C até aplicar o balanceamento. As etapas são avançadas manualmente para facilitar a demonstração. Caminhões são animações ilustrativas, não telemetria. O estado é reiniciado ao recarregar. Não há backend operacional, autenticação, WMS, WebSocket, otimizador matemático ou IA de decisão. Apoio de IA foi usado durante o desenvolvimento.

Uma ferramenta WebMCP opcional seleciona setores em navegadores compatíveis. O recurso é experimental e não é necessário para utilizar o aplicativo.

## Evolução possível

Integração com APIs de estoque, eventos de telemetria, testes de interação em dispositivos reais, otimização com restrições, internacionalização e estudo de usabilidade. São próximos passos, não recursos implementados.

## Autoria

Concepção, identidade visual, cena 3D e regras de simulação por **Renan Augusto dos Santos** ([renanaugusto.com.br](https://renanaugusto.com.br) · [contato@renanaugusto.com.br](mailto:contato@renanaugusto.com.br)). Os modelos são gerados por código, sem assets 3D de terceiros; componentes de terceiros incluídos no repositório (`components/ui`, `vendor/`) mantêm suas licenças. Os dados de estoque, cargas e cenários são fictícios.

## Licença e direitos autorais

© 2026 Renan Augusto dos Santos. **Todos os direitos reservados.**

Este não é um projeto open source. O código está público apenas para fins de portfólio e avaliação profissional. Sem autorização por escrito, não é permitido:

- copiar, modificar, redistribuir ou usar comercialmente o projeto, no todo ou em parte;
- reescrever o projeto em outra stack a partir deste repositório, ou reutilizar a interface, a identidade visual, a cena 3D e os textos;
- apresentar o projeto, ou parte dele, como trabalho próprio em portfólios, processos seletivos ou propostas comerciais;
- usar o conteúdo do repositório ou da demo para treinar ou avaliar modelos de IA.

Os termos completos estão em [LICENSE](LICENSE). Dependências e componentes de terceiros mantêm suas próprias licenças. Pedidos de autorização: [contato@renanaugusto.com.br](mailto:contato@renanaugusto.com.br). Para reportar uma vulnerabilidade, veja [SECURITY.md](SECURITY.md).

---

## 🇺🇸 English

An interactive 3D logistics operations demo by **Renan Augusto dos Santos**. Built with React, TypeScript, Three.js and React Three Fiber. Explore warehouse sectors, simulate demand peaks and blocked docks, and compare explicit capacity assumptions.

All data is fictional. Shipment actions are session-only. Truck and forklift movement is illustrative. Shipment stages advance manually; departure deducts the corresponding pallet count. There is no live WMS integration or AI decision engine. The domain model is deterministic and covered by focused tests. Run the commands above with Node.js >=22.13 and pnpm.

© 2026 Renan Augusto dos Santos. All rights reserved. This is not open source. The source is public for portfolio evaluation only; copying, modifying, porting, redistributing, commercial use, presenting it as your own work or using it to train AI models requires written permission. See [LICENSE](LICENSE). Contact: [contato@renanaugusto.com.br](mailto:contato@renanaugusto.com.br) · [renanaugusto.com.br](https://renanaugusto.com.br).
