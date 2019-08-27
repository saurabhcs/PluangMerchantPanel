# build environment
FROM node:10-alpine as build
WORKDIR /merchant-panel
COPY package.json package-lock.json /merchant-panel/
RUN npm ci
COPY . /merchant-panel
ARG ENVIRONMENT=production
ENV ENVIRONMENT=${ENVIRONMENT}
RUN npm run build:${ENVIRONMENT}

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /merchant-panel/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
