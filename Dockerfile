# Use the official image as a parent image.
FROM node:6

# Set the working directory.
WORKDIR /usr/src/app

# Copy the file from your host to your current location.
COPY package.json .

# Run the command inside your image filesystem.
RUN npm install

RUN apt-get update
RUN apt-get install -y jq
RUN apt-get install -y net-tools

# Run the specified command within the container.
CMD [ "./heartbeat.js" ]

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

COPY config.js .
