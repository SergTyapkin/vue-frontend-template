source ./docker-deploy/scripts/_echo-colors.sh &&
echo_step "Checking is docker installed..." &&

# fully copied from https://docs.docker.com/engine/install/ubuntu/
if ! command -v docker
then
  echo_step "Installing docker..." &&
  # Add Docker's official GPG key:
  sudo apt-get update &&
  sudo apt-get install -y ca-certificates curl &&
  sudo install -m 0755 -d /etc/apt/keyrings &&
  sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc &&
  sudo chmod a+r /etc/apt/keyrings/docker.asc &&
  # Add the repository to Apt sources:
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null &&
  sudo apt-get update &&
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin &&
  bash ./docker-deploy/scripts/set-docker-not-sudo.sh &&
  echo_success "Docker installed successfully" ||
  echo_error "Errors when installing Docker"
else
  echo_step "Docker already installed";
fi;
