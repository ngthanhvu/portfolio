# Dockerfile cho môi trưng development của Nuxt 3/4
FROM node:22-alpine

WORKDIR /app

# Copy file cấu hình package trước để tận dụng Docker cache
COPY package*.json ./

# Cài đặt dependencies (bao gồm cả devDependencies)
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Expose port dev mặc định của Nuxt
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000

# Chạy dev server
CMD ["npm", "run", "dev"]
