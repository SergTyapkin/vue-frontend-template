ARG NGINX_RELEASE
ARG NODE_RELEASE
ARG DOMAIN_URL
ARG API_PORT

FROM node:${NODE_RELEASE} as build
ARG DEBIAN_FRONTEND=noninteractive
USER root

# copy project to workdir
COPY .. /home/node/front
WORKDIR /home/node/front

# install envsubst
RUN apt-get update -y && apt-get install --no-install-recommends -y \
    gettext-base

# build project - create static dist files
RUN yarn
RUN yarn dist

# substitute env variables into nginx.conf
# you can add any your variables that you need to substitute into nginx.conf
RUN export DOMAIN_URL=${DOMAIN_URL} && \
    export API_URL=${API_URL} && \
    export DOLLAR="$" && envsubst < /home/node/front/docker-deploy/nginx/nginx.conf > /home/node/front/docker-deploy/nginx/_nginx-substituted.conf


# Finally - get only needed files from previous build stage. Static files + config
FROM nginx:${NGINX_RELEASE}
COPY --from=build /home/node/front/dist /frontend-dist
COPY --from=build /home/node/front/docker-deploy/nginx/nginx.conf /etc/nginx/nginx-not-substituted.conf
COPY --from=build /home/node/front/docker-deploy/nginx/_nginx-substituted.conf /etc/nginx/nginx.conf
