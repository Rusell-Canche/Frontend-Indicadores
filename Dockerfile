# Usa una imagen base con Node.js
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de gestión de paquetes primero (para aprovechar caché de capas)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto que usa Vite por defecto
EXPOSE 5173

# Inicia el servidor de desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
