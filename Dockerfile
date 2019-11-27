#base image
FROM node:alpine

#set working directory
RUN mkdir /testapp
WORKDIR '/testapp'

ENV PATH /testapp/node_modules/.bin:$PATH

#install and cache app dependencies
#COPY package-lock.json .
COPY package.json /testapp/package.json
COPY . /testapp

RUN npm install
#start app
CMD ["npm","start"]