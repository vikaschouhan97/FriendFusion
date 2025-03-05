# Use official Node.js image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Use Nginx to serve static files
FROM nginx:alpine
COPY build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
