FROM node:lts-alpine
ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}
ENV PORT 3000

WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json .npmrc /usr/src/app/
RUN npm config set '//npm.fontawesome.com/:_authToken' "${NPM_TOKEN}"
RUN yarn install

# Copying source files
COPY . /usr/src/app

# Building app
RUN yarn build
EXPOSE 3000

# Running the app
CMD ["yarn", "start"]
