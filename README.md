# App Passa a Bola ⚽

**Bem-vinda ao App do Passa a Bola, uma aplicação web moderna desenhada para conectar e empoderar atletas de futebol feminino. A plataforma centraliza informações sobre jogos, campeonatos e permite a interação social através de um feed de vídeos, similar ao TikTok, focado em jogadas e treinos.**

[🔗 Acesse a aplicação online](https://passa-a-bola-web-app.vercel.app)

---

## ✨ Features

- **Autenticação Segura:** Sistema completo de login e registro de usuárias.

- **Hub Centralizado:** Uma página de perfil onde a atleta pode visualizar suas estatísticas, próximos jogos e o progresso em campeonatos.

- **Central de Quadras:** Encontre campeonatos próximos em um mapa interativo e veja detalhes sobre locais, datas e formatos de jogo.

- **Feed de Vídeos (FINTA):** Uma experiência de feed vertical, otimizada para mobile, onde as atletas podem compartilhar vídeos de suas jogadas, com funcionalidades de like, comentário e compartilhamento.

- **Design Responsivo:** Interface totalmente adaptável para uma experiência perfeita tanto em desktops quanto em dispositivos móveis.

---

## 🤖 ChatBot - Tonha Ai
A alma da assistente "Tonha" reside em sua integração com tecnologias de IA de ponta e em uma configuração segura para acesso à API.

- **Modelo de IA**:
O chatbot é potencializado pelo Google Gemini 2.5 Flash, um modelo de linguagem rápido e eficiente. Ele é o responsável por processar as perguntas e gerar as respostas com a personalidade da "Tonha", focada no universo do futebol feminino.

- **Contexto e Buscas em Tempo Real**:
Para que a conversa seja fluida e coerente, a implementação utiliza duas técnicas importantes:

- **Manutenção de Contexto**:
A assistente não lê apenas a última pergunta. A cada nova mensagem, todo o histórico do chat é enviado para a IA. Isso permite que ela se "lembre" do que foi dito antes e forneça respostas que façam sentido na conversa.

- **Busca em Tempo Real**:
Para fornecer dados atualizados sobre jogos recentes, estatísticas ou notícias, a assistente foi configurada para realizar buscas no Google em tempo real. Isso garante que as informações sejam sempre precisas e relevantes.

- **Ponto de Acesso à API** (Vercel):
A segurança é uma prioridade. A chave de acesso para a API do Gemini não está exposta no código-fonte. Ela é gerenciada como uma Variável de Ambiente (Environment Variable) diretamente na plataforma da Vercel.

- **Variável de Ambiente:** VITE_GEMINI_API_KEY:
Dessa forma, o "segredo" de acesso fica protegido no ambiente de hospedagem, e o código-fonte pode ser compartilhado publicamente sem riscos de segurança.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias de ponta do ecossistema JavaScript:

- **React:** Biblioteca principal para a construção da interface de usuário.

- **Vite:** Ferramenta de build moderna e ultrarrápida para o desenvolvimento front-end.

- **React Router DOM:** Para gerenciamento de rotas e navegação na aplicação.

- **Tailwind CSS:** Framework CSS utility-first para estilização rápida e responsiva.

- **Lucide React:** Pacote de ícones SVG, simples e de alta qualidade.

- **Context API + Hooks:** Para gerenciamento de estado global, como a autenticação do usuário.

- **Date-fns:** Biblioteca JavaScript para manipular, formatar e realizar cálculos com datas e horas, oferecendo uma ampla gama de funções utilitárias como adicionar ou subtrair dias, comparar datas, formatá-las em diversos padrões.

---

## ⚙️ Como Executar o Projeto

Para rodar este projeto localmente, siga os passos abaixo:

1. **Clone o Repositório:**

```bash
git clone https://github.com/Caio-Front-End/passa-a-bola-web-app.git
```

2. **Navegue até a pasta do projeto:**

```bash
cd passa-a-bola-web-app
```

3. **Instale as dependências:**

```bash
npm install
```

4. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

---

5. **Abra no navegador:**

```bash
A aplicação estará disponível em http://localhost:5173 (ou na porta indicada no seu terminal).
```

## 📂 Estrutura do Projeto

A estrutura de pastas foi organizada para promover a escalabilidade e a manutenção do código:

```plaintext
/src
├── /components   # Componentes reutilizáveis (NavBar, Layout, VideoPost, etc.)
├── /contexts     # Context API para gerenciamento de estado global (AuthContext)
├── /data         # Mocks de dados estáticos (fintaVideos)
├── /hooks        # Hooks customizados (useAuth)
├── /pages        # Componentes que representam as páginas da aplicação
├── App.css       # Estilos globais
├── App.jsx       # Configuração principal das rotas
└── main.jsx      # Ponto de entrada da aplicação React
```

---

## 🔮 Próximos Passos

- [ ] Conectar a aplicação a um backend real (ex: Firebase, Node.js).

- [ ] Implementar a funcionalidade de upload de vídeos.

- [ ] Adicionar sistema de comentários e notificações em tempo real.

- [ ] Criar testes unitários e de integração para os componentes.

---

## 👨‍💻 Desenvolvedores

| Nome                           | Rede Social                                                                | RM's   |
| ------------------------------ | -------------------------------------------------------------------------- | ------ |
| Caio Nascimento Battista       | [LinkedIn](https://www.linkedin.com/in/cnbtt/)                             | 561383 |
| Manoah Leão                    | [LinkedIn](https://www.linkedin.com/in/manoah-le%C3%A3o-735a83346/)        | 563713 |
| Matheus Rodrigues              | [LinkedIn](https://www.linkedin.com/in/matheus-rodrigues-rocha-496921278/) | 561689 |
| Lucas Cavalcante               | [LinkedIn](https://www.linkedin.com/in/lucas-cavalcante-jardim-67a875318/) | 562857 |



