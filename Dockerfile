#Docker images được kế thừa từ 1 image khác có sẵn
FROM node:20-alpine3.16

#Thư mục làm việc mặc định trong image docker => thích đặt tên gì cũng đc

WORKDIR /app

#copy các file config  from host to image vào thư mục hiện tại của docker /app
COPY  package.json .
COPY  package-lock.json .
COPY  tsconfig.json .
COPY .env .
COPY ./src ./src
COPY . .

# Run comand in the image

RUN npm install  
RUN npm run build

#RUN inside a container

EXPOSE 4000 

CMD [ "npm", "run", "dev"]
