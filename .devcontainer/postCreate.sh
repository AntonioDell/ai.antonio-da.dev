pushd .devcontainer
docker-compose up -d
popd

pnpx prisma migrate dev --name initial_migration
