<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Briefing Studio — RUBI Agência

Aplicação de briefing de identidade visual. O cliente responde **uma pergunta por tela**, estilo
Typeform; ao final as respostas são arquivadas e ficam num painel interno, com exportação em PDF.

**Escreva código e comentários em português.** Comentários explicam *por quê*, não *o quê* — o
código já diz o que faz.

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · motion · zod ·
@vercel/blob. Sem biblioteca de formulário e sem UI kit — decisão de projeto, não omissão.

---

## Onde as coisas estão

```
src/
├── app/
│   ├── page.tsx                 abertura, com o texto institucional do briefing
│   ├── briefing/page.tsx        o fluxo
│   ├── admin/
│   │   ├── login/page.tsx       público
│   │   └── (protected)/         exige sessão: lista, detalhe e impressão
│   ├── api/submit/route.ts      arquiva e (opcionalmente) encaminha ao webhook
│   ├── api/upload/route.ts      emite token de upload do Vercel Blob
│   └── opengraph-image.tsx      imagem de compartilhamento
├── components/
│   ├── brand/Wordmark.tsx       logotipo e símbolo
│   ├── fields/                  um componente por tipo de campo
│   ├── flow/                    progresso, seção, pergunta, revisão, sucesso, retomada
│   ├── admin/                   visualização do briefing e botão de impressão
│   └── ui/                      botão, mensagem de erro, dica de teclado
├── config/brand.ts              ★ identidade: nome, textos, hexadecimais
├── data/forms.ts                ★ registro dos formulários
├── data/forms/                  ★ um arquivo por formulário — fonte da verdade
├── hooks/useBriefingFlow.ts     todo o estado do fluxo
├── lib/                         validação, passos, armazenamento, payload, sessão
├── styles/theme.css             ★ tokens de cor, tipografia e easing
└── types/briefing.ts            modelo de dados
```

---

## Invariantes — quebrar isso causa dano real

**Os `id` das perguntas são chaves públicas.** Aparecem no JSON enviado ao webhook e nos
briefings já arquivados. Renomear um `id` órfã as respostas antigas e quebra integrações.
Adicionar e remover perguntas é seguro; renomear não é.

**Nenhum componente referencia cor ou fonte diretamente.** Tudo vem dos tokens de
`styles/theme.css` (`bg-ink`, `text-paper`, `text-accent`…). `config/brand.ts` duplica os
hexadecimais **apenas** porque a imagem de Open Graph roda fora do Tailwind — mudou um, mude o
outro.

**O payload é montado no servidor**, em `lib/payload.ts`, a partir da definição do formulário. O
navegador envia só o slug e as respostas cruas.

**O briefing é arquivado antes de chamar o webhook.** O envio só falha se nada for guardado —
sem Blob **e** sem webhook. Perder mais de cem respostas por uma integração fora do ar é pior
que qualquer outra falha aqui.

**Perguntas ocultas por condicional não entram no payload.**

---

## Vários formulários

A aplicação serve mais de um questionário. Cada um é um `BriefingForm` em `data/forms/`,
registrado em `data/forms.ts`, com suas próprias perguntas, textos, rotas e chave de rascunho.
Hoje são dois: identidade visual (109 perguntas) e onboarding de marketing (286).

**O identidade visual mantém `/` e `/briefing`** porque esses links já foram enviados a clientes.
Os demais vivem em `/[slug]` e `/[slug]/responder`. O registro valida no carregamento que os
caminhos derivam do slug — uma divergência geraria um link para 404 sem erro de compilação.

**O fluxo recebe o slug, não o formulário.** As perguntas carregam funções `showIf`, e funções
não atravessam a fronteira Server → Client Component; o registro é resolvido dentro do cliente.

Briefings arquivados antes disso não têm `formulario` no JSON — `resolveForm` devolve o padrão.

---

## Modelo das perguntas

Cada arquivo em `data/forms/` transcreve um documento oficial da agência.

```ts
{
  id: 'marca_nome',          // chave estável — ver invariantes
  section: 2,
  label: 'Qual é o nome da sua marca?',
  helper: 'Escreva exatamente como deseja que ele seja apresentado.',
  type: 'shortText',
  required: true,
  options: [...],            // quando houver alternativas
  maxSelections: 5,          // "escolha até 5"
  otherOption: 'Outro',      // revela campo de texto; deve constar em `options`
  showIf: (a) => ...,        // condicional
}
```

O componente vem do `type`, via `components/fields/FieldRenderer.tsx`:

