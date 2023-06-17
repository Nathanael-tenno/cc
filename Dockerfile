# Use the official Node.js 14 image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining source code to the working directory
COPY . .

# Expose port 8000 for the server to listen on
EXPOSE 8000

# Start the server
CMD ["node", "Server.js"]
