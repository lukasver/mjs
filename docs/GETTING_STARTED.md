# Getting Started Guide

This guide will help you get up and running with the MJS monorepo, including setting up the development environment, understanding the project structure, and using the available APIs and components.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Project Structure](#project-structure)
4. [Quick Start](#quick-start)
5. [Development Workflow](#development-workflow)
6. [Using the Component Library](#using-the-component-library)
7. [Working with Utilities](#working-with-utilities)
8. [Configuration](#configuration)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js**: Version 23.7.0 (as specified in package.json)
- **pnpm**: Version 10.11.0+ for package management
- **Git**: For version control

### Optional Tools

- **VS Code**: Recommended IDE with the following extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - Auto Rename Tag
  - Bracket Pair Colorizer

### Environment Setup

```bash
# Check Node.js version
node --version  # Should be 23.7.0

# Install pnpm globally if not already installed
npm install -g pnpm@latest

# Verify pnpm installation
pnpm --version
```

---

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd mjs-monorepo
```

### Install Dependencies

```bash
# Install all dependencies for the monorepo
pnpm install

# Verify installation
pnpm run build
```

### Environment Variables

Create environment files for each application:

```bash
# For the web application
cp apps/web/.env.example apps/web/.env.local

# Add required environment variables
echo "GOOGLE_AI_API_KEY=your_google_ai_api_key" >> apps/web/.env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> apps/web/.env.local
```

### Development Server

```bash
# Start all development servers
pnpm dev

# Or start specific applications
pnpm --filter web dev
pnpm --filter docs dev
```

---

## Project Structure

```
mjs-monorepo/
├── apps/                    # Applications
│   ├── web/                # Main web application (Next.js)
│   ├── docs/               # Documentation site
│   └── token/              # Token-related service
├── packages/               # Shared packages
│   ├── ui/                 # UI component library
│   ├── utils/              # Utility functions
│   ├── i18n/               # Internationalization
│   ├── eslint-config/      # ESLint configuration
│   ├── tailwind-config/    # Tailwind CSS configuration
│   ├── typescript-config/  # TypeScript configuration
│   └── transactional/      # Transactional email templates
├── docs/                   # Documentation files
├── package.json            # Root package.json
├── pnpm-workspace.yaml     # Workspace configuration
├── turbo.json              # Turbo configuration
└── biome.jsonc             # Biome configuration
```

### Key Directories

- **`apps/web/`**: Main Next.js application with components, pages, and business logic
- **`packages/ui/`**: Reusable UI components and design system
- **`packages/utils/`**: Shared utility functions for file operations and translations
- **`packages/i18n/`**: Internationalization setup and translations
- **`docs/`**: Comprehensive API documentation (this documentation)

---

## Quick Start

### 1. Build Your First Component

Create a new component using the UI library:

```tsx
// apps/web/components/my-first-component.tsx
import { Button } from '@mjs/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@mjs/ui/primitives/card';
import { useToast } from '@mjs/ui/primitives/use-toast';

export function MyFirstComponent() {
  const { toast } = useToast();
  
  const handleClick = () => {
    toast({
      title: "Success!",
      description: "You've created your first component!",
    });
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>My First Component</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          This is your first component using the MJS UI library.
        </p>
        <Button onClick={handleClick} className="w-full">
          Click me!
        </Button>
      </CardContent>
    </Card>
  );
}
```

### 2. Add to a Page

```tsx
// apps/web/app/test/page.tsx
import { MyFirstComponent } from '@/components/my-first-component';
import { Toaster } from '@mjs/ui/primitives/toaster';

export default function TestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Test Page</h1>
      <MyFirstComponent />
      <Toaster />
    </div>
  );
}
```

### 3. Run and Test

```bash
# Start the development server
pnpm --filter web dev

# Visit http://localhost:3000/test
```

---

## Development Workflow

### Available Scripts

```bash
# Development
pnpm dev              # Start all dev servers
pnpm --filter web dev # Start only web app

# Building
pnpm build            # Build all packages and apps
pnpm --filter ui build # Build only UI package

# Linting and Formatting
pnpm lint             # Run ESLint on all packages
pnpm format           # Check formatting with Biome
pnpm format:fix       # Fix formatting issues

# Type Checking
pnpm check-types      # Run TypeScript type checking

# Cleaning
pnpm clean            # Clean all build artifacts
```

### Git Workflow

```bash
# Create a feature branch
git checkout -b feature/new-component

# Make your changes
git add .
git commit -m "feat: add new component"

# Push and create PR
git push origin feature/new-component
```

### Adding New Dependencies

```bash
# Add to specific package
pnpm --filter ui add lucide-react
pnpm --filter web add @next/bundle-analyzer

# Add to root (dev dependencies)
pnpm add -D some-dev-tool
```

---

## Using the Component Library

### Basic Component Usage

```tsx
import { Button } from '@mjs/ui/primitives/button';
import { Input } from '@mjs/ui/primitives/input';
import { Card } from '@mjs/ui/primitives/card';

function LoginForm() {
  return (
    <Card className="p-6">
      <form className="space-y-4">
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </Card>
  );
}
```

### Advanced Component Patterns

```tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@mjs/ui/primitives/dialog';
import { Button } from '@mjs/ui/primitives/button';
import { useToast } from '@mjs/ui/primitives/use-toast';

function AdvancedExample() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async () => {
    try {
      // Your logic here
      toast({ title: "Success!" });
      setIsOpen(false);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Something went wrong",
        variant: "destructive" 
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        {/* Dialog content */}
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
}
```

### Using Hooks

```tsx
import { useIsMobile } from '@mjs/ui/hooks/use-mobile';
import { useActiveLink } from '@mjs/ui/hooks/use-active-link';

function ResponsiveNavigation() {
  const isMobile = useIsMobile();
  const { isActive, setActiveLink } = useActiveLink();
  
  return (
    <nav className={isMobile ? 'mobile-nav' : 'desktop-nav'}>
      {/* Navigation items */}
    </nav>
  );
}
```

---

## Working with Utilities

### File Operations

```typescript
import { getFile, saveFile, getPrompt } from '@mjs/utils';

// Read configuration
async function loadConfig() {
  try {
    const config = await getFile('./config/app.json');
    return JSON.parse(config);
  } catch (error) {
    console.error('Failed to load config:', error);
    return getDefaultConfig();
  }
}

// Generate from template
async function generateEmail(user: User) {
  const emailContent = await getPrompt('./templates/welcome.hbs', {
    name: user.name,
    email: user.email,
  });
  
  await saveFile(`./output/welcome-${user.id}.html`, emailContent);
}
```

### Translation

```typescript
import { translateAndSave, Translator } from '@mjs/utils';

// Simple translation
async function translateDocument() {
  await translateAndSave(
    'Spanish',
    'Translate this documentation professionally',
    './docs/guide.md',
    './docs/es/guide.md'
  );
}

// Advanced translation with class
const translator = new Translator(process.env.GOOGLE_AI_API_KEY!);

async function batchTranslate() {
  const languages = ['es', 'fr', 'de'];
  
  for (const lang of languages) {
    await translator.translateAndSave(
      lang,
      'Professional translation',
      './content/features.md',
      `./content/${lang}/features.md`
    );
  }
}
```

---

## Configuration

### TypeScript Configuration

The project uses shared TypeScript configurations:

```json
// tsconfig.json in your app
{
  "extends": "@mjs/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### Tailwind CSS Configuration

```javascript
// tailwind.config.js in your app
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/*.{js,ts,jsx,tsx,mdx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  presets: [require('@mjs/tailwind-config')],
  theme: {
    extend: {
      // Your custom theme extensions
    },
  },
  plugins: [],
};
```

### ESLint Configuration

```javascript
// .eslintrc.js in your app
module.exports = {
  extends: ['@mjs/eslint-config'],
  rules: {
    // Your custom rules
  },
};
```

---

## Deployment

### Building for Production

```bash
# Build all packages and applications
pnpm build

# Build specific app
pnpm --filter web build

# Check build output
ls -la apps/web/.next/
```

### Environment Variables for Production

```bash
# apps/web/.env.production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
GOOGLE_AI_API_KEY=your_production_api_key
```

### Deployment Options

#### Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Docker

```dockerfile
# Dockerfile example for web app
FROM node:23.7.0-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start"]
```

---

## Troubleshooting

### Common Issues

#### 1. Installation Problems

```bash
# Clear caches and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

#### 2. Build Errors

```bash
# Check TypeScript errors
pnpm check-types

# Clean and rebuild
pnpm clean
pnpm build
```

#### 3. Module Resolution Issues

Make sure your `tsconfig.json` paths are correct:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@mjs/ui": ["../../packages/ui/src"],
      "@mjs/utils": ["../../packages/utils/src"]
    }
  }
}
```

#### 4. Styling Issues

Ensure Tailwind CSS is properly configured:

```javascript
// Check that your content paths include the UI package
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}', // Important!
  ],
  // ...
};
```

### Getting Help

1. **Check the Documentation**: All APIs are documented in the `docs/` directory
2. **Component Examples**: Look at existing components in `apps/web/components/`
3. **Issue Tracking**: Check for known issues in the project repository
4. **Community**: Reach out to the development team

### Development Tips

1. **Use TypeScript**: All packages are fully typed - leverage autocomplete and type checking
2. **Follow Conventions**: Use the established patterns for components and utilities
3. **Test Components**: Use Storybook or create test pages for new components
4. **Performance**: Import only what you need to keep bundle size small

```tsx
// Good - specific imports
import { Button } from '@mjs/ui/primitives/button';
import { getFile } from '@mjs/utils';

// Avoid - barrel imports in production
import { Button, Card, Input } from '@mjs/ui';
```

### VSCode Configuration

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

## Next Steps

Now that you're set up, you can:

1. **Explore the Component Library**: Check out [COMPONENTS.md](./COMPONENTS.md) for detailed component documentation
2. **Learn About Hooks**: Read [HOOKS.md](./HOOKS.md) for custom React hooks
3. **Use Utilities**: See [UTILITIES.md](./UTILITIES.md) for utility functions
4. **Review the API**: Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for the complete API reference

### Example Projects

Create these example projects to get familiar with the system:

1. **Todo App**: Practice with forms, state management, and local storage
2. **Dashboard**: Work with data visualization and responsive design
3. **Blog**: Learn about content management and internationalization
4. **E-commerce**: Explore complex component interactions and state

Happy coding! 🚀