source ./docker-deploy/scripts/_echo-colors.sh &&

echo "Now read README.md and setup another deploy environments variables." &&
echo "It seems like values must be:" &&
echo "" &&
echo "-------------------------------------------------------------------" &&
echo_colored "${GREEN}${BOLD}${UNDERLINE}" "Secrets:" &&
echo_green "SSH_DEPLOY_KEY=<private-key-that-you've-seen-before>" &&
echo_green "SERVER_USERNAME=$(whoami)" &&
echo_green "PROJECT_PATH=$(pwd)" &&
echo "" &&
echo_colored "${CYAN}${BOLD}${UNDERLINE}" "Vars:" &&
echo_cyan "DEPLOY_HOST=$(. "./.env"; echo "$VITE_DEPLOY_HOSTNAME")" &&
echo "-------------------------------------------------------------------" &&
echo "" &&
echo "[press Enter to finish setup...]" &&
read ENTER
