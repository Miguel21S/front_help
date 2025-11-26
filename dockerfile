FROM node:22.12.0

WORKDIR /app

# Copiar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del proyecto
COPY . .

EXPOSE 5173

# Para permitir acceso desde el host
CMD ["npm", "run", "dev", "--", "--host"]

