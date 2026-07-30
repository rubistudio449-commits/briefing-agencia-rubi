# Briefing Studio — RUBI Agência

Aplicação de briefing da RUBI Agência. O cliente responde **uma pergunta por tela**, no estilo
Typeform; ao final as respostas são arquivadas e ficam num painel interno, com exportação em PDF.

Dois formulários hoje, cada um transcrito de um documento oficial da agência:

| Formulário | Rota | Perguntas |
|---|---|---|
| Briefing de Identidade Visual | `/` e `/briefing` | 109 em 21 seções |
| Onboarding de Marketing | `/onboarding-marketing` | 286 em 35 seções |

## Começando

```bash
npm install
cp .env.example .env.local   # preencha WEBHOOK_URL
npm run dev
```

A aplicação sobe em <http://localhost:3000>. Sem `WEBHOOK_URL` o preenchimento funciona
normalmente, mas o envio final retorna erro — é o único ponto que exige configuração.

## Variáveis de ambiente

| Variável | Obrigatória | Para quê |
|---|---|---|
| `WEBHOOK_URL` | não | Encaminha uma cópia das respostas para n8n, Make, Zapier ou endpoint próprio. Lida apenas no servidor. |
| Blob conectado | sim* | Arquiva os briefings para o painel interno. Basta **Storage → Blob → Connect** na Vercel. |
| `BLOB_READ_WRITE_TOKEN` | não | Só é necessária para o **upload de arquivos pelo navegador**. Sem ela, os campos de referência aceitam apenas link. |
| `ADMIN_PASSWORD` | não | Senha do painel interno em `/admin`. Sem ela, o painel exibe um aviso e não permite entrar. |
| `NEXT_PUBLIC_SITE_URL` | não | Domínio final, usado na URL absoluta da imagem de Open Graph. Na Vercel é deduzido automaticamente. |

\* O envio só falha quando o briefing não seria guardado em lugar nenhum — ou seja, sem Blob **e**
sem webhook. Com qualquer um dos dois, o cliente conclui normalmente.

Ao conectar um Blob Store, a Vercel usa hoje autenticação por **OIDC**, criando `BLOB_STORE_ID`
em vez de `BLOB_READ_WRITE_TOKEN`. As operações de servidor (`put`, `get`, `list`) funcionam
assim, e é o que o arquivamento usa. Já o upload direto do navegador precisa emitir um token para
o cliente, o que exige `BLOB_READ_WRITE_TOKEN` — gere um na página do store se quiser que os
clientes anexem imagens em vez de colar links.

`NEXT_PUBLIC_WEBHOOK_URL` também é aceito por compatibilidade, mas **prefira `WEBHOOK_URL`**:
variáveis `NEXT_PUBLIC_` são embutidas no JavaScript enviado ao navegador, o que deixaria o
endereço do webhook visível para qualquer visitante.

## O payload enviado

```jsonc
{
  "nome": "...",
  "email": "...",
  "whatsapp": "...",
  "formulario": "identidade-visual", // qual questionário originou
  "empresa": "...",                  // nome da marca
  "respostas": {
    "marca_nome": {
      "pergunta": "Qual é o nome da sua marca?",
      "secao": "02 | SOBRE A MARCA",
      "resposta": "..."              // string ou lista, conforme o campo
    }
  },
  "arquivos": {
    "referencias_gosta_arquivos": {
      "pergunta": "Envie de 3 a 5 referências visuais que você gosta.",
      "urls": ["https://....blob.vercel-storage.com/..."],
      "link": "https://pinterest.com/..."
    }
  },
  "resumoMarkdown": "# Briefing...",  // versão legível, pronta para e-mail
  "meta": { "totalPerguntas": 109, "respondidas": 97, "duracaoSegundos": 1840 },
  "enviadoEm": "2026-07-27T13:40:00.000Z",
  "origem": "Briefing Identidade Visual"
}
```

O payload é montado **no servidor**, a partir da transcrição oficial em
[src/data/forms/](src/data/forms/) — o navegador envia apenas o slug e as respostas cruas.
Perguntas ocultadas por lógica condicional e respostas em branco não entram no envio.

`resumoMarkdown` existe para que o destino (n8n, por exemplo) consiga encaminhar o briefing por
e-mail ou WhatsApp sem ter que percorrer o JSON.

## Painel interno

Em `/admin`, protegido por senha (`ADMIN_PASSWORD`), ficam os briefings recebidos:

- **`/admin`** — lista de briefings, do mais recente para o mais antigo, com filtro por tipo de formulário.
- **`/admin/formularios`** — os questionários ativos, com todas as perguntas e o link de cada um.
- **`/admin/[id]`** — o briefing completo, agrupado pelas 21 seções, com as referências visuais exibidas em miniatura.
- **`/admin/[id]/imprimir`** — versão em preto sobre branco para exportar em PDF. O botão **Baixar PDF** abre o diálogo de impressão do navegador; basta escolher "Salvar como PDF" em Destino. As imagens de referência entram no documento.

A exclusão fica ao final da página de detalhe, com confirmação em dois passos, e roda como
Server Action que revalida a sessão por conta própria — uma action é um endpoint e pode ser
chamada sem passar pela página.

