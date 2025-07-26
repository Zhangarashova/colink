#!/bin/bash

# CoLink Setup Script
# This script helps you set up the CoLink platform quickly

echo "🎓 CoLink - Coventry University Astana Learning Platform Setup"
echo "=============================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "   Please update Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo ""
    echo "🔧 Creating environment configuration..."
    cp .env.local .env
    echo "✅ Environment file created (.env)"
    echo ""
    echo "⚠️  IMPORTANT: Please update the .env file with your Supabase credentials:"
    echo "   - VITE_SUPABASE_URL=your-supabase-project-url"
    echo "   - VITE_SUPABASE_ANON_KEY=your-supabase-anon-key"
    echo ""
else
    echo "✅ Environment file already exists"
fi

# Check if Supabase credentials are configured
if grep -q "your-supabase-project-url" .env 2>/dev/null; then
    echo "⚠️  Please configure your Supabase credentials in the .env file"
    echo "   You can get these from your Supabase project dashboard"
    echo ""
fi

echo "🗄️  Database Setup Instructions:"
echo "   1. Create a new Supabase project at https://supabase.com"
echo "   2. Go to SQL Editor in your Supabase dashboard"
echo "   3. Run the SQL schema from: src/lib/supabase-schema.sql"
echo "   4. Update your .env file with the project URL and anon key"
echo ""

echo "🚀 Setup Complete!"
echo ""
echo "To start the development server:"
echo "   npm run dev"
echo ""
echo "To build for production:"
echo "   npm run build"
echo ""
echo "📚 For more information, check the README.md file"
echo ""
echo "🎯 Happy learning with CoLink!"