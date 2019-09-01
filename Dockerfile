# Specifies the base image we're extending
FROM node:9

# Specify the "working directory" for the rest of the Dockerfile
WORKDIR /src

# Install packages using NPM 5 (bundled with the node:9 image)
COPY ./package.json /src/package.json
COPY ./package-lock.json /src/package-lock.json
RUN npm install --silent

# Add application code
COPY . /src

# Allows port 3000 to be publicly available
EXPOSE 4000

# The command uses nodemon to run the application
CMD ["node", "server.js"]

# docker build --file Dockerfile -t genericreport:latest .
# docker run -it --rm -p 4000:4000 genericreport:latest