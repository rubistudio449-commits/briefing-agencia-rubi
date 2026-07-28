# Guia da RUBI Agência

Tudo o que você precisa para usar, alterar e expandir este projeto — inclusive com a ajuda do
Claude. Escrito para quem não programa: cada passo é literal.

---

## 1. O que você tem

| | |
|---|---|
| **Formulário do cliente** | https://briefing-agencia-rubi.vercel.app |
| **Painel interno** | https://briefing-agencia-rubi.vercel.app/admin |
| **Código** | https://github.com/rubistudio449-commits/briefing-agencia-rubi |
| **Hospedagem** | Vercel, time RUBI AGENCIA |

O link do formulário é o que você envia ao cliente. O painel é só seu — pede senha.

Quando o cliente termina, as respostas ficam guardadas automaticamente e aparecem no painel.
Se ele fechar o navegador no meio, ao voltar retoma de onde parou. Nada se perde.

### Como funciona o painel

- **`/admin`** — os briefings recebidos, do mais recente para o mais antigo
- Clique em um deles para ver todas as respostas, organizadas nas 21 seções
- **Baixar PDF** → abre a janela de impressão → escolha **Salvar como PDF** em "Destino"

Já existe um briefing de exemplo lá dentro, da marca fictícia **Casa de Linho**, com as 108
perguntas respondidas. Serve para você ver o formato antes do primeiro cliente real.

### Trocar a senha do painel

A senha atual foi definida durante o desenvolvimento e é boa prática trocá-la agora que o
projeto é seu:

1. vercel.com → projeto `briefing-agencia-rubi` → **Settings → Environment Variables**
2. Na linha `ADMIN_PASSWORD`, clique em **⋯ → Edit** e coloque a senha nova
3. **Deployments** → o mais recente → **⋯ → Redeploy**

Sem o Redeploy a senha antiga continua valendo.

---

## 2. Preparar seu computador (uma vez só)

Baixe e instale, nesta ordem. Em todos, pode aceitar as opções padrão:

1. **Node.js** — https://nodejs.org (versão LTS, o botão da esquerda)
2. **Git** — https://git-scm.com/downloads
3. **VS Code** — https://code.visualstudio.com

---

## 3. Baixar o projeto (uma vez só)

1. Abra o **VS Code**
2. Menu **Terminal → New Terminal** (abre uma faixa embaixo)
3. Cole os comandos abaixo, um por vez, apertando Enter depois de cada:

```bash
cd Documents
git clone https://github.com/rubistudio449-commits/briefing-agencia-rubi.git
cd briefing-agencia-rubi
npm install
```

O `npm install` demora alguns minutos na primeira vez — é normal.

4. Menu **File → Open Folder** → escolha `briefing-agencia-rubi` dentro de Documentos

### Ver o site rodando na sua máquina

```bash
npm run dev
```

Abra http://localhost:3000. Tudo que você alterar aparece ali na hora, **sem afetar o site no
ar**. Para parar, clique no terminal e aperte `Ctrl + C`.

> Esse endereço só funciona no seu computador. É o seu rascunho.

---

## 4. Publicar uma alteração

Quando estiver satisfeita com a mudança:

```bash
git add .
git commit -m "descrição curta do que mudou"
git push
```

A Vercel percebe sozinha e republica em 1 ou 2 minutos. Acompanhe em vercel.com → o projeto →
**Deployments**.

> **Se o `git push` pedir login:** o GitHub abre uma janela no navegador. Entre com a conta
> `rubistudio449-commits`.

---

## 5. Usar o Claude para alterar o projeto

Esta é a parte que mais vai te economizar tempo. O Claude lê o projeto inteiro e faz as
alterações para você.

### Instalar

No terminal do VS Code, dentro da pasta do projeto:

```bash
npm install -g @anthropic-ai/claude-code
claude
```

Na primeira vez ele pede para entrar com sua conta Anthropic. Depois disso, basta digitar
`claude` no terminal, sempre **dentro da pasta do projeto**.

> Existe também a extensão do Claude para VS Code, na aba de extensões (o ícone de blocos na
> barra lateral). Funciona igual, com uma janela de conversa ao lado do código.

