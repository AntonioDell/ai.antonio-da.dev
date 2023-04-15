#!/bin/bash
HOSTS_LINE="127.0.0.1 ai-newsletter.local"

if ! grep -qF "$HOSTS_LINE" /etc/hosts; then
    echo "$HOSTS_LINE" | sudo tee -a /etc/hosts
    echo "Added ai-newsletter.local to /etc/hosts"
else
    echo "ai-newsletter.local already exists in /etc/hosts"
fi
