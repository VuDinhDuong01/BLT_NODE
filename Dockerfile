# Sử dụng image chứa Node.js
FROM node:20-alpine3.16

# Đặt thư mục làm việc mặc định trong container
WORKDIR /app

# Copy package.json và package-lock.json vào thư mục làm việc
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY nodemon.json .

# Cài đặt dependencies của ứng dụng
RUN npm install
RUN npm run  build

COPY . .
COPY .env .

# Port mà ứng dụng sẽ lắng nghe
EXPOSE 4000

# Lệnh để chạy ứng dụng khi container được khởi động
CMD ["npm", "run", "dev"]
