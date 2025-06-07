# FinTrack Deployment Test Script for Windows PowerShell

Write-Host "=== FinTrack Deployment Test Script ===" -ForegroundColor Green
Write-Host "This script will help test and debug the database schema creation issue"
Write-Host ""

# Function to check if Docker is running
function Test-Docker {
    Write-Host "Checking Docker status..." -ForegroundColor Yellow
    try {
        docker info *> $null
        Write-Host "✓ Docker is running" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Docker is not running. Please start Docker and try again." -ForegroundColor Red
        return $false
    }
}

# Function to clean up existing containers
function Invoke-Cleanup {
    Write-Host "Cleaning up existing containers..." -ForegroundColor Yellow
    docker-compose -f deploy-docker-compose.yml down --volumes
    Write-Host "✓ Cleanup complete" -ForegroundColor Green
}

# Function to build and start services
function Invoke-Deploy {
    Write-Host "Building and starting services..." -ForegroundColor Yellow
    docker-compose -f deploy-docker-compose.yml up --build -d
    Write-Host "✓ Services started" -ForegroundColor Green
}

# Function to wait for database to be ready
function Wait-ForDatabase {
    Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
    $maxAttempts = 30
    $attempt = 1
    
    while ($attempt -le $maxAttempts) {
        try {
            docker exec fintrack_database pg_isready -U postgres -d fintrack *> $null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ Database is ready (attempt $attempt)" -ForegroundColor Green
                return $true
            }
        }
        catch {
            # Continue to retry
        }
        Write-Host "Waiting for database... (attempt $attempt/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
        $attempt++
    }
    
    Write-Host "❌ Database failed to become ready after $maxAttempts attempts" -ForegroundColor Red
    return $false
}

# Function to check API logs
function Get-ApiLogs {
    Write-Host "Checking API logs for schema creation..." -ForegroundColor Yellow
    Write-Host "--- API Container Logs (last 50 lines) ---" -ForegroundColor Cyan
    docker logs fintrack_api --tail 50
}

# Function to check database schema
function Test-DatabaseSchema {
    Write-Host "Checking database schema..." -ForegroundColor Yellow
    Write-Host "--- Database Tables ---" -ForegroundColor Cyan
    docker exec fintrack_database psql -U postgres -d fintrack -c "\dt"
    Write-Host ""
    Write-Host "--- Database Size ---" -ForegroundColor Cyan
    docker exec fintrack_database psql -U postgres -d fintrack -c "SELECT pg_size_pretty(pg_database_size('fintrack')) AS database_size;"
}

# Function to test API health
function Test-ApiHealth {
    Write-Host "Testing API health..." -ForegroundColor Yellow
    $maxAttempts = 10
    $attempt = 1
    
    while ($attempt -le $maxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -TimeoutSec 5 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "✓ API is responding (attempt $attempt)" -ForegroundColor Green
                return $true
            }
        }
        catch {
            # API not ready yet
        }
        Write-Host "Waiting for API... (attempt $attempt/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 3
        $attempt++
    }
    
    Write-Host "❌ API failed to respond after $maxAttempts attempts" -ForegroundColor Red
    return $false
}

# Main execution
function Main {
    if (-not (Test-Docker)) {
        exit 1
    }
    
    Write-Host ""
    Write-Host "Choose an option:" -ForegroundColor Cyan
    Write-Host "1. Full deployment test (clean + deploy + check)"
    Write-Host "2. Check current deployment status"
    Write-Host "3. View API logs only"
    Write-Host "4. Check database schema only"
    Write-Host "5. Cleanup only"
    Write-Host ""
    
    $choice = Read-Host "Enter choice (1-5)"
    
    switch ($choice) {
        "1" {
            Invoke-Cleanup
            Write-Host ""
            Invoke-Deploy
            Write-Host ""
            Wait-ForDatabase
            Write-Host ""
            Write-Host "Waiting for Spring Boot to initialize..." -ForegroundColor Yellow
            Start-Sleep -Seconds 10
            Get-ApiLogs
            Write-Host ""
            Test-DatabaseSchema
            Write-Host ""
            Test-ApiHealth
        }
        "2" {
            Wait-ForDatabase
            Write-Host ""
            Get-ApiLogs
            Write-Host ""
            Test-DatabaseSchema
            Write-Host ""
            Test-ApiHealth
        }
        "3" {
            Get-ApiLogs
        }
        "4" {
            Test-DatabaseSchema
        }
        "5" {
            Invoke-Cleanup
        }
        default {
            Write-Host "Invalid choice" -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host ""
    Write-Host "=== Test Complete ===" -ForegroundColor Green
}

# Run the main function
Main
