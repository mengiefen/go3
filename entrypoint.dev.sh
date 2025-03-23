#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails
rm -f /rails/tmp/pids/server.pid

# Wait for PostgreSQL to be ready
until pg_isready -h db -p 5432 -U postgres; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

# Create, migrate, and seed the database if needed
bundle exec rails db:prepare

# Then exec the container's main process
exec "$@" 
