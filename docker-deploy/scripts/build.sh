enable_https="$(. "./.env"; echo "$VITE_HTTPS" | tr -dc "a-zA-Z")" &&
if [[ $enable_https == "true" ]] || [[ $enable_https == "True" ]] || [[ $enable_https == "TRUE" ]]
    then
      HTTP_NGINX_CONFIG="
  listen 80;
  listen [::]:80;
  server_name \${DOMAIN_URL};

  include /etc/nginx/conf.d/locations/http/*.conf;

  return 301 https://\$host\$request_uri;"
      HTTPS_NGINX_CONFIG="
  listen       443 ssl default_server;
  listen       [::]:443 ssl;
  server_name \${DOMAIN_URL};
  http2 on;

  ssl_certificate /etc/nginx/ssl/live/\${DOMAIN_URL}/fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl/live/\${DOMAIN_URL}/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA';
  ssl_prefer_server_ciphers on;

  include /etc/nginx/conf.d/locations/https/*.conf;"
    else
      HTTP_NGINX_CONFIG="
  listen 80;
  listen [::]:80;
  server_name \${DOMAIN_URL};

  include /etc/nginx/conf.d/locations/http/*.conf;

  include /etc/nginx/conf.d/locations/https/*.conf;"
      HTTPS_NGINX_CONFIG=""
fi &&

cd ./docker-deploy &&
docker compose --env-file ../.env --progress=plain build --build-arg HTTP_NGINX_CONFIG="${HTTP_NGINX_CONFIG}" --build-arg HTTPS_NGINX_CONFIG="${HTTPS_NGINX_CONFIG}" nginx &&
echo "✅ Docker image built" ||
echo "❌ Errors when building docker image"

