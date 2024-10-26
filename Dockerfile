# Step 1: Use a Node.js base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm i

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Build the project (optional if you're using TypeScript)
RUN npm run build

# Step 7: Expose the application port (default NestJS port is 3000)
EXPOSE 3000

# Step 8: Start the application
CMD ["npm", "run", "start"]
