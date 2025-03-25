cp --no-clobber .env.example .env
echo ""
echo "Edit .env file."
echo "Write right VITE_DEPLOY_HOSTNAME without https:// and url paths!"
echo "Set right API_HOST - it's host of backend. If backend deployed in local docker - it's the name of docker container"
echo "Set right API_PORT - it's port of backend"
echo "If you want to serve only HTTP without HTTPS, set VITE_HTTPS=false and remove DEPLOY_NGINX_PORT_HTTPS"
echo "[press Enter...]"
read ENTER
nano .env