Cada briefing é arquivado como um JSON **privado** no Vercel Blob (`briefings/<id>.json`),
gravado **antes** da chamada ao webhook — se o destino estiver fora do ar, as respostas continuam
disponíveis no painel. A sessão usa um cookie `HttpOnly` assinado com HMAC, válido por 7 dias.

Em desenvolvimento, sem Blob configurado, os briefings caem numa pasta local `.briefings/`
(ignorada pelo Git) — assim dá para exercitar o painel inteiro sem depender da Vercel. Para
usar esse modo com `next start`, defina `BRIEFINGS_LOCAL=1`.

## Identidade visual

A paleta tem exatamente as três cores dos arquivos oficiais da marca:

| Token | Hex | Uso |
|---|---|---|
| `ink` | `#000000` | fundo |
| `paper` | `#EFEFEF` | texto e logotipo |
| `accent` | `#A66F3A` | bronze da marca: barra de progresso, numeral das seções, símbolo |
| `accent-soft` | `#C89055` | clareado do bronze para texto pequeno — `#A66F3A` sobre preto dá 4.96:1, no limite do AA; este chega a 7.58:1 |

Tipografia: `Bodoni Moda` nos títulos e perguntas, `Jost` na interface — ambas via `next/font`,
escolhidas por proximidade com o lettering do logotipo.

Os arquivos da marca ficam em [public/brand/](public/brand/), já recortados e redimensionados a
partir dos PNGs originais de 4500×5500 (que tinham ~2% de área útil):

| Arquivo | O que é |
|---|---|
| `wordmark.png` | lockup horizontal, off-white — usado no cabeçalho, na abertura e no sucesso |
| `wordmark-stacked.png` | versão empilhada, off-white |
| `monogram.png` | monograma "R" — origem do favicon |
| `symbol.png` / `symbol-bronze.png` | símbolo isolado, nas duas cores |

O favicon é gerado em [src/app/icon.png](src/app/icon.png) e [src/app/apple-icon.png](src/app/apple-icon.png):
monograma branco sobre o preto da marca.

Para alterar qualquer coisa da marca, os pontos são
[src/config/brand.ts](src/config/brand.ts) (nome, textos, hexadecimais usados na imagem de Open
Graph), [src/styles/theme.css](src/styles/theme.css) (tokens) e
[src/components/brand/Wordmark.tsx](src/components/brand/Wordmark.tsx) (o componente do logotipo).
Nenhum outro componente referencia cor ou fonte diretamente.

## Editar as perguntas

Cada formulário em [src/data/forms/](src/data/forms/) é a fonte da verdade. Cada pergunta declara `type`,
`required`, `options`, `maxSelections` e uma condicional opcional `showIf`. O componente de
entrada é escolhido automaticamente:

| Tipo | Componente |
|---|---|
| `shortText`, `email`, `phone`, `url`, `number` | campo de linha única, com máscara no telefone |
| `longText` | textarea que cresce com o conteúdo |
| `radioCards` | cartões com atalho de teclado A–Z e avanço automático |
| `checkboxGrid` | chips (até 8 opções) |
| `multiSelect` | lista suspensa com busca sem acento, chips e contador (9+ opções) |
| `file` | arrastar e soltar + campo de link |

Ao adicionar uma pergunta, o `id` vira a chave dela dentro de `respostas` no webhook — evite
renomear ids já em produção.

## Arquitetura

```
src/
├── app/            rotas, metadata, imagem OG e as duas rotas de API
├── components/
│   ├── brand/      wordmark
│   ├── fields/     um componente por tipo de campo
│   ├── flow/       progresso, abertura de seção, pergunta, revisão, sucesso
│   └── ui/         botão, mensagem de erro, dica de teclado
├── config/         identidade da marca
├── data/           as 109 perguntas
├── hooks/          fluxo, foco automático
├── lib/            validação, passos, armazenamento, montagem do payload
├── styles/         tokens de tema
└── types/          modelo do briefing
```

## Navegação por teclado

| Tecla | Ação |
|---|---|
| `Enter` | avança (nos textos longos, quebra linha) |
| `Ctrl`/`Cmd` + `Enter` | avança a partir de um texto longo |
| `Esc` | volta uma tela |
| `A`–`Z` | seleciona a opção correspondente nas escolhas únicas |
| `↑` `↓` | percorre as opções na lista suspensa |

## Persistência

As respostas ficam em `localStorage`, numa chave por formulário, salvas 400 ms após cada alteração.
Ao reabrir com um rascunho, a aplicação oferece continuar ou recomeçar. A chave só é apagada
depois que o webhook confirma o recebimento — uma falha de envio nunca perde o preenchimento.

## Deploy na Vercel

1. Importe o repositório na Vercel (o preset Next.js é detectado sozinho).
2. Em **Settings → Environment Variables**, adicione `WEBHOOK_URL`.
3. Para uploads: **Storage → Blob → Connect**, o que injeta `BLOB_READ_WRITE_TOKEN` automaticamente.
4. Deploy.

Nenhuma configuração experimental é usada e não há dependência de plataforma além do Vercel Blob,
que é opcional.

## Scripts

```bash
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run start    # servir o build
npm run lint     # ESLint
```
