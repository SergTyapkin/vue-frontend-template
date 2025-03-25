git fetch --all
git reset --hard "origin/$(. ".env"; echo "$DEPLOY_BRANCH")"
echo "Deploying last commit:"
git log --oneline -1
make build
make run
echo "Frontend updated successfully"
