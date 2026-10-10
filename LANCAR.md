# Lançar o Oceanum como site e app

Esta pasta é o Oceanum completo, pronto a pôr online. Não precisa de servidor nem de programação, só de um alojamento de sites estáticos (gratuito).

## 1. Pôr o site online (5 minutos, grátis)

Usa o **Cloudflare Pages**. Aceita o `.zip` tal como está, por isso dá para fazer no computador ou no próprio iPhone.

1. Abre **dash.cloudflare.com** e cria uma conta gratuita (só pede email e palavra-passe).
2. No menu: **Workers e Pages** (em *Compute*) → **Criar** → separador **Pages** → **Carregar recursos** (*Upload assets*).
3. Dá um nome ao projeto, por exemplo `oceanum-ryan` → **Criar projeto**.
4. Escolhe o ficheiro **oceanum-site.zip** (ou arrasta-o) → **Implementar site** (*Deploy site*).
5. Em menos de um minuto fica online em **`https://oceanum-ryan.pages.dev`**.

Para atualizar mais tarde: abre o projeto → **Criar nova implementação** → carrega o zip novo.

Alternativas que também funcionam com este pacote: GitHub Pages, Vercel ou Netlify.

## 2. Instalar no telemóvel como app

- **iPhone (Safari):** abre o teu endereço → Partilhar → **Adicionar ao ecrã principal**. Fica com ícone próprio, abre em ecrã inteiro e funciona sem internet.
- **Android (Chrome):** menu ⋮ → **Instalar app**. Se carregares no ícone sem largar, aparecem atalhos: *Gasto rápido*, *Registar refeição* e *Dominus*.

**Gasto rápido no Centro de Controlo (iPhone):** na app Atalhos, cria um atalho com a ação **Abrir URL** e o endereço `https://oceanum-ryan.pages.dev/#gasto`. Depois, no Centro de Controlo: **+** → *Adicionar controlo* → **Atalhos** → escolhe esse atalho.

## 3. Sincronizar entre telemóvel e computador (opcional, grátis)

Sem este passo, os dados ficam guardados **só no dispositivo** onde os registas. Para ter os mesmos dados em todo o lado, liga uma base de dados Firebase:

1. Abre **console.firebase.google.com** → **Adicionar projeto** → nome `oceanum` (podes desligar o Analytics).
2. **Build → Authentication → Começar → Google → Ativar** → Guardar.
3. Ainda em Authentication: **Settings → Domínios autorizados → Adicionar domínio** → o teu `oceanum-ryan.pages.dev`.
4. **Build → Firestore Database → Criar base de dados** → modo de produção → região `europe-west` (ou a mais próxima de ti).
5. No Firestore, separador **Regras**: apaga tudo, cola o conteúdo de `firestore.rules`, troca `O-TEU-EMAIL@gmail.com` pelo teu email Google → **Publicar**.
6. **⚙ Definições do projeto → As tuas apps → ícone `</>` (Web)** → dá-lhe um nome → Registar. Aparece um bloco `firebaseConfig`.
7. Descompacta o zip, abre `config.js` num editor de texto e substitui a última linha por:
   ```js
   window.OCEANUM_FIREBASE = {
     apiKey: "…", authDomain: "…", projectId: "…", appId: "…",
     allowedEmail: "o-teu-email@gmail.com"
   };
   ```
   (copia os quatro valores do `firebaseConfig`).
8. Volta a compactar a pasta (com os ficheiros na raiz do zip) e carrega-a no Cloudflare: **Criar nova implementação**.
9. No Oceanum: **Definições → Sincronização na nuvem → Entrar com Google**. Faz isto em cada dispositivo.

As regras do passo 5 garantem que só a tua conta Google consegue ler ou escrever os dados.

### Se o login falhar no iPhone

O Safari bloqueia por vezes o login Google quando o site e o Firebase estão em domínios diferentes. Primeiro tenta entrar no Safari normal; se funcionar aí mas não na app instalada, a solução definitiva é alojar o site no próprio **Firebase Hosting** (mesmo domínio que o login). Isso faz-se num computador com o Firebase CLI: `npm i -g firebase-tools`, `firebase login`, `firebase init hosting` (pasta pública: a pasta do Oceanum) e `firebase deploy`. Depois muda `authDomain` no `config.js` para `oceanum-xxxx.web.app` e usa esse endereço.

## 4. Trazer os teus dados do claude.ai

1. Na versão do claude.ai: **Definições → Dados → Exportar** (guarda um `.json`).
2. No site novo: **Definições → Dados → Importar** e escolhe esse ficheiro.

Se já tiveres ligado a nuvem, a importação sincroniza sozinha para os outros dispositivos.

## O que muda fora do claude.ai

- **Google Calendar:** a leitura automática da agenda só funciona dentro do claude.ai. O resto da agenda (compromissos, aulas, turnos) funciona igual.
- **Código de acesso e Face ID:** funcionam igual. O Face ID tem de ser ativado outra vez no site novo (Definições).
- **Sem internet:** abre e regista na mesma; sincroniza quando voltar a ligação.
