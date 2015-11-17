FROM node:latest
EXPOSE 80

# Install app dependencies
COPY package.json /src/package.json
RUN cd /src; npm install

# Bundle app source
COPY . /src

WORKDIR "/src"

CMD ["npm", "start"]