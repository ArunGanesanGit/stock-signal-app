FROM node:18-alpine

WORKDIR /app

# Copy shared package
COPY ../shared ./shared

# Copy backend package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
