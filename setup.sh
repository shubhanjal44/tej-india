#!/bin/bash

################################################################################
# SkillSwap India - Automated Setup Script
#
# This script automates the complete setup process after cloning the repository
# Run with: bash setup.sh
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emoji support
CHECK="✅"
CROSS="❌"
ROCKET="🚀"
GEAR="⚙️"
PACKAGE="📦"
DATABASE="🗄️"
FRONTEND="🎨"
BACKEND="⚡"
DOCKER="🐳"

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo ""
    echo -e "${PURPLE}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${PURPLE}════════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}${GEAR} $1...${NC}"
}

print_success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

print_error() {
    echo -e "${RED}${CROSS} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

check_command() {
    if command -v $1 &> /dev/null; then
        print_success "$1 is installed"
        return 0
    else
        print_error "$1 is not installed"
        return 1
    fi
}

################################################################################
# Main Setup Process
################################################################################

print_header "SkillSwap India - Automated Setup ${ROCKET}"

echo -e "${CYAN}Welcome to SkillSwap India setup!${NC}"
echo -e "${CYAN}This script will set up everything you need to run the application.${NC}"
echo ""

################################################################################
# Step 1: Check Prerequisites
################################################################################

print_header "Step 1: Checking Prerequisites ${GEAR}"

PREREQUISITES_OK=true

print_step "Checking Node.js"
if check_command node; then
    NODE_VERSION=$(node --version)
    print_info "Node.js version: $NODE_VERSION"

    # Check if version is >= 18
    MAJOR_VERSION=$(echo $NODE_VERSION | sed 's/v//' | cut -d. -f1)
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        print_warning "Node.js version 18+ is recommended. You have v$MAJOR_VERSION"
    fi
else
    PREREQUISITES_OK=false
    print_error "Please install Node.js 18+ from https://nodejs.org/"
fi

print_step "Checking npm"
if check_command npm; then
    NPM_VERSION=$(npm --version)
    print_info "npm version: $NPM_VERSION"
else
    PREREQUISITES_OK=false
fi

print_step "Checking Docker"
if check_command docker; then
    DOCKER_VERSION=$(docker --version)
    print_info "$DOCKER_VERSION"
else
    PREREQUISITES_OK=false
    print_error "Please install Docker from https://www.docker.com/get-started"
fi

print_step "Checking Docker Compose"
if docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version)
    print_info "$COMPOSE_VERSION"
    print_success "Docker Compose is installed"
elif check_command docker-compose; then
    COMPOSE_VERSION=$(docker-compose --version)
    print_info "$COMPOSE_VERSION"
    print_success "Docker Compose is installed"
else
    PREREQUISITES_OK=false
    print_error "Docker Compose is required"
fi

print_step "Checking Git"
if check_command git; then
    GIT_VERSION=$(git --version)
    print_info "$GIT_VERSION"
else
    print_warning "Git not found (optional)"
fi

if [ "$PREREQUISITES_OK" = false ]; then
    echo ""
    print_error "Missing required prerequisites. Please install them and run this script again."
    exit 1
fi

print_success "All prerequisites are installed!"

################################################################################
# Step 2: Setup Environment Files
################################################################################

print_header "Step 2: Setting Up Environment Files ${GEAR}"

# Backend .env
print_step "Creating backend .env file"
if [ -f "backend/.env" ]; then
    print_warning "backend/.env already exists. Backing up to backend/.env.backup"
    cp backend/.env backend/.env.backup
fi

cat > backend/.env << 'EOF'
# Environment
NODE_ENV=development

# Server
PORT=5000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://skillswap:skillswap123@localhost:5432/skillswap_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Verification Requirement
# Set to 'false' for development (users can login without email verification)
# Set to 'true' for production (users must verify email before login)
REQUIRE_EMAIL_VERIFICATION=false

# Email Configuration (Optional - for production)
# SENDGRID_API_KEY=your-sendgrid-api-key
# EMAIL_FROM=noreply@skillswap.in

# Twilio (Optional - for SMS OTP)
# TWILIO_ACCOUNT_SID=your-twilio-account-sid
# TWILIO_AUTH_TOKEN=your-twilio-auth-token
# TWILIO_PHONE_NUMBER=+1234567890

