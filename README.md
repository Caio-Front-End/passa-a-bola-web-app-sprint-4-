# App Passa a Bola ⚽

**Bem-vinda ao App do Passa a Bola, uma aplicação web moderna desenhada para conectar e empoderar atletas de futebol feminino. A plataforma centraliza informações sobre jogos, campeonatos e permite a interação social através de um feed de vídeos, similar ao TikTok, focado em jogadas e treinos.**

[🔗 Acesse a aplicação online](https://passa-a-bola-web-app-sprint-4.vercel.app/)

---

## ✨ Features Implementadas

A versão atual do projeto é um aplicativo full-stack robusto, com o Firebase servindo como backend para dados em tempo real, autenticação e armazenamento de arquivos.

### 1. Autenticação e Perfil de Atleta
- **Autenticação Completa:** Sistema de Login e Registro de usuárias conectado ao **Firebase Auth**.
- **Perfil Editável:** As atletas podem atualizar suas informações de perfil (nome, apelido, posição, time, etc.) e **fazer upload de uma foto de perfil** para o **Firebase Storage**.
- **Perfis Públicos:** Capacidade de visitar e visualizar o perfil de outras jogadoras (funcionalidade adicionada em `App.jsx`).

### 2. Dashboard (Hub) Dinâmico
- **Visão Central:** O Hub agora é 100% dinâmico, buscando dados do Firestore em tempo real.
- **Agenda de Jogos:** Um componente de calendário (`AgendaCalendario`) que exibe os próximos jogos baseados nos campeonatos em que a usuária está inscrita.
- **Gerenciamento de Campeonatos:** Abas para "Participando" e "Criados", permitindo à usuária **sair** de um campeonato ou **excluir** um campeonato que ela criou.

### 3. Central de Campeonatos (CRUD Completo)
- **Criar Campeonatos:** Um modal de múltiplos passos (`CreateChampionshipModal`) permite que qualquer usuária crie seu próprio campeonato, salvando-o no Firestore.
- **Busca de CEP:** Integração com a API **ViaCEP** para preencher automaticamente os dados de endereço ao criar um campeonato.
- **Listagem Real-time:** A página de campeonatos busca e exibe todos os eventos do Firestore em tempo real (`onSnapshot`) e permite **filtragem avançada** (por ID, cidade, modalidade).
- **Inscrição e Times:** Usuárias podem se inscrever em campeonatos (públicos ou privados com senha) e, se a formação for manual, escolher seu time.
- **Gerenciamento de Inscritas:** A organizadora pode abrir um modal (`ManagementModal`) para ver todas as atletas inscritas em seu evento.

### 4. Feed de Vídeos (FINTA) com Firebase
- **Upload de Vídeos:** A funcionalidade de "Próximos Passos" foi **concluída**. Usuárias podem fazer upload de vídeos (da galeria ou gravando na hora) para o **Firebase Storage**.
- **Feed de Firestore:** O feed "FINTA" busca os vídeos diretamente do Firestore, ordenados por data.
- **Interação Real-time:** O sistema de **likes** e **comentários** (`CommentSection`) está 100% funcional e atualiza em tempo real para todos os usuários usando `onSnapshot`.
- **Gerenciamento de Conteúdo:** A usuária pode **excluir** seus próprios vídeos do feed (removendo o arquivo do Storage e o documento do Firestore).
- **Cross-linking:** Vídeos podem ser "anexados" a um campeonato (via ID), e posts no feed linkam para o perfil da atleta que postou.

### 5. Estatísticas e Desempenho
- **Registro de Partidas:** Na página de perfil, a atleta pode **adicionar manualmente o resultado de suas partidas** (`AddMatchModal`) para acompanhar seu desempenho.
- **Visualização de Dados:** O perfil conta com um `StatsDashboard` que calcula estatísticas (vitórias, gols, etc.) e um **gráfico de radar** (`PlayerRadarChart`) para exibir as habilidades da jogadora.

### 6. UX (User Experience)
- **Animações:** O projeto utiliza **Framer Motion** para transições de página suaves e animações de entrada em modais e toasts.
- **Navegação Mobile por Gestos:** Nas páginas principais, é possível **deslizar (swipe)** para navegar entre as abas (Hub, Campeonatos, FINTA, Perfil), usando `react-swipeable`.
- **Tela de Introdução:** Uma tela de introdução (`IntroScreen`) é exibida para novas usuárias na primeira vez que acessam o app (controlado via `localStorage`).
- **Notificações (Toast):** Um `ToastContext` customizado exibe uma notificação de sucesso animada após ações importantes (ex: salvar perfil, criar campeonato).

---

## 🤖 ChatBot - Tonha Ai
A alma da assistente "Tonha" reside em sua integração com tecnologias de IA de ponta e em uma configuração segura para acesso à API.

- **Modelo de IA**: O chatbot é potencializado pelo Google Gemini 2.5 Flash, um modelo de linguagem rápido e eficiente. Ele é o responsável por processar as perguntas e gerar as respostas com a personalidade da "Tonha", focada no universo do futebol feminino.
- **Contexto e Buscas em Tempo Real**:
  - **Manutenção de Contexto**: A cada nova mensagem, todo o histórico do chat é enviado para a IA. Isso permite que ela se "lembre" do que foi dito antes.
  - **Busca em Tempo Real**: A assistente foi configurada para realizar buscas no Google em tempo real para fornecer dados atualizados.
- **Ponto de Acesso à API** (Vercel): A chave de acesso para a API do Gemini (`VITE_GEMINI_API_KEY`) é gerenciada como uma Variável de Ambiente diretamente na plataforma da Vercel para maior segurança.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias de ponta do ecossistema JavaScript:

- **React:** Biblioteca principal para a construção da interface de usuário.
- **Vite:** Ferramenta de build moderna e ultrarrápida.
- **Firebase (v12):** Utilizado como Backend-as-a-Service (BaaS) para:
  - **Authentication:** Gerenciamento de login e registro.
  - **Firestore:** Banco de dados NoSQL em tempo real.
  - **Storage:** Armazenamento de arquivos (vídeos e fotos de perfil).
- **React Router DOM:** Para gerenciamento de rotas e navegação.
- **Tailwind CSS:** Framework CSS utility-first para estilização rápida e responsiva.
- **Framer Motion:** Para animações e transições de UI complexas.
- **Recharts:** Para a criação de gráficos de estatísticas (Gráfico Radar).
- **Lucide React:** Pacote de ícones SVG.
- **Context API + Hooks:** Para gerenciamento de estado global (Autenticação, Toast).
- **date-fns:** Biblioteca para manipulação e formatação de datas.
- **React Swipeable:** Para habilitar a navegação por gestos (swipe) no mobile.

---

## ⚙️ Como Executar o Projeto

Para rodar este projeto localmente, siga os passos abaixo:

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/Caio-Front-End/passa-a-bola-web-app.git](https://github.com/Caio-Front-End/passa-a-bola-web-app.git)
    ```
2.  **Navegue até a pasta do projeto:**
    ```bash
    cd passa-a-bola-web-app
    ```
3.  **Instale as dependências:**
    ```bash
    npm install
    ```
4.  **Configure o Firebase:**
    - Crie um projeto no [Firebase](https://firebase.google.com/).
    - Habilite **Authentication** (Email/Senha), **Firestore** e **Storage**.
    - Copie suas credenciais de configuração e cole-as no arquivo `/src/firebase.js`.
5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
6.  **Abra no navegador:**
    `A aplicação estará disponível em http://localhost:5173 (ou na porta indicada no seu terminal).`

---

## 📂 Estrutura do Projeto

A estrutura de pastas foi organizada para promover a escalabilidade e a manutenção do código:

```plaintext
/src
├── /assets       # Imagens, vídeos e fontes
├── /components   # Componentes reutilizáveis (NavBar, Modais, Calendário, etc.)
├── /contexts     # Context API para estado global (AuthContext, ToastContext)
├── /data         # Mocks de dados estáticos (ex: jogoData, mockStats)
├── /hooks        # Hooks customizados (useAuth, useToast)
├── /pages        # Componentes que representam as páginas da aplicação
├── App.css       # Estilos globais
├── App.jsx       # Configuração principal das rotas
├── firebase.js   # Configuração e inicialização do Firebase
└── main.jsx      # Ponto de entrada da aplicação React

---

## 👨‍💻 Desenvolvedores

| Nome                           | Rede Social                                                                | RM's   |
| ------------------------------ | -------------------------------------------------------------------------- | ------ |
| Caio Nascimento Battista       | [LinkedIn](https://www.linkedin.com/in/cnbtt/)                             | 561383 |
| Manoah Leão                    | [LinkedIn](https://www.linkedin.com/in/manoah-le%C3%A3o-735a83346/)        | 563713 |
| Matheus Rodrigues              | [LinkedIn](https://www.linkedin.com/in/matheus-rodrigues-rocha-496921278/) | 561689 |
| Lucas Cavalcante               | [LinkedIn](https://www.linkedin.com/in/lucas-cavalcante-jardim-67a875318/) | 562857 |
