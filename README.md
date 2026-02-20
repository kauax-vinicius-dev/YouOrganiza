# YouOrganiza 💻

Sistema completo para gestão de estoque, máquinas e processos de retirada, desenvolvido para otimizar o controle operacional de empresas e equipes técnicas.

## Visão Geral 🗂️
O YouOrganiza é uma solução web robusta que integra controle de inventário, administração de máquinas, registro de retiradas e trocas, além de um painel administrativo seguro. O sistema foi projetado para ser intuitivo, seguro e escalável, atendendo tanto usuários comuns quanto administradores.

## Principais Funcionalidades ✨
- **🔒 Autenticação segura** com JWT e controle de sessão
- **📦 Gestão de estoque**: cadastro, atualização, retirada e exclusão de itens
- **🖥️ Administração de máquinas**: registro, atualização, troca e exclusão
- **🛠️ Painel administrativo**: gerenciamento avançado de usuários, permissões e notificações
- **🛡️ Controle de permissões**: acesso restrito por perfil (admin/usuário)
- **🔔 Notificações inteligentes** e preferências customizáveis
- **💬 Mensagens centralizadas** para fácil manutenção e tradução
- **⚡ Carregamento dinâmico** de componentes pesados (lazy loading)
- **🎯 Feedback visual**: spinners, skeletons e estados vazios padronizados

## Tecnologias Utilizadas 🧑‍💻
- **Frontend:** Next.js (React, TypeScript), TailwindCSS, ESLint, Prettier
- **Backend:** Node.js, Express, MongoDB
- **Autenticação:** JWT (usuário e admin)
- **Gráficos:** Recharts (importação dinâmica)
- **Notificações:** Toasts (sonner)

## Estrutura do Projeto 🏗️
```
YouOrganiza/
├── backend/
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── ...
├── frontend/
│   ├── src/
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   └── ...
└── README.md
```

## Como Executar ▶️
### Backend
1. Instale as dependências:
   ```bash
   cd backend
   npm install
   ```
2. Configure as variáveis de ambiente (`.env`)
3. Inicie o servidor:
   ```bash
   npm run dev
   ```

### Frontend
1. Instale as dependências:
   ```bash
   cd frontend
   npm install
   ```
2. Inicie o frontend:
   ```bash
   npm run dev
   ```

Acesse o sistema em [http://localhost:3000](http://localhost:3000) 🌐

## Segurança 🔐
- Todas as rotas sensíveis são protegidas por autenticação JWT.
- Rotas administrativas exigem permissão de administrador.
- Tokens e permissões são validados tanto no frontend quanto no backend.

## Licença 📄
MIT