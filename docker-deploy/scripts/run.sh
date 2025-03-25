make down
cd docker-deploy || exit
docker compose --env-file ../.env up -d nginx
