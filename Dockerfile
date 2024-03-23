#Docker images được kế thừa từ 1 image khác có sẵn
FROM node:latest
ENV NODE_ENV=.env.development

#Thư mục làm việc mặc định trong image docker => thích đặt tên gì cũng đc

WORKDIR /app

#copy các file confic  from host to image vào thư mục hiện tại của docker /app
COPY  ["package.json","package-lock.json","tsconfig.json","./"]
COPY .env.development .
COPY . .

# Run comand in the image
 
RUN npm install
RUN npm run build

#RUN inside a container


EXPOSE 3000 

CMD ["npm", "run", "dev"]
