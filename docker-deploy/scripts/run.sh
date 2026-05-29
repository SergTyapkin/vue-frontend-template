source ./docker-deploy/scripts/_echo-colors.sh &&
echo_header "Run docker" &&

bash ./docker-deploy/scripts/down.sh &&
cd docker-deploy &&
echo_step "Runing docker compose..." &&
docker compose --env-file ../.env up -d nginx

if [ $? -eq 0 ]; then
    echo_success "Docker containers runs"
else
    echo_error "Errors when running docker containers"
    exit 1
fi
