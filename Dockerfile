# Use Node.js as the base image
FROM node:18

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
