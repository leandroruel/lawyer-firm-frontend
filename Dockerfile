# Usa a imagem oficial do Node.js
FROM node:22-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do projeto
COPY package.json yarn.lock ./

# Instala apenas as dependências de produção
RUN yarn install --frozen-lockfile

# Copia os arquivos restantes do projeto
COPY . .

# Compila o Next.js (gera os arquivos otimizados para produção)
RUN yarn build

# Expõe a porta usada pelo Next.js
EXPOSE 3001

# Comando para rodar a aplicação Next.js no modo de produção
CMD ["yarn", "start"]
