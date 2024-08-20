# Use the official Node.js image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the working directory
COPY . .

# Install the application dependencies
RUN npm install

# Expose port 8080
EXPOSE 8080

# Start the application and the dummy HTTP server
CMD ["sh", "-c", "npm run prod & node dummyServer.js"]
