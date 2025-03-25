#id -u github &>/dev/null || sudo adduser github # Add user if not exists
#sudo chown -R github:legend .
#sudo -u github ssh-keygen
#sudo cat /home/github/.ssh/id_rsa.pub >> /home/github/.ssh/authorized_keys
#sudo chmod 777 -R /home/github/.ssh
#sudo chmod 666 /home/github/.ssh/authorized_keys
#sudo -u github ssh-keygen
#echo "" && \
#echo 'Add this politics for github user: [press Enter]' && \
#echo 'AllowUsers github' && \
#echo 'Match User github' && \
#echo 'PasswordAuthentication no' && \
#echo 'AllowTCPForwarding no' && \
#echo 'X11Forwarding no' && \
#echo '[press Enter...]' && \
#read ENTER
#nano /etc/ssh/sshd_config
#echo "" && \
#echo 'Add this public rsa key to Deploy keys in your github directory: ' && \
#sudo cat /home/github/.ssh/id_rsa.pub
key_name="$(. ".env"; eval "echo \${DOMAIN_URL}" | tr -dc "a-zA-Z0-9_.-")"
ssh-keygen -f "/tmp/${key_name}"
sudo mkdir -p ~/.ssh
sudo cat "/tmp/${key_name}.pub" | sudo tee -a ~/.ssh/authorized_keys > /dev/null
echo ''
echo 'Add this private rsa key secret deploy environment variables to SSH_DEPLOY_KEY on your github repo: '
echo '[To see key press Enter...]'
read ENTER
sudo less "/tmp/${key_name}"
