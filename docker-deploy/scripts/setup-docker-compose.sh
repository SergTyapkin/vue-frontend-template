external_docker_network_name="$(. "./.env"; echo "$EXTERNAL_DOCKER_NETWORK_NAME" | tr -dc "a-zA-Z0-9_.-")"
cat ./docker-deploy/docker-compose.template.yaml > ./docker-deploy/docker-compose.yaml
if [[ -n "${external_docker_network_name}" ]]
then
  echo "Setted up external docker network with name: ${external_docker_network_name}"
  echo "    external:
      name: ${external_docker_network_name}" >> ./docker-deploy/docker-compose.yaml
fi

enable_https="$(. "./.env"; echo "$VITE_HTTPS" | tr -dc "a-zA-Z")"
if [[ $enable_https == "true" ]] || [[ $enable_https == "True" ]] || [[ $enable_https == "TRUE" ]]
then
  echo "Docker-compose sets up to HTTPS configuration (VITE_HTTPS=true in .env)"
else
  echo "Docker-compose sets up without HTTPS configuration (VITE_HTTPS=false in .env)"
  # Remove ports "433:433" in docker-compose.yaml
  sed -i -e '20d' ./docker-deploy/docker-compose.yaml
  # Remove arg HTTPS_ENABLED in docker-compose.yaml
  # sed -i -e '11d' ./docker-deploy/docker-compose.yaml
fi
