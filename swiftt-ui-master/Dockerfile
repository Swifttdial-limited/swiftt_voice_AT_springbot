# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM tiangolo/node-frontend:10 as build-stage

# Create working directory
WORKDIR /app

# Copy all files with the filename containing package with a .json extension
COPY package*.json /app/

RUN npm install

# Copy our source code
COPY ./ /app/

# RUN CI=true npm test

RUN npm run build


# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15.8

COPY --from=build-stage /app/build/ /usr/share/nginx/html

# Copy the default nginx.conf provided by tiangolo/node-frontend
