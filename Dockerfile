# Use official Node.js image
FROM node:18

RUN apt-get update && apt-get install -y netcat-openbsd

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .           
COPY src/ src/     

# Make wait script executable
RUN chmod +x wait-for-it.sh

# Expose port (match your backend port)
EXPOSE 3000

# Run app after waiting for MongoDB
CMD ["./wait-for-it.sh", "mongo:27017", "--", "node", "src/server.js"]
