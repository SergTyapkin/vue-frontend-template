git fetch --all &&
git reset --hard "origin/$(. ".env"; echo "$DEPLOY_BRANCH")" &&
echo "Deploying last commit:" &&
git log --oneline -1 &&
bash ./docker-deploy/scripts/build.sh &&
bash ./docker-deploy/scripts/run.sh &&
echo "✅ Frontend updated successfully" ||
echo "❌ Errors when updating"
