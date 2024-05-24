##to build the image:
docker build -t node-test-backend . 

##to run:
docker run -d -p 4000:4000 node-test-backend:latest