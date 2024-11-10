# Use official Node.js image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Expose port 8060
EXPOSE 8060

# Command to run the app
CMD ["node", "app.js"]
