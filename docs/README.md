# MJS Monorepo Documentation

Welcome to the comprehensive documentation for the MJS monorepo! This documentation covers all public APIs, functions, components, hooks, and utilities available in the project.

## 📚 Documentation Index

### 🚀 [Getting Started Guide](./GETTING_STARTED.md)
**Start here!** Complete setup guide with installation instructions, project structure overview, and quick start examples.

**What you'll learn:**
- Prerequisites and installation
- Project structure and organization
- Your first component
- Development workflow
- Configuration and deployment

---

### 🎨 [Component Documentation](./COMPONENTS.md)
Detailed documentation for all UI components with prop tables, examples, and usage patterns.

**What's included:**
- **Primitive Components**: Button, Input, Card, etc.
- **Enhanced Components**: TextAnimate, AuroraText, Interactive Buttons
- **Layout Components**: Background effects, containers
- **Form Components**: Advanced form inputs and validation
- **Navigation Components**: Tabs, breadcrumbs, pagination
- **Media Components**: Enhanced image handling

**Quick Examples:**
```tsx
import { Button } from '@mjs/ui/primitives/button';
import { Card, CardContent } from '@mjs/ui/primitives/card';

<Card>
  <CardContent>
    <Button variant="primary" size="lg">
      Get Started
    </Button>
  </CardContent>
</Card>
```

---

### 🪝 [Hooks Documentation](./HOOKS.md)
Comprehensive guide to all React hooks available in the UI package and web application.

**Available Hooks:**
- **Navigation**: `useActiveLink` for link state management
- **Event Handling**: `useActionListener` for keyboard shortcuts
- **URL State**: `useHash` for hash-based navigation
- **Localization**: `useLocale` for internationalization
- **Responsive**: `useIsMobile` for device detection
- **Storage**: `useLocalStorage` for persistent state

**Quick Examples:**
```tsx
import { useIsMobile } from '@mjs/ui/hooks/use-mobile';
import { useToast } from '@mjs/ui/primitives/use-toast';

function MyComponent() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

---

### ⚙️ [Utilities Documentation](./UTILITIES.md)
Documentation for all utility functions including file operations, translations, styling helpers, and more.

**Available Utilities:**
- **File Operations**: `getFile`, `saveFile`, `getPrompt` with Handlebars
- **Translation**: AI-powered translation with Google Gemini
- **Styling**: `cn` function for conditional classes
- **Formatting**: Date, currency, file size formatters
- **Validation**: Email, URL, password validation
- **Async Helpers**: Retry, debounce, throttle utilities

**Quick Examples:**
```typescript
import { getFile, translateAndSave, cn } from '@mjs/utils';

// File operations
const config = await getFile('./config/app.json');

// Translation
await translateAndSave('Spanish', 'Translate this', './en/doc.md', './es/doc.md');

// Styling
const className = cn('base-class', condition && 'conditional-class');
```

---

### 📖 [Complete API Reference](./API_DOCUMENTATION.md)
Comprehensive API reference covering all packages, components, hooks, and utilities with detailed examples.

**What's covered:**
- **UI Package**: Complete component library reference
- **Utils Package**: File and translation utilities
- **Web App Components**: Application-specific components
- **Best Practices**: Recommended patterns and usage
- **Examples**: Real-world usage patterns

---

## 🔍 Quick Reference

### Most Used Components

| Component | Import | Description |
|-----------|--------|-------------|
| `Button` | `@mjs/ui/primitives/button` | Versatile button with variants |
| `Card` | `@mjs/ui/primitives/card` | Content container |
| `Input` | `@mjs/ui/primitives/input` | Form input field |
| `Dialog` | `@mjs/ui/primitives/dialog` | Modal dialog |
| `Toast` | `@mjs/ui/primitives/use-toast` | Notification system |

### Most Used Hooks

| Hook | Import | Description |
|------|--------|-------------|
| `useIsMobile` | `@mjs/ui/hooks/use-mobile` | Device detection |
| `useToast` | `@mjs/ui/primitives/use-toast` | Show notifications |
| `useLocalStorage` | `@mjs/ui/hooks` | Persistent state |
| `useActiveLink` | `@mjs/ui/hooks/use-active-link` | Navigation state |

### Most Used Utilities

| Utility | Import | Description |
|---------|--------|-------------|
| `cn` | `@mjs/ui/lib/utils` | Conditional classes |
| `getFile` | `@mjs/utils` | Read files |
| `translateAndSave` | `@mjs/utils` | AI translation |
| `formatDate` | `@mjs/utils` | Date formatting |

---

## 🏗️ Project Architecture

```
MJS Monorepo
├── 📱 Applications
│   ├── Web App (Next.js)
│   ├── Documentation Site
│   └── Token Service
├── 📦 Packages
│   ├── UI Component Library
│   ├── Utility Functions
│   ├── Internationalization
│   └── Configuration Packages
└── 📚 Documentation (You are here!)
```

---

## 🎯 Common Use Cases

### Building a Form
```tsx
import { Button } from '@mjs/ui/primitives/button';
import { Input } from '@mjs/ui/primitives/input';
import { Card, CardContent, CardHeader, CardTitle } from '@mjs/ui/primitives/card';
import { useToast } from '@mjs/ui/primitives/use-toast';

function ContactForm() {
  const { toast } = useToast();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Input placeholder="Your name" />
          <Input type="email" placeholder="Email address" />
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Creating a Responsive Layout
```tsx
import { useIsMobile } from '@mjs/ui/hooks/use-mobile';
import { cn } from '@mjs/ui/lib/utils';

function ResponsiveGrid({ children }) {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      'grid gap-4',
      isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'
    )}>
      {children}
    </div>
  );
}
```

### Working with Files and Translation
```typescript
import { getFile, translateAndSave } from '@mjs/utils';

async function processDocumentation() {
  // Read source file
  const content = await getFile('./docs/guide.md');
  
  // Translate to multiple languages
  const languages = ['es', 'fr', 'de'];
  
  for (const lang of languages) {
    await translateAndSave(
      lang,
      'Translate this documentation professionally',
      './docs/guide.md',
      `./docs/${lang}/guide.md`
    );
  }
}
```

---

## 📋 Development Checklist

When creating new components or features:

- [ ] **TypeScript**: Use proper types and interfaces
- [ ] **Accessibility**: Include ARIA labels and keyboard navigation
- [ ] **Responsive**: Test on mobile and desktop
- [ ] **Documentation**: Add examples and prop tables
- [ ] **Testing**: Create test cases or examples
- [ ] **Performance**: Import only what's needed

---

## 🆘 Need Help?

1. **📖 Read the Docs**: Start with the [Getting Started Guide](./GETTING_STARTED.md)
2. **🔍 Search Examples**: Look for similar usage in existing components
3. **💡 Check Patterns**: Follow established conventions in the codebase
4. **🐛 Troubleshooting**: See the [troubleshooting section](./GETTING_STARTED.md#troubleshooting)

---

## 🚀 What's Next?

1. **New to the project?** → [Getting Started Guide](./GETTING_STARTED.md)
2. **Building UI?** → [Component Documentation](./COMPONENTS.md)
3. **Adding interactivity?** → [Hooks Documentation](./HOOKS.md)
4. **Need utilities?** → [Utilities Documentation](./UTILITIES.md)
5. **Complete reference?** → [API Documentation](./API_DOCUMENTATION.md)

---

**Happy building!** 🎉

*This documentation is maintained alongside the codebase. If you find any discrepancies or have suggestions for improvement, please let the development team know.*