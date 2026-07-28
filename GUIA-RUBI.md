# Guia da RUBI Agência

Como mexer neste projeto, publicar alterações e criar novos formulários.
Escrito para quem não programa — cada passo é literal.

---

## 1. O que você tem hoje

| | |
|---|---|
| **Formulário do cliente** | https://briefing-agencia-rubi.vercel.app |
| **Painel interno** | https://briefing-agencia-rubi.vercel.app/admin |
| **Código** | https://github.com/rubistudio449-commits/briefing-agencia-rubi |
| **Hospedagem** | Vercel, time RUBI AGENCIA |

O link do formulário é o que você envia para o cliente. O painel é só seu — pede senha.

Quando um cliente termina o briefing, as respostas ficam guardadas automaticamente e aparecem
no painel. Nada se perde: mesmo se o cliente fechar o navegador no meio, ao voltar ele retoma
de onde parou.

### O painel

- **`/admin`** — lista os briefings recebidos, do mais recente para o mais antigo
- Clique em qualquer um para ver todas as respostas, organizadas nas 21 seções
- Botão **Baixar PDF** → abre a janela de impressão → escolha **Salvar como PDF** em "Destino"

---

## 2. Instalar o que precisa (uma vez só)

Baixe e instale, nesta ordem:

1. **Node.js** — https://nodejs.org (escolha a versão LTS, o botão da esquerda)
2. **Git** — https://git-scm.com/downloads
3. **VS Code** — https://code.visualstudio.com

Em todos, pode aceitar as opções padrão e clicar em "Avançar" até o fim.

---

## 3. Abrir o projeto no seu computador (uma vez só)

1. Abra o **VS Code**
2. Menu **Terminal → New Terminal** (abre uma faixa preta embaixo)
3. Cole os comandos abaixo, um de cada vez, apertando Enter depois de cada:

```bash
cd Documents
git clone https://github.com/rubistudio449-commits/briefing-agencia-rubi.git
cd briefing-agencia-rubi
npm install
```

O `npm install` demora alguns minutos na primeira vez. É normal.

4. Menu **File → Open Folder** → escolha a pasta `briefing-agencia-rubi` dentro de Documentos

Pronto, o projeto está aberto.

### Ver o site rodando na sua máquina

No terminal do VS Code:

```bash
npm run dev
```

Abra http://localhost:3000 no navegador. Tudo que você alterar aparece ali na hora, **sem
afetar o site que está no ar**. Para parar, clique no terminal e aperte `Ctrl + C`.

---

## 4. Publicar uma alteração

Sempre que mexer em algo e quiser que entre no ar:

```bash
git add .
git commit -m "descrição curta do que mudou"
git push
```

A Vercel percebe sozinha e republica em 1 ou 2 minutos. Você acompanha em
vercel.com → o projeto → **Deployments**.

> **Se der erro no `git push` pedindo login:** o GitHub vai abrir uma janela no navegador.
> Entre com a conta `rubistudio449-commits` e tente de novo.

---

## 5. Mudar as perguntas

Todas as perguntas estão em **um único arquivo**: `src/data/briefing.ts`

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

O que cada linha faz:

| Campo | Para que serve |
|---|---|
| `id` | nome interno. **Não mude depois que o formulário estiver no ar** — é a chave da resposta |
| `section` | a qual das 21 seções pertence |
| `label` | a pergunta que o cliente lê |
| `helper` | a frase menor de apoio, embaixo da pergunta (opcional) |
| `type` | o tipo de campo (tabela abaixo) |
| `required` | `true` = obrigatória, `false` = pode pular |
| `options` | a lista de alternativas, quando houver |
| `maxSelections` | limite de escolhas, ex.: `5` para "escolha até 5" |

### Tipos de campo disponíveis

| `type` | Como aparece |
|---|---|
| `shortText` | uma linha de texto |
| `longText` | caixa de texto que cresce conforme escreve |
| `email` | valida se é um e-mail de verdade |
| `phone` | formata sozinho como (00) 00000-0000 |
| `url` | valida se é um endereço de site |
| `radioCards` | cartões para escolher **uma** opção |
| `checkboxGrid` | etiquetas para marcar **várias** (até 8 opções) |
| `multiSelect` | lista suspensa com busca, para listas longas (9 ou mais) |
| `file` | enviar arquivos, com campo de link como alternativa |

