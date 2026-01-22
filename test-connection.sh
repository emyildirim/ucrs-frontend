#!/bin/bash

echo "UCRS Frontend-Backend Connection Test"
echo "======================================"
echo ""

# Test backend health
echo "1. Testing Backend API..."
BACKEND_RESPONSE=$(curl -s http://localhost:8000/api/hello)
echo "$BACKEND_RESPONSE" | jq .

if echo "$BACKEND_RESPONSE" | jq -e '.message' > /dev/null; then
    echo "PASS: Backend is running"
else
    echo "FAIL: Backend is not accessible"
    echo "Start backend with: cd ucrs-backend/project && php artisan serve"
    exit 1
fi

echo ""
echo "======================================"
echo ""

# Test frontend
echo "2. Testing Frontend Server..."
FRONTEND_RESPONSE=$(curl -s http://localhost:5173)

if echo "$FRONTEND_RESPONSE" | grep -q "ucrs-frontend"; then
    echo "PASS: Frontend is running"
else
    echo "FAIL: Frontend is not accessible"
    echo "Start frontend with: npm run dev"
    exit 1
fi

echo ""
echo "======================================"
echo ""

# Test CORS
echo "3. Testing CORS Configuration..."
CORS_RESPONSE=$(curl -s -I -X OPTIONS http://localhost:8000/api/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" | grep -i "access-control-allow-origin")

if echo "$CORS_RESPONSE" | grep -q "http://localhost:5173"; then
    echo "PASS: CORS is properly configured"
else
    echo "FAIL: CORS may not be configured correctly"
fi

echo ""
echo "======================================"
echo ""
echo "All systems operational!"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000/api"
echo "API Docs: http://localhost:8000/api/documentation"
