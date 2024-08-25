# Use the official Node.js 20 image.
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application's code into the container
COPY . .

# Build the TypeScript code
RUN yarn build

# Expose the port the app will run on
EXPOSE 5000

# Command to run the application
CMD ["yarn", "start"]
