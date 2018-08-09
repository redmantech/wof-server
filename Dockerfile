# base image
FROM mhart/alpine-node:8

# maintainer information

# Where the app is built and run inside the docker fs
ENV WORK=/app
WORKDIR ${WORK}

# copy package.json first to prevent npm install being rerun when only code changes
COPY ./package.json ${WORK}
RUN yarn install --production

COPY . ${WORK}

# start service
CMD ["node", "./bin/cli.js"]
