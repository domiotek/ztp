#!/bin/bash

# Script to test deployment and database schema creation

echo "=== FinTrack Deployment Test Script ==="
echo "This script will help test and debug the database schema creation issue"
echo ""

# Function to check if Docker is running
check_docker() {
    echo "Checking Docker status..."
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
    echo "✓ Docker is running"
}

# Function to clean up existing containers
cleanup() {
    echo "Cleaning up existing containers..."
    docker-compose -f deploy-docker-compose.yml down --volumes
    echo "✓ Cleanup complete"
}

# Function to build and start services
deploy() {
    echo "Building and starting services..."
    docker-compose -f deploy-docker-compose.yml up --build -d
    echo "✓ Services started"
}

# Function to wait for database to be ready
wait_for_database() {
    echo "Waiting for database to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker exec fintrack_database pg_isready -U postgres -d fintrack > /dev/null 2>&1; then
            echo "✓ Database is ready (attempt $attempt)"
            return 0
        fi
        echo "Waiting for database... (attempt $attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done
    
    echo "❌ Database failed to become ready after $max_attempts attempts"
    return 1
}

# Function to check API logs
check_api_logs() {
    echo "Checking API logs for schema creation..."
    echo "--- API Container Logs (last 50 lines) ---"
    docker logs fintrack_api --tail 50
}

# Function to check database schema
check_database_schema() {
    echo "Checking database schema..."
    echo "--- Database Tables ---"
    docker exec fintrack_database psql -U postgres -d fintrack -c "\dt"
    echo ""
    echo "--- Database Size ---"
    docker exec fintrack_database psql -U postgres -d fintrack -c "SELECT pg_size_pretty(pg_database_size('fintrack')) AS database_size;"
}

# Function to test API health
test_api_health() {
    echo "Testing API health..."
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
            echo "✓ API is responding (attempt $attempt)"
            return 0
        fi
        echo "Waiting for API... (attempt $attempt/$max_attempts)"
        sleep 3
        ((attempt++))
    done
    
    echo "❌ API failed to respond after $max_attempts attempts"
    return 1
}

# Main execution
main() {
    check_docker
    
    echo ""
    echo "Choose an option:"
    echo "1. Full deployment test (clean + deploy + check)"
    echo "2. Check current deployment status"
    echo "3. View API logs only"
    echo "4. Check database schema only"
    echo "5. Cleanup only"
    echo ""
    read -p "Enter choice (1-5): " choice
    
    case $choice in
        1)
            cleanup
            echo ""
            deploy
            echo ""
            wait_for_database
            echo ""
            sleep 10  # Give Spring Boot time to start
            check_api_logs
            echo ""
            check_database_schema
            echo ""
            test_api_health
            ;;
        2)
            wait_for_database
            echo ""
            check_api_logs
            echo ""
            check_database_schema
            echo ""
            test_api_health
            ;;
        3)
            check_api_logs
            ;;
        4)
            check_database_schema
            ;;
        5)
            cleanup
            ;;
        *)
            echo "Invalid choice"
            exit 1
            ;;
    esac
    
    echo ""
    echo "=== Test Complete ==="
}

main "$@"