### Por que ele já entende este projeto

Na raiz existem dois arquivos que o Claude lê sozinho ao abrir a pasta: `AGENTS.md` e
`CLAUDE.md`. Eles explicam a arquitetura, as decisões tomadas, o que não pode ser quebrado e
como testar. **Não apague esses arquivos** — são eles que fazem o Claude acertar de primeira em
vez de chutar.

### Como pedir bem

Peça o resultado que você quer, com contexto. Ele descobre onde mexer.

**Bons pedidos:**

> Adicione uma pergunta na seção 5 perguntando qual o ticket médio do cliente, com opções de
> faixa de valor, e deixe opcional.

> A pergunta sobre concorrentes está confusa. Reescreva o texto de apoio deixando claro que
> queremos o Instagram deles.

> Crie um botão no painel para apagar um briefing, com confirmação antes.

> O formulário está pesado no celular. Veja se dá para melhorar a velocidade de carregamento.

**Peça sempre que ele verifique.** Uma frase que vale ter no bolso:

> Depois de alterar, rode `npm run build` e `npx eslint src` e me diga se passou.

**Antes de publicar**, peça uma revisão do que ele fez:

> Me explique o que você mudou e por quê, e se algo pode quebrar o que já existe.

### O que evitar

- **Não peça para renomear os `id` das perguntas.** Eles são a chave das respostas já
  guardadas; renomear órfã os briefings antigos. Adicionar e remover é seguro.
- **Não mexa nas variáveis de ambiente pelo código.** Senha e tokens ficam só na Vercel.
- **Não publique sem testar.** Rode `npm run dev`, percorra o formulário até o fim e veja se
  está tudo certo.

### Se algo der errado

O Git guarda tudo. Para descartar alterações ainda não publicadas:

```bash
git checkout .
```

Isso volta os arquivos ao último estado publicado. Se já publicou e quer voltar atrás, peça ao
Claude: *"desfaça o último commit e volte ao estado anterior"*.

---

## 6. Mudar as perguntas você mesma

Se preferir editar na mão, todas as perguntas estão em **um único arquivo**:
`src/data/briefing.ts`

Cada pergunta é um bloco assim:

```ts
{
  id: 'marca_nome',
  section: 2,
  label: 'Qual é o nome da sua marca?',
  helper: 'Escreva exatamente como deseja que ele seja apresentado.',
  type: 'shortText',
  required: true,
},
```

| Campo | Para que serve |
|---|---|
| `id` | nome interno. **Não mude depois que estiver no ar** |
| `section` | a qual das 21 seções pertence |
| `label` | a pergunta que o cliente lê |
| `helper` | a frase menor de apoio (opcional) |
| `type` | o tipo de campo (tabela abaixo) |
| `required` | `true` = obrigatória, `false` = pode pular |
| `options` | a lista de alternativas, quando houver |
| `maxSelections` | limite de escolhas, ex.: `5` para "escolha até 5" |

### Tipos de campo

| `type` | Como aparece |
|---|---|
| `shortText` | uma linha de texto |
| `longText` | caixa que cresce conforme escreve |
| `email` | valida se é e-mail de verdade |
| `phone` | formata sozinho como (00) 00000-0000 |
| `url` | valida se é endereço de site |
| `radioCards` | cartões para escolher **uma** opção |
| `checkboxGrid` | etiquetas para marcar **várias** (até 8 opções) |
| `multiSelect` | lista suspensa com busca, para listas longas (9 ou mais) |
| `file` | enviar arquivos, com campo de link como alternativa |

### Alterações comuns

**Trocar o texto:** ache o `label` e reescreva entre as aspas.

**Tornar obrigatória:** troque `required: false` por `required: true`.

**Adicionar opção numa lista:** ache o `options` e acrescente entre aspas, com vírgula:

```ts
options: ['Instagram', 'Indicação', 'Google', 'Já conhecia o trabalho', 'TikTok', 'Outro'],
```

**Adicionar pergunta:** copie um bloco inteiro (de `{` até `},`), cole abaixo e mude o `id`, o
`label` e o `type`. O `id` precisa ser diferente de todos os outros.

