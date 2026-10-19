# ServiPro — gestão de orçamentos

Projeto da disciplina Desenvolvimento de Interfaces Web, desenvolvido por Bernardo Alves Nogueira.

## Etapa 2 — CSS, Layout e Responsividade

Interface em HTML e CSS para listagem, cadastro e detalhes de orçamentos de serviços, inspirada na referência visual do projeto. Os dados são fictícios e as funcionalidades de cadastro, pesquisa, filtros, ordenação, busca de CEP, edição e exclusão ainda não possuem implementação em JavaScript.

- CSS externo compartilhado em `assets/css/style.css`, com variáveis de cores, tipografia, espaçamentos, bordas e Box Model.
- Flexbox na navegação, no cabeçalho da listagem e nos grupos de ações.
- CSS Grid nos indicadores, na pesquisa, nos formulários e nos detalhes.
- Media Queries em 1000px e 600px: a tabela vira cartões, os campos passam para uma coluna e a navegação se adapta.
- Labels visíveis, contraste, indicadores de status com texto, estados de hover, active e foco e link para pular ao conteúdo.
- Aviso visível sobre o escopo do protótipo nas três páginas.

## Executar e verificar

Abra `index.html` no navegador ou execute `python -m http.server 4173` na pasta do projeto e acesse `http://localhost:4173`.

As três páginas foram verificadas no Chromium nas larguras de 320, 375, 600, 768, 1000, 1280 e 1440 pixels, conferindo carregamento do CSS e ausência de rolagem horizontal. Também foi verificado o acesso por teclado ao link de pular para o conteúdo.

## Links de entrega

- Repositório: https://github.com/BernardoNogueiraDEV/servipro
- GitHub Pages: https://bernardonogueiradev.github.io/servipro/
- Release v2.0.0: https://github.com/BernardoNogueiraDEV/servipro/releases/tag/v2.0.0
- ZIP da versão: https://github.com/BernardoNogueiraDEV/servipro/archive/refs/tags/v2.0.0.zip

A Etapa 1 permanece registrada na Release `v1.0.0` e no histórico do repositório.
