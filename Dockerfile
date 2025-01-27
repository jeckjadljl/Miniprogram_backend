# Use Node.js as the base image
FROM node:18

# Install dockerize
RUN apt-get update && apt-get install -y wget && \
    wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz && \
    tar -xvzf dockerize-linux-amd64-v0.6.1.tar.gz && \
    mv dockerize /usr/local/bin/

# Set working directory
WORKDIR /app

# Copy dependency files to working directory
COPY package*.json ./

# Install dependencies with a custom npm registry (e.g., Aliyun registry for users in China)
RUN npm install --registry=https://registry.npmmirror.com

# Copy application code to working directory
COPY . .

# Expose the port where the application runs (if needed)
EXPOSE 7001

# Run the startup command
CMD ["npm", "run", "dev"]
