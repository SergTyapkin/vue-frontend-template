source ./docker-deploy/scripts/_echo-colors.sh &&
echo_step "Stopping docker compose..." &&

cd docker-deploy &&
docker compose --env-file ../.env down &&
echo_success "Docker containers stopped" ||
echo_error "Errors when stopping docker containers"
