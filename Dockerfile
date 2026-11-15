FROM node:26.10.0-alpine
ENV NODE_ENV=production
COPY . .
COPY .env.example .env
RUN npm ci --ignore-scripts
EXPOSE 3000
CMD ["node", "--env-file=.env", "src/index.js"]
