# Divulgação — LogiFlow 3D

Vídeos: `logiflow-3d-linkedin-16x9.mp4` (LinkedIn) e `logiflow-3d-reels-9x16.mp4` (Instagram Reels).

## LinkedIn

Dá para colocar Clean Architecture dentro de uma cena 3D?

O LogiFlow 3D é um centro de distribuição que roda no navegador: armazéns, docas, caminhões e empilhadeiras numa cena 3D ligada aos indicadores da operação. A ideia é enxergar no espaço onde o gargalo acontece e testar uma decisão, como desviar a expedição de uma doca bloqueada, antes de aplicá-la.

A primeira versão provava o conceito visual. Nesta, voltei ao código com olhar de produto: separei regra de negócio da renderização, tipei o domínio de ponta a ponta, cobri as regras com testes e coloquei tudo num pipeline de CI/CD.

O que mudou:

🧱 Arquitetura em camadas
Domínio puro (capacidade, etapas de carga, estoque), camada de aplicação com reducer + seletores e a UI como adaptador. O Three.js não sabe o que é uma regra de negócio, e a regra de negócio não sabe que existe Three.js.

🔒 Tipagem que impede estado inválido
IDs como template literal types (`LF-${number}`, `TRK-${string}`), ações discriminadas e checagem exaustiva com `never` no reducer. Esquecer um caso vira erro de compilação, não bug em produção.

🧪 Testes sem DOM
20 testes rodando com `node --test` direto nas regras e nos casos de uso. Dá para validar "doca bloqueada trava a expedição até o balanceamento" sem abrir o navegador.

🎯 UX dentro do canvas
Comparativo antes/depois nos KPIs (+36 pallets/h, +30 p.p. de demanda atendida), card do ativo flutuando sobre a cena, atalhos de teclado e rótulos HTML projetados sobre o 3D, com abas de setor para quem navega pelo teclado.

🚀 CI/CD
GitHub Actions com typecheck, lint, testes e dois builds: App Router para Cloudflare Workers e uma SPA estática publicada no GitHub Pages, reaproveitando a mesma página.

No vídeo: simulo uma doca bloqueada, a carga trava na expedição, aplico o balanceamento e os indicadores são recalculados na hora.

Os dados são fictícios e as regras de simulação são explícitas e determinísticas. Não há WMS real nem IA tomando decisões. Usei apoio de IA no desenvolvimento.

🔗 Demo: https://renanfrontend.github.io/logiflow-3d/
💻 Código: https://github.com/renanfrontend/logiflow-3d

Como você separa regra de negócio de renderização quando a interface é 3D?

#React #TypeScript #Threejs #ReactThreeFiber #CleanArchitecture #Frontend #GitHubActions #Logistica

## Instagram Reels

**Legenda:**

Um centro logístico inteiro rodando no navegador 🏭📦

Bloqueei uma doca, a carga travou, apliquei o balanceamento e os KPIs se recalcularam na hora. Tudo em React + Three.js, com regra de negócio separada da cena 3D.

⚙️ React Three Fiber · TypeScript estrito · Clean Architecture · CI/CD no GitHub Actions

Responsivo de verdade: o vídeo foi gravado no layout mobile.

Salva pra ver depois e me conta: que sistema você colocaria em 3D? 👇

#react #typescript #threejs #frontend #webdev #programacao #desenvolvedorfrontend #javascript #reactthreefiber #cleanarchitecture

**Texto da capa:** "Clean Architecture em 3D?"

**Dica:** escolha um áudio em alta no próprio app; o vídeo não tem trilha para não conflitar com ela.