# Razorpay (Optional - for payments)
# RAZORPAY_KEY_ID=your-razorpay-key-id
# RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Cloudinary (Optional - for image uploads)
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret

# CORS
CORS_ORIGIN=http://localhost:3000

# Socket.IO
SOCKET_CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=90000000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
EOF

print_success "Created backend/.env"

# Frontend .env
print_step "Creating frontend .env file"
if [ -f "frontend/.env" ]; then
    print_warning "frontend/.env already exists. Backing up to frontend/.env.backup"
    cp frontend/.env frontend/.env.backup
fi

cat > frontend/.env << 'EOF'
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000

# Environment
VITE_ENV=development

# Optional: Google Analytics
# VITE_GA_TRACKING_ID=your-ga-tracking-id

# Optional: Sentry (Error Tracking)
# VITE_SENTRY_DSN=your-sentry-dsn
EOF

print_success "Created frontend/.env"

################################################################################
# Step 3: Install Dependencies
################################################################################

print_header "Step 3: Installing Dependencies ${PACKAGE}"

# Backend dependencies
print_step "Installing backend dependencies"
cd backend
print_info "This may take 2-3 minutes..."
npm install
if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi
cd ..

# Frontend dependencies
print_step "Installing frontend dependencies"
cd frontend
print_info "This may take 1-2 minutes..."
npm install
if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi
cd ..

################################################################################
# Step 4: Start Docker Containers
################################################################################

print_header "Step 4: Starting Docker Containers ${DOCKER}"

print_step "Stopping any existing containers"
docker compose down 2>/dev/null || docker-compose down 2>/dev/null || true

print_step "Starting PostgreSQL, Redis, and pgAdmin"
if docker compose up -d 2>/dev/null; then
    print_success "Docker containers started with 'docker compose'"
elif docker-compose up -d 2>/dev/null; then
    print_success "Docker containers started with 'docker-compose'"
else
    print_error "Failed to start Docker containers"
    exit 1
fi

print_step "Waiting for PostgreSQL to be ready"
for i in {1..30}; do
    if docker compose exec -T postgres pg_isready -U skillswap &>/dev/null || \
       docker-compose exec -T postgres pg_isready -U skillswap &>/dev/null; then
        print_success "PostgreSQL is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "PostgreSQL did not start in time"
        exit 1
    fi
    echo -n "."
    sleep 1
done

print_step "Waiting for Redis to be ready"
sleep 3
if docker compose exec -T redis redis-cli ping &>/dev/null || \
   docker-compose exec -T redis redis-cli ping &>/dev/null; then
    print_success "Redis is ready"
else
    print_warning "Redis may not be ready yet, but continuing..."
fi

################################################################################
# Step 5: Setup Database
################################################################################

print_header "Step 5: Setting Up Database ${DATABASE}"

cd backend

print_step "Generating Prisma Client"
npx prisma generate
if [ $? -eq 0 ]; then
    print_success "Prisma Client generated"
else
    print_error "Failed to generate Prisma Client"
    exit 1
fi

print_step "Running database migrations"
npx prisma migrate dev --name initial_setup
if [ $? -eq 0 ]; then
    print_success "Database migrations completed"
else
    print_warning "Migrations may have already been run"
fi

print_step "Seeding database with initial data"
print_info "This will add:"
print_info "  - 10 skill categories"
print_info "  - 60+ skills"
print_info "  - 8 achievement badges"
print_info "  - Sample data"

npx prisma db seed
if [ $? -eq 0 ]; then
    print_success "Database seeded successfully"
else
    print_warning "Seeding may have already been done or encountered an issue"
fi

cd ..

################################################################################
# Step 6: Build Verification (Optional)
################################################################################

print_header "Step 6: Verifying Build (Optional) ${GEAR}"

read -p "Do you want to verify the frontend build? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Building frontend for production"
    cd frontend
    npm run build
    if [ $? -eq 0 ]; then
        print_success "Frontend build successful"
    else
        print_warning "Frontend build had issues, but development mode should work"
    fi
    cd ..
else
    print_info "Skipping build verification"
fi

################################################################################
# Setup Complete
################################################################################

print_header "Setup Complete! ${ROCKET}"

echo ""
print_success "SkillSwap India is ready to run!"
echo ""

