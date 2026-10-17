FROM node:24-bookworm-slim
WORKDIR /app
RUN npm install --global pnpm@11.25.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run test && pnpm run typecheck && pnpm run build:portable
EXPOSE 8080
# A reproducible synthetic demonstration. No production identity gateway exists here.
CMD ["node", "--import", "./scripts/sites-env.mjs", "./node_modules/wrangler/bin/wrangler.js", "dev", "--config", "dist/server/wrangler.json", "--local", "--ip", "0.0.0.0", "--port", "8080", "--inspector-port", "0", "--var", "VITITRACK_CONTAINER_DEMO:true"]
