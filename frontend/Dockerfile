FROM node:18-alpine

WORKDIR /app

# Copy shared package
COPY ../shared ./shared

# Copy frontend package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src
COPY public ./public
COPY tsconfig.json next.config.js tailwind.config.ts postcss.config.js ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
