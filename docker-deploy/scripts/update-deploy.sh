git fetch --all
git reset --hard "origin/$(. ".env"; echo "$DEPLOY_BRANCH")"
echo "Deploying last commit:"
git log --oneline -1
./docker-deploy/scripts/build.sh
./docker-deploy/scripts/run.sh
echo "Frontend updated successfully"
