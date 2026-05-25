source ./docker-deploy/scripts/_echo-colors.sh &&
echo_info "Letsencrypt HTTPS certificates" &&

enable_https="$(. "../.env"; echo "$VITE_HTTPS" | tr -dc "a-zA-Z")" &&
if [[ ${enable_https} == "true" ]] || [[ ${enable_https} == "True" ]] || [[ ${enable_https} == "TRUE" ]]
then
  echo_step "Getting letsencrypt HTTPS certificates..." &&
  cd docker-deploy &&
  docker compose --env-file ../.env down &&
  docker compose --env-file ../.env up -d nginx-certbot &&
  docker compose --env-file ../.env run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d "$(. "../.env"; echo "$VITE_DEPLOY_HOSTNAME")" &&
  sudo chmod ugo+rwx -R ./certbot/ &&
  echo_success "Certificates generated successfully" ||
  echo_error "Errors when generation certificates"
else
  echo_info "HTTPS not enabled in .env and SSL certificates not needed"
fi;
