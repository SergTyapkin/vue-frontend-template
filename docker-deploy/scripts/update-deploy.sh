source ./docker-deploy/scripts/_echo-colors.sh &&
echo_header "Update deploy" &&

git fetch --all &&
git reset --hard "origin/$(. "./.env"; echo "$DEPLOY_BRANCH")" &&
echo_info "Deploying last commit:" &&
git log --oneline -1 &&
bash ./docker-deploy/scripts/generate-docker-compose.sh &&
bash ./docker-deploy/scripts/build.sh &&
bash ./docker-deploy/scripts/run.sh &&
echo_success "Frontend updated successfully" ||
echo_error "Errors when updating"