| `type` | Componente | Quando usar |
|---|---|---|
| `shortText` `email` `phone` `url` `number` | `TextField` | resposta de uma linha |
| `longText` | `LongTextField` | texto que cresce; `Ctrl+Enter` avança |
| `radioCards` | `RadioCards` | escolha única; atalhos A–Z; avança sozinho |
| `checkboxGrid` | `CheckboxGrid` | múltipla, até 8 opções |
| `multiSelect` | `MultiSelectField` | múltipla, 9+ opções: busca sem acento, chips, contador |
| `file` | `FileField` | upload + campo de link alternativo |

Respostas de "Outro" ficam sob `<id>__outro` e viram `"Outro: texto"` no payload.

---

## Fluxo — `hooks/useBriefingFlow.ts`

A lista de passos é derivada das respostas (`lib/steps.ts`): abertura de seção, perguntas
visíveis e uma tela final de revisão. A posição é guardada por **id do passo**, não por índice —
condicionais mudam o tamanho da lista.

**A navegação lê o estado por referência (`answersRef`, `stepsRef`, `stepIdRef`), não pelo
closure da renderização.** O avanço automático das escolhas únicas dispara 380 ms após o clique;
até lá a resposta já entrou e condicionais podem ter revelado passos novos. Validar contra o
closure antigo acusava "obrigatória" numa pergunta respondida e pulava telas recém-abertas.

Rascunho em `localStorage`, numa chave por formulário (`storageKey`), gravado 400 ms após cada alteração e apagado só
depois do envio confirmado.

---

## Armazenamento — `lib/submissions.ts`

Cada briefing vira um JSON privado no Vercel Blob (`briefings/<id>.json`).

**A Vercel autentica o Blob de duas formas** e a checagem aceita as duas:

- `BLOB_READ_WRITE_TOKEN` — modelo antigo
- **OIDC**: `VERCEL_OIDC_TOKEN` + `BLOB_STORE_ID` — padrão atual ao conectar um store

`put`, `get` e `list` funcionam nos dois. **Só `handleUpload`** (upload direto do navegador, em
`api/upload`) exige o token de leitura/escrita, porque emite credencial para o cliente. Sem ele,
o campo de arquivo degrada para somente-link — intencional.

Em desenvolvimento, sem Blob, os briefings caem em `.briefings/`. Para usar esse modo com
`next start`, defina `BRIEFINGS_LOCAL=1`. **O caminho é fixo de propósito**: montá-lo
dinamicamente faz o Turbopack rastrear o projeto inteiro para dentro da função serverless.

---

## Painel interno

Sessão por cookie `HttpOnly` assinado com HMAC via **Web Crypto** (`lib/adminAuth.ts`) — não
`node:crypto`, para funcionar igual em Node e Edge. Comparação em tempo constante, validade de
7 dias, fator único (`ADMIN_PASSWORD`).

Proteção pelo layout `admin/(protected)/layout.tsx`. O id vindo da URL é validado contra
`/^[a-z0-9-]+$/i` antes de virar caminho de arquivo.

A exportação em PDF é a **impressão do navegador** sobre uma página desenhada para isso, em
preto sobre branco. Não há biblioteca de PDF.

---

## Armadilhas já encontradas

**O dev server do Next não hidrata em Chrome headless.** A página renderiza mas o React não
anexa. Testes de navegador precisam rodar contra `npm run build && npm start`.

**Ler arquivo com `process.cwd()` dentro de rotas** faz o Turbopack rastrear o projeto todo. Use
caminho estático, ou `new URL('./arquivo', import.meta.url)` como em `opengraph-image.tsx`.
`fetch()` não abre URL `file:` no Node — use `readFileSync`.

**ESLint trata qualquer função `useAlgo` como React Hook.** Um helper chamado `useLocalFiles`
gerou erro de rules-of-hooks; virou `writesToDisk`.

**As regras do React Compiler são exigentes:** nada de `setState` síncrono em efeito nem escrita
em ref durante a renderização. A leitura do `localStorage` na montagem tem um `eslint-disable`
justificado — é a exceção.

**Variável de ambiente nova exige Redeploy na Vercel.**

---

## Como verificar

```bash
npm run dev
npm run build                      # precisa terminar SEM avisos
npx tsc --noEmit
npx eslint src --max-warnings 0
```

Para exercitar o painel sem Vercel:

```bash
npm run build
ADMIN_PASSWORD=teste BRIEFINGS_LOCAL=1 npx next start -p 3000
```

Ao mexer no fluxo, **percorra o formulário inteiro até a tela de sucesso** — a maioria dos
defeitos aparece só no percurso completo. Ao mexer em layout, verifique **320px, 390px e 430px**:
a maioria dos clientes responde pelo celular. Alvos de toque têm no mínimo 44px e nada pode
estourar a largura.
