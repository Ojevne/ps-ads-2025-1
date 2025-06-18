# Forkando e clonando este repositório
1. Faça _login_ no [GitHub](https://github.com).
2. Acesse [https://github.com/faustocintra/ps-ads-2025-1](https://github.com/faustocintra/ps-ads-2025-1).
3. Clique sobre o botão `[Fork]` no canto superior direito.
4. Na página seguinte ("Create new fork"), não altere nada, simplesmente clique sobre o botão `[Create fork]`. Aguarde.
5. Confira se a URL mostrada no navegador corresponde a "https://github.com/**<SEU USUÁRIO>**/ps-ads-2025-1".
6. Clique sobre o botão verde `[Code]` e copie o endereço do seu repositório forkado.
7. Abra o Visual Studio Code. Se houver algum projeto aberto, feche-o usando a opção de menu `Arquivo > Fechar Pasta` (ou `File > Close folder`).
8. Clique sobre o botão que se parece com um `Y` na barra vertical esquerda do Visual Studio Code. Em seguida, clique sobre o botão `[Clonar repositório...]` (ou `[Clone repository...]`). Nessa etapa, se o Git não estiver instalado na máquina, será necessário baixá-lo (a partir de [https://git-scm.com/](https://git-scm.com/)) e instalá-lo antes de poder clonar o repositório.
9. Na caixa de diálogo que se abre no alto da janela, cole o endereço do repositório copiado no passo 6.
10. Escolha um pasta local do computador para armazenar os arquivos do repositório clonado.
11. Ao ser perguntado se deseja abrir o repositório clonado, clique sobre o botão `[Abrir]`.

# Criando um projeto Express.js
Siga as instruções deste [artigo](https://faustocintra.com.br/desenvolvimento-back-end/criando-um-projeto-express-js-em-2024/).

# Criando e configurando a conexão do Prisma ORM com o Supabase (PostgreSQL)
Siga as instruções deste [outro artigo](https://faustocintra.com.br/desenvolvimento-back-end/configurando-a-conexao-do-prisma-orm-com-o-supabase-postgresql/).

# Corrigindo o erro de conexão com o Supabase na rede da Fatec
1. Acesse o _dashboard_ do Supabase ([supabase.com](https://supabase.com)) e clique sobre o botão `[Connect]` no topo da página.
2. No projeto `back-end`, abra o arquivo `.env` e ajuste as _strings_ de conexão:
* `DIRECT_URL`: copie a _string_ **Transaction pooler** do Supabase;
* `DATABASE_URL`: copie a _string_ **Session pooler** do Supabase
Em ambas as _strings_, substitua a parte **[YOUR-PASSWORD]** pela senha real (remova inclusive os colchetes).