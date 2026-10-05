# Política de segurança

## Escopo

O LogiFlow 3D é uma demonstração estática: não há backend, autenticação, banco de dados nem coleta de dados pessoais. Todo o estado da simulação vive apenas na sessão do navegador.

## Como reportar uma vulnerabilidade

Não abra uma issue pública. Use o reporte privado do GitHub:

1. Acesse a aba **Security** do repositório.
2. Clique em **Report a vulnerability**.
3. Descreva o problema, os passos para reproduzir e o impacto.

O retorno inicial acontece em até 7 dias.

## Medidas adotadas

- Política de segurança de conteúdo (CSP) e política de referência no site publicado.
- Dependabot para atualizar dependências npm e GitHub Actions, com período de carência de 7 dias para novas versões.
- Workflow de CI com permissões mínimas e sem persistir credenciais no checkout.
- Nenhum segredo, token ou dado pessoal versionado.
