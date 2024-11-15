FROM node:18

WORKDIR /usr/src/app

#Copio el package.json y package-lock.json al contenedor

COPY package*.json ./

#Instalo las dependencias necesarias

RUN npm install

#Copio el código fuente de la aplicación

COPY . .

#Expongo el puerto 3000

EXPOSE 3000

#Inicio la aplicación

CMD ["npm", "run", "start"]