**Apagar pergunta:** apague o bloco inteiro, de `{` até `},`.

> Depois de mexer, rode `npm run dev` e confira antes de publicar. Se aparecer erro vermelho no
> terminal, quase sempre é vírgula ou aspas faltando — e o Claude resolve num pedido.

---

## 7. Mudar cores e fontes

**`src/styles/theme.css`** — as cores da marca:

```css
--color-ink: #000000;      /* fundo */
--color-paper: #efefef;    /* texto */
--color-accent: #a66f3a;   /* bronze */
```

**`src/app/layout.tsx`** — as fontes, hoje `Bodoni Moda` (títulos) e `Jost` (interface).
Qualquer fonte do Google Fonts serve, trocando o nome.

Os arquivos do logotipo estão em `public/brand/`. Para trocar, substitua mantendo os mesmos
nomes de arquivo.

> Se mudar uma cor no `theme.css`, mude também em `src/config/brand.ts` — a imagem que aparece
> ao compartilhar o link no WhatsApp é gerada fora do sistema de estilos e lê os valores de lá.

---

## 8. Criar um formulário novo

Digamos um "Briefing de Social Media", separado deste.

1. No GitHub, abra o repositório → **Settings** → marque **Template repository**
2. Volte à página inicial do repositório → **Use this template → Create a new repository** →
   dê o nome novo, ex.: `briefing-social-media`
3. Clone na sua máquina como no passo 3, trocando o endereço
4. Reescreva `src/data/briefing.ts` com as perguntas novas — ou peça ao Claude:
   *"substitua as perguntas por estas aqui: [cole a lista]"*
5. Ajuste os textos de abertura em `src/config/brand.ts`
6. Na Vercel: **Add New → Project** → importe o repositório novo
7. Em **Environment Variables**, adicione `ADMIN_PASSWORD`
8. Em **Storage → Blob → Connect to Project**, conecte um store (pode ser o mesmo)
9. **Deploy**

Dois formulários independentes, cada um com seu link e seu painel. A identidade visual, o
fluxo, o painel e o PDF vêm prontos — o trabalho real é escrever as perguntas.

---

## 9. Configurações na Vercel

vercel.com → projeto → **Settings → Environment Variables**:

| Variável | Para que serve |
|---|---|
| `ADMIN_PASSWORD` | senha do painel |
| `BLOB_READ_WRITE_TOKEN` | permite o cliente anexar imagens. Sem ela, só aceita link |
| `WEBHOOK_URL` | opcional. Envia cópia das respostas para um sistema externo (n8n, Zapier) |

O armazenamento dos briefings vem do **Blob Store** conectado em **Storage**. Ele já está
ligado — não precisa mexer.

> **Toda alteração de variável exige Redeploy:** Deployments → o mais recente → ⋯ → Redeploy.

### Apagar um briefing

Ainda não existe botão para isso. Por enquanto: Vercel → **Storage** → o store → localize o
arquivo dentro de `briefings/` e apague. (Dá para pedir ao Claude para criar esse botão.)

---

## 10. Quando algo der errado

| Situação | O que fazer |
|---|---|
| Erro vermelho no terminal | leia a última linha: costuma dizer o arquivo e a linha |
| O site no ar não mudou | veja em **Deployments** se terminou. Se falhou, clique e leia o log |
| Mudei uma variável e nada mudou | falta o **Redeploy** |
| Painel diz "arquivamento não está ativo" | o Blob Store não está conectado, ou falta Redeploy |
| Quero desfazer o que mexi | `git checkout .` |
| Não entendi um erro | copie a mensagem inteira e cole para o Claude |

---

## Resumo dos comandos

```bash
npm run dev      # rodar na sua máquina, em localhost:3000
npm run build    # conferir se está tudo certo antes de publicar
claude           # abrir o Claude dentro do projeto

git add .                       # marcar as alterações
git commit -m "o que mudou"     # registrar
git push                        # publicar (a Vercel republica sozinha)
git checkout .                  # desfazer alterações não publicadas
```

O código está comentado em português, explicando o porquê de cada decisão. O `README.md` traz a
parte técnica, e o `AGENTS.md` é o que o Claude lê para entender o projeto.
