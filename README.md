# ECommerceStats

Este projeto é uma API para um sistema de e-commerce, desenvolvida usando Node.js, PostgreSQL e Postman para documentação, seguindo a arquitetura MVC. A API possui funcionalidades de consulta, adição, atualização e deleção de produtos, pedidos e usuários, além de um sistema de cache.

## Funcionalidades

- **Produtos:**
  - Adicionar, consultar, atualizar e deletar produtos.
- **Pedidos:**
  - Adicionar, consultar, atualizar e deletar pedidos.
- **Usuários:**
  - Adicionar, consultar, atualizar e deletar usuários.
- **Cache:**
  - Implementação de cache para melhorar o desempenho.

## Tecnologias Utilizadas
- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **Express.js**: Framework web para Node.js, utilizado para construir a API.
- **PostgreSQL**: Banco de dados relacional para armazenar dados do e-commerce.
- **Sequelize**: ORM (Object-Relational Mapping) para interagir com o banco de dados.
- **Postman**: Ferramenta para documentação e testes de API.
- **NodeCache**: Biblioteca para caching em memória.
- **Multer**: Middleware para manipulação de uploads de arquivos.
- **JWT (JSON Web Token)**: Tecnologia para autenticação e autorização.
- **Express-validator**: Biblioteca para validação de dados de entrada.
- **Helmet**: Middleware para segurança de aplicações Express.
- **Rate Limit**: Middleware para limitar a taxa de requisições.
- **XSS-Clean**: Middleware para limpar entradas de usuários de ataques XSS.
- **Express-Mongo-Sanitize**: Middleware para prevenir injeções NoSQL.

## Uso
- **Postman:**
  - Utilize o Postman para testar os endpoints da API.
- **Documentação:**
  - A documentação dos endpoints está disponível no arquivo Api postman.postman_collection.
- **Bando de dados:**
  - Faça a instalação do banco de dados que está no arquivo Banco de dados.sql.
- **.env**
  - Crie um arquivo .env com esse layout e preencha com suas variavéis 
  ```bash
  PORT=
  DB_HOST=
  DB_USER=postgres
  DB_PASS=
  DB_NAME=
  JWT_SECRET=
  ```
- **Uploads**
  - Crie uma pasta chamada uploads.

## Instalação

1 - Clone o repositório

```bash
git clone https://github.com/seu-usuario/ECommerceStats.git
cd ECommerceStats
```
2 - Instale as dependências

```bash
npm install
```

3 - Configure as variáveis de ambiente, conecte o banco de dados ao projeto utilizando suas variáveis

```bash
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASS=
DB_NAME=
JWT_SECRET=
```

4- Inicie o Servidor

```bash
npm start
```

## Estrutura do Projeto

```bash
.
├── controllers
│   ├── orderController.js
│   ├── productController.js
│   └── userController.js
├── middlewares
│   ├── authMiddlewares.js
│   ├── cacheMiddleware.js
│   ├── securityMiddleware.js
│   └── uploadMiddleware.js
├── models
│   ├── orderModel.js
│   ├── productModel.js
│   └── userModel.js
├── routes
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
├── tests
│   ├── order.test.js
│   ├── product.test.js
│   └── userModel.test.js
├── utils
│   ├── cache.js
│   ├── db.js
│   ├── token.js
│   └── generateToken.js
├── app.js
├── generateToken.js
├── package-lock.json
├── package.json
└── server.js
```
