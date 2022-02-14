FROM node:lts-alpine
ENV PORT 3000

WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json .npmrc /usr/src/app/
RUN yarn install

# Copying source files
COPY . /usr/src/app

# Building app
RUN yarn build
EXPOSE 3000

# Running the app
CMD ["yarn", "start"]
