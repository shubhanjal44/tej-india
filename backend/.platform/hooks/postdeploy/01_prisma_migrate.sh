#!/usr/bin/env bash
set -e
cd /var/app/current

# install production deps (ensures prisma and binaries exist)
npm ci --production

# generate prisma client and run migrations
npm run prisma:generate
npm run prisma:migrate:deploy || true
