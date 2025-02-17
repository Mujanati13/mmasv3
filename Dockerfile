# Use an official Node.js runtime as a parent image
FROM node:20

# Set the Node.js memory limit
ENV NODE_OPTIONS=--max-old-space-size=1906

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build your application (if applicable)
RUN npm run build

# Expose the port your app runs on
EXPOSE 3001

# Start your application
CMD ["npm", "start"]


