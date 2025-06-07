#!/bin/bash

# Database initialization script to verify schema creation
# This script can be used to debug database issues

echo "=== Database Connection Test ==="
echo "Testing connection to PostgreSQL..."

# Wait for database to be ready
until pg_isready -h fintrack_database -p 5432 -U postgres; do
  echo "Waiting for database to be ready..."
  sleep 2
done

echo "Database is ready!"

# Connect and check if tables exist
echo "=== Checking Database Schema ==="
PGPASSWORD=postgres psql -h fintrack_database -U postgres -d fintrack -c "\dt"

echo "=== Checking Database Size ==="
PGPASSWORD=postgres psql -h fintrack_database -U postgres -d fintrack -c "SELECT pg_size_pretty(pg_database_size('fintrack')) AS database_size;"

echo "Script completed!"
