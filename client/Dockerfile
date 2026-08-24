# 1-bosqich: Loyihani yig'ish (Build)
FROM node:20-alpine AS build

WORKDIR /app

# Bog'liqliklar ro'yxatini ko'chirib o'tkazish
COPY package*.json ./

# Kutubxonalarni o'rnatish
RUN npm install

# Barcha kodlarni loyihaga nusxalash
COPY . .

# Vite orqali loyihani ishlab chiqarish (dist) uchun yig'ish
RUN npm run build

# 2-bosqich: Nginx serverida ishga tushirish
FROM nginx:1.25-alpine

# Maxsus Nginx konfigini serverga nusxalash
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 1-bosqichda hosil bo'lgan static fayllarni Nginx papkasiga nusxalash
COPY --from=build /app/dist /usr/share/nginx/html

# Frontend portini ochish
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