# Print service information
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${CHECK} Services Running:${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "  ${DATABASE} PostgreSQL:  ${YELLOW}localhost:5432${NC}"
echo -e "  ${DATABASE} Redis:        ${YELLOW}localhost:6379${NC}"
echo -e "  ${FRONTEND} pgAdmin:      ${YELLOW}http://localhost:5050${NC}"
echo -e "                    Email: ${CYAN}admin@skillswap.in${NC}"
echo -e "                    Password: ${CYAN}admin123${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Print next steps
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${ROCKET} Next Steps:${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}1. Start the backend server:${NC}"
echo -e "   ${BLUE}cd backend && npm run dev${NC}"
echo -e "   ${CYAN}Backend will run on: http://localhost:5000${NC}"
echo ""
echo -e "${YELLOW}2. In a new terminal, start the frontend:${NC}"
echo -e "   ${BLUE}cd frontend && npm run dev${NC}"
echo -e "   ${CYAN}Frontend will run on: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}3. Access the application:${NC}"
echo -e "   ${BLUE}Open your browser and visit: http://localhost:3000${NC}"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Print useful commands
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${GEAR} Useful Commands:${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Database Management:${NC}"
echo -e "  View database:     ${BLUE}cd backend && npx prisma studio${NC}"
echo -e "  Reset database:    ${BLUE}cd backend && npx prisma migrate reset${NC}"
echo -e "  Create migration:  ${BLUE}cd backend && npx prisma migrate dev --name description${NC}"
echo ""
echo -e "${YELLOW}Docker Management:${NC}"
echo -e "  Stop containers:   ${BLUE}docker compose down${NC}"
echo -e "  View logs:         ${BLUE}docker compose logs -f${NC}"
echo -e "  Restart:           ${BLUE}docker compose restart${NC}"
echo ""
echo -e "${YELLOW}Development:${NC}"
echo -e "  Backend tests:     ${BLUE}cd backend && npm test${NC}"
echo -e "  Frontend tests:    ${BLUE}cd frontend && npm test${NC}"
echo -e "  Lint code:         ${BLUE}npm run lint${NC}"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Print documentation links
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}📚 Documentation:${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "  README:                 ${BLUE}README.md${NC}"
echo -e "  Quick Start:            ${BLUE}QUICKSTART.md${NC}"
echo -e "  Implementation Status:  ${BLUE}IMPLEMENTATION_STATUS.md${NC}"
echo -e "  Testing Report:         ${BLUE}TESTING_REPORT.md${NC}"
echo -e "  Deployment Guide:       ${BLUE}DEPLOYMENT.md${NC}"
echo -e "  API Documentation:      ${BLUE}docs/API.md${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Print troubleshooting
echo -e "${YELLOW}⚠️  Troubleshooting:${NC}"
echo -e "  - If ports are in use, change them in .env files"
echo -e "  - Run ${BLUE}docker compose down${NC} if you see database connection errors"
echo -e "  - Check logs: ${BLUE}docker compose logs${NC}"
echo -e "  - For more help, see TROUBLESHOOTING.md (if available)"
echo ""

# Create quick start scripts
print_step "Creating quick start scripts"

# Start all script
cat > start-all.sh << 'STARTEOF'
#!/bin/bash
echo "Starting SkillSwap India..."
echo ""
echo "Starting Docker containers..."
docker compose up -d
sleep 3
echo ""
echo "To start the servers, run these commands in separate terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
STARTEOF
chmod +x start-all.sh
print_success "Created start-all.sh"

# Stop all script
cat > stop-all.sh << 'STOPEOF'
#!/bin/bash
echo "Stopping SkillSwap India..."
echo ""
echo "Stopping Docker containers..."
docker compose down
echo ""
echo "All services stopped."
STOPEOF
chmod +x stop-all.sh
print_success "Created stop-all.sh"

echo ""
print_success "Setup completed successfully! ${ROCKET}"
echo ""
echo -e "${GREEN}${CHECK} You can now run: ${BLUE}bash start-all.sh${NC} to start Docker containers"
echo -e "${GREEN}${CHECK} Then start backend and frontend in separate terminals${NC}"
echo ""
echo -e "${PURPLE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}Built with ❤️  for India's youth | सीखो और सिखाओ 🇮🇳${NC}"
echo -e "${PURPLE}════════════════════════════════════════════════════════════════${NC}"
echo ""