### Exemplos práticos

**Trocar o texto de uma pergunta:** ache o `label` e reescreva entre as aspas.

**Tornar obrigatória:** troque `required: false` por `required: true`.

**Adicionar uma opção numa lista:** ache o `options` e acrescente entre aspas, com vírgula:

```ts
options: ['Instagram', 'Indicação', 'Google', 'Já conhecia o trabalho', 'TikTok', 'Outro'],
```

**Adicionar uma pergunta nova:** copie um bloco inteiro (das chaves `{` até `},`), cole logo
abaixo e mude o `id`, o `label` e o `type`. O `id` precisa ser diferente de todos os outros.

**Apagar uma pergunta:** apague o bloco inteiro, das chaves `{` até `},`.

> Depois de mexer, rode `npm run dev` e confira em http://localhost:3000 antes de publicar.
> Se aparecer erro vermelho no terminal, geralmente é uma vírgula ou aspas faltando.

---

## 6. Mudar as cores e as fontes

Dois arquivos, só isso:

**`src/styles/theme.css`** — as cores:

```css
--color-ink: #000000;      /* fundo */
--color-paper: #efefef;    /* texto */
--color-accent: #a66f3a;   /* bronze da marca */
```

**`src/app/layout.tsx`** — as fontes, hoje `Bodoni Moda` (títulos) e `Jost` (interface).
Qualquer fonte do Google Fonts pode ser usada trocando o nome nas duas primeiras linhas.

Os arquivos do logotipo estão em `public/brand/`. Para trocar, substitua mantendo os
mesmos nomes.

---

## 7. Criar um formulário novo (outro tipo de briefing)

Digamos que você queira um "Briefing de Social Media", separado deste.

1. No GitHub, abra o repositório e clique em **Use this template → Create a new repository**
   (ou, se o botão não existir, **Fork**). Dê o nome novo, ex.: `briefing-social-media`
2. Clone na sua máquina, como no passo 3, trocando o endereço
3. Reescreva `src/data/briefing.ts` com as perguntas do novo briefing
4. Ajuste os textos de abertura em `src/config/brand.ts` (o título e a mensagem de boas-vindas)
5. Na Vercel: **Add New → Project** → importe o repositório novo
6. Em **Environment Variables**, adicione `ADMIN_PASSWORD` (pode ser a mesma senha)
7. Em **Storage → Blob → Connect to Project**, conecte um store (pode ser o mesmo)
8. **Deploy**

Você terá dois formulários independentes, cada um com seu link e seu painel.

> A identidade visual, o funcionamento do fluxo, o painel e o PDF vêm prontos. O trabalho
> real é só escrever as perguntas novas.

---

## 8. Configurações na Vercel

Em vercel.com → projeto → **Settings → Environment Variables**:

| Variável | Para que serve |
|---|---|
| `ADMIN_PASSWORD` | a senha do painel. Para trocar, edite aqui e faça **Redeploy** |
| `BLOB_READ_WRITE_TOKEN` | permite o cliente anexar imagens. Sem ela, só aceita link |
| `WEBHOOK_URL` | opcional. Envia uma cópia das respostas para um sistema externo (n8n, Zapier) |

> **Importante:** toda vez que criar ou alterar uma variável, é preciso ir em
> **Deployments → o mais recente → ⋯ → Redeploy**. Sem isso a mudança não vale.

### Apagar um briefing

Ainda não existe botão para isso. Por enquanto: Vercel → **Storage** → o store →
localize o arquivo em `briefings/` e apague.

---

## 9. Quando algo der errado

| Situação | O que fazer |
|---|---|
| Erro vermelho no terminal ao rodar | leia a última linha: quase sempre diz o arquivo e a linha. Costuma ser vírgula ou aspas |
| O site no ar não mudou | veja em **Deployments** se o deploy terminou. Se falhou, clique nele e leia o log |
| Mudei uma variável e nada aconteceu | falta o **Redeploy** |
| Painel diz "arquivamento não está ativo" | o Blob Store não está conectado, ou falta Redeploy |
| Quero desfazer tudo que mexi | `git checkout .` desfaz alterações ainda não publicadas |

O código está todo comentado em português, explicando o porquê de cada decisão. Se precisar
entender alguma parte, comece pelo `README.md`, que é mais técnico que este guia.
