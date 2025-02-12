1) Crear imagen de docker
docker build -t nextjs-login . (nextjs-login es el nombre de la imagen)

2) Correr imagen de docker
docker container run -p 3000:3000 nextjs-login
