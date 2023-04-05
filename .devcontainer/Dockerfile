FROM mcr.microsoft.com/devcontainers/typescript-node

USER root
# Create workspace folder and assign node user rights to it
RUN mkdir -p /workspace && chown -R node:node /workspace
USER node


# Install pnpm globally
RUN npm install -g pnpm
