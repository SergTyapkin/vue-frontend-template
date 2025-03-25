ARG NGINX_RELEASE
ARG NODE_RELEASE

FROM node:${NODE_RELEASE:-22} as build
ARG DEBIAN_FRONTEND=noninteractive
USER root

# copy project to workdir
COPY .. /home/node/front
WORKDIR /home/node/front

#install anything you want
#RUN apt-get update -y && apt-get install --no-install-recommends -y \
#   anything-you-want

# build project - create static dist files
RUN yarn
RUN yarn build

# Finally - get only needed files from previous build stage. Static files + config
FROM nginx:${NGINX_RELEASE:-1.27-alpine-slim}

#install nginx modules
#RUN apt-get update -y && apt-get install  --no-install-recommends -y \
#   nginx-plus-module-brotli

COPY --from=build /home/node/front/dist /frontend-dist
COPY --from=build /home/node/front/docker-deploy/nginx/templates /etc/nginx/templates
COPY --from=build /home/node/front/docker-deploy/nginx/nginx.conf /etc/nginx/nginx.conf

# generate config for http or https to nginx
ARG HTTP_NGINX_CONFIG
ARG HTTPS_NGINX_CONFIG

# substitute ${HTTP_NGINX_CONFIG} and ${HTTPS_NGINX_CONFIG} into default.conf.template
RUN if [ -z "${HTTP_NGINX_CONFIG}" ] && [ -z "${HTTPS_NGINX_CONFIG}" ]; then \
      echo "HTTP_NGINX_CONFIG or HTTPS_NGINX_CONFIG must be set. Unknown error"; \
      exit 1; \
    fi && \
    envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/templates/default.conf.template.substututed && mv /etc/nginx/templates/default.conf.template.substututed /etc/nginx/templates/default.conf.template
