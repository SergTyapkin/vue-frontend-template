source ./docker-deploy/scripts/_echo-colors.sh &&
echo_step "Stopping docker compose..." &&

cd docker-deploy &&
docker compose --env-file ../.env down

if [ $? -eq 0 ]; then
    echo_success "Docker containers stopped"
else
    echo_error "Errors when stopping docker containers"
    exit 1
fi
