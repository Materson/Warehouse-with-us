FROM node:13.12.0 AS build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY ./warehouse-with-us-app/package.json ./
COPY ./warehouse-with-us-app/package-lock.json ./
# COPY warehouse-with-us-app/package-lock.json* warehouse-with-us-app/yarn.lock* ./
# RUN yarn install
RUN npm install
RUN npm install react-scripts@3.4.1 -g

# add app
COPY ./warehouse-with-us-app ./

# start app
CMD ["npm", "start"]

RUN yarn build

FROM nginx:alpine as deploy
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build .
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./CA.crt /etc/nginx/certs/CA.crt
COPY ./key.key /etc/nginx/certs/key.key
