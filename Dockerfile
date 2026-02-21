FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy prisma schema BEFORE generate
COPY prisma ./prisma

# 🔥 Generate Prisma Client
RUN npx prisma generate

# Copy rest of the app
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
