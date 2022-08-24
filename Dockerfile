FROM node:16.14.0
RUN mkdir /app
COPY *.js /app/
COPY *.json /app/
WORKDIR /app
RUN npm install
CMD ["npm","start"]
