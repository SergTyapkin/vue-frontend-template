source ./docker-deploy/scripts/_echo-colors.sh &&
echo_step "Building docker compose..." &&

enable_https="$(. "./.env"; echo "$VITE_HTTPS" | tr -dc "a-zA-Z")" &&

cd ./docker-deploy &&
docker compose --env-file ../.env --progress=plain build --build-arg ENABLE_HTTPS="${enable_https}" nginx

if [ $? -eq 0 ]; then
    echo_success "Docker image built"
else
    echo_error "Errors when building docker image"
    exit 1
fi
