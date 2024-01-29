ARG NGINX_RELEASE
ARG NODE_RELEASE
ARG DOMAIN_URL
ARG API_PORT

FROM node:${NODE_RELEASE} as build
ARG DEBIAN_FRONTEND=noninteractive
USER root
COPY .. /home/node/front
WORKDIR /home/node/front
RUN yarn
RUN yarn dist
RUN export DOLLAR="$" && envsubst < /home/node/front/docker-deploy/nginx/nginx.conf > /home/node/front/docker-deploy/nginx/_nginx-substituted.conf

FROM nginx:${NGINX_RELEASE}
COPY --from=build /home/node/front/dist /frontend-dist
COPY docker-deploy/nginx/nginx.conf /etc/nginx/nginx-not-substituted.conf
COPY docker-deploy/nginx/_nginx-substituted.conf /etc/nginx/nginx.conf
