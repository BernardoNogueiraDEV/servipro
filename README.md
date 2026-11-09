## Links de entrega

- Repositório: https://github.com/BernardoNogueiraDEV/servipro
- GitHub Pages: https://bernardonogueiradev.github.io/servipro/
- Release v3.0.0: https://github.com/BernardoNogueiraDEV/servipro/releases/tag/v3.0.0

## Etapa 3 — JavaScript, Dados e Interatividade

Gerenciador de orçamentos de serviços em HTML, CSS e JavaScript, sem dependências de execução.

- Cadastro com validação de campos obrigatórios, telefone com DDD e CEP.
- Listagem e resumo gerados a partir dos dados, detalhes por identificador, edição e exclusão com confirmação.
- Pesquisa por cliente ou descrição, sem diferenciar acentos ou maiúsculas; filtro por status e ordenação por data ou valor.
- Persistência na chave `servipro.orcamentos.v3` do localStorage após cadastro, edição e exclusão. A primeira utilização começa vazia.
- Integração com ViaCEP: consulta pública preenche rua, bairro, cidade e UF do endereço do serviço. Esses dados são revisados pelo usuário e salvos junto ao orçamento. Falhas permitem preenchimento manual.
- Feedback de sucesso, erros, lista vazia e registros inexistentes; conteúdo informado tratado como texto.

## Executar

Abra o GitHub Pages acima ou execute `python -m http.server 8000` nesta pasta e acesse `http://localhost:8000`. Não há instalação ou build.

Os dados ficam apenas no navegador e origem utilizados. Não são enviados a um servidor e podem ser perdidos ao limpar os dados do navegador. A consulta de CEP exige internet; o restante funciona sem chamadas externas depois que as páginas são carregadas.

## Roteiro de verificação

1. Cadastre dois orçamentos com valores, datas e status diferentes. Confira campos obrigatórios e telefone/CEP inválidos.
2. Consulte um CEP válido e confirme o endereço nos detalhes depois de salvar; teste CEP inexistente e falta de conexão.
3. Recarregue a página e confirme a persistência. Abra detalhes e edite cliente, valor e status.
4. Pesquise por cliente ou serviço, combine com status e alterne todas as opções de ordenação.
5. Cancele uma exclusão, depois confirme e recarregue para verificar a remoção.
6. Abra um identificador inexistente e confira a mensagem. Repita em tela pequena.

