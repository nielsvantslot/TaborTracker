# Use the official Node.js image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the working directory
COPY . .

# Install the application dependencies
RUN npm install

# Install netcat to create a dummy listener
RUN apt-get update && apt-get install -y netcat

# Expose port 8080
EXPOSE 8080

# Start the application and run a dummy listener on port 8080
CMD ["sh", "-c", "npm run prod & nc -lkp 8080"]
