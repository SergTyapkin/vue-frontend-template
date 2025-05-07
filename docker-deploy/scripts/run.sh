make down &&
cd docker-deploy &&
docker compose --env-file ../.env up -d nginx &&
echo "✅ Docker containers runs" ||
echo "❌ Errors when running docker containers"
