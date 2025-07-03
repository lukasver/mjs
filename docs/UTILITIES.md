# Utilities Documentation

This document provides comprehensive information about all utility functions available in the @mjs/utils package and other utility modules throughout the project.

## Table of Contents

1. [File Operations](#file-operations)
2. [Translation Utilities](#translation-utilities)
3. [UI Utilities](#ui-utilities)
4. [Styling Utilities](#styling-utilities)
5. [Helper Functions](#helper-functions)
6. [Best Practices](#best-practices)

---

## File Operations

The @mjs/utils package provides utilities for file handling, template processing, and content management.

### getFile

Asynchronously reads a file from the filesystem using Node.js fs promises.

**Import:**
```typescript
import { getFile } from '@mjs/utils';
```

**Signature:**
```typescript
function getFile(path: string): Promise<string>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | The path to the file to read |

**Returns:**
- `Promise<string>` - The file content as a string

**Throws:**
- `Error` - If the file doesn't exist or cannot be read

**Usage Examples:**

```typescript
// Read a text file
async function loadConfiguration() {
  try {
    const config = await getFile('./config/app.json');
    return JSON.parse(config);
  } catch (error) {
    console.error('Failed to load configuration:', error);
    return getDefaultConfig();
  }
}

// Read a template file
async function loadEmailTemplate() {
  const template = await getFile('./templates/welcome-email.html');
  return template;
}

// Read markdown content
async function loadDocumentation(docPath: string) {
  const content = await getFile(`./docs/${docPath}.md`);
  return content;
}

// Error handling with fallback
async function safeFileRead(filePath: string, fallback = '') {
  try {
    return await getFile(filePath);
  } catch (error) {
    console.warn(`Could not read file ${filePath}, using fallback`);
    return fallback;
  }
}
```

### getPrompt

Reads a template file and compiles it with variables using Handlebars templating engine.

**Import:**
```typescript
import { getPrompt } from '@mjs/utils';
```

**Signature:**
```typescript
function getPrompt(
  promptPath: string, 
  variables?: Record<string, string>
): Promise<string>
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `promptPath` | `string` | - | Path to the template file |
| `variables` | `Record<string, string>` | `{}` | Object containing template variables |

**Returns:**
- `Promise<string>` - Compiled template with variables replaced

**Template Syntax:**
Uses Handlebars syntax for variable interpolation:
- `{{variableName}}` - Simple variable substitution
- `{{#if condition}}...{{/if}}` - Conditional blocks
- `{{#each items}}...{{/each}}` - Iteration blocks

**Usage Examples:**

```typescript
// Simple variable substitution
async function generateWelcomeEmail(user: User) {
  const emailContent = await getPrompt('./templates/welcome.hbs', {
    name: user.name,
    email: user.email,
    activationLink: generateActivationLink(user.id)
  });
  
  return emailContent;
}

// Template with date formatting
async function generateReport(data: ReportData) {
  const report = await getPrompt('./templates/monthly-report.hbs', {
    month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    totalUsers: data.totalUsers.toString(),
    revenue: data.revenue.toFixed(2),
    growth: data.growth.toFixed(1)
  });
  
  return report;
}

// Newsletter template
async function generateNewsletter(articles: Article[]) {
  const newsletter = await getPrompt('./templates/newsletter.hbs', {
    title: 'Weekly Tech Update',
    date: new Date().toLocaleDateString(),
    articleCount: articles.length.toString(),
    featuredArticle: articles[0]?.title || 'No featured article'
  });
  
  return newsletter;
}

// Dynamic template selection
async function generateNotification(type: string, data: any) {
  const templatePath = `./templates/notifications/${type}.hbs`;
  
  try {
    return await getPrompt(templatePath, {
      timestamp: new Date().toISOString(),
      ...data
    });
  } catch (error) {
    // Fallback to generic template
    return await getPrompt('./templates/notifications/generic.hbs', {
      message: 'You have a new notification',
      ...data
    });
  }
}
```

**Template Examples:**

```handlebars
<!-- welcome.hbs -->
<h1>Welcome, {{name}}!</h1>
<p>Thank you for joining our platform. Your email address {{email}} has been verified.</p>
<p>Please click the link below to activate your account:</p>
<a href="{{activationLink}}">Activate Account</a>

<!-- monthly-report.hbs -->
<h1>Monthly Report - {{month}}</h1>
<div class="metrics">
  <div class="metric">
    <h3>Total Users</h3>
    <p>{{totalUsers}}</p>
  </div>
  <div class="metric">
    <h3>Revenue</h3>
    <p>${{revenue}}</p>
  </div>
  <div class="metric">
    <h3>Growth</h3>
    <p>{{growth}}%</p>
  </div>
</div>
```

### saveFile

Asynchronously saves content to a file in the filesystem.

**Import:**
```typescript
import { saveFile } from '@mjs/utils';
```

**Signature:**
```typescript
function saveFile(path: string, content: string): Promise<void>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | The path where to save the file |
| `content` | `string` | The content to write to the file |

**Usage Examples:**

```typescript
// Save processed data
async function saveProcessedData(data: any, filename: string) {
  const jsonContent = JSON.stringify(data, null, 2);
  await saveFile(`./output/${filename}.json`, jsonContent);
}

// Save generated report
async function generateAndSaveReport(reportData: ReportData) {
  const report = await getPrompt('./templates/report.hbs', {
    date: new Date().toISOString(),
    ...reportData
  });
  
  const filename = `report-${Date.now()}.html`;
  await saveFile(`./reports/${filename}`, report);
  
  return filename;
}

// Save configuration
async function updateConfiguration(updates: Partial<AppConfig>) {
  const currentConfig = await getFile('./config/app.json');
  const config = { ...JSON.parse(currentConfig), ...updates };
  
  await saveFile('./config/app.json', JSON.stringify(config, null, 2));
}

// Backup file before overwriting
async function safeFileSave(path: string, content: string) {
  try {
    // Create backup
    const existingContent = await getFile(path);
    await saveFile(`${path}.backup`, existingContent);
  } catch (error) {
    // File doesn't exist, no backup needed
  }
  
  // Save new content
  await saveFile(path, content);
}
```

---

## Translation Utilities

### translateAndSave (Function)

Translates content using Google's Gemini AI and optionally saves the result to a file.

**Import:**
```typescript
import { translateAndSave } from '@mjs/utils';
```

**Signature:**
```typescript
function translateAndSave(
  language: string,
  prompt: string,
  sourceFile: string | null,
  destinationFile?: string,
  options?: {
    perf?: boolean;
    mimeType?: string;
  }
): Promise<string | undefined>
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `language` | `string` | - | Target language for translation |
| `prompt` | `string` | - | System prompt for the AI translator |
| `sourceFile` | `string \| null` | - | Path to source file to translate |
| `destinationFile` | `string` | - | Path to save translated content (optional) |
| `options.perf` | `boolean` | `true` | Whether to log performance metrics |
| `options.mimeType` | `string` | `'text/plain'` | MIME type of the content |

**Usage Examples:**

```typescript
// Translate documentation
async function translateDocumentation() {
  const translatedContent = await translateAndSave(
    'Spanish',
    'Translate this technical documentation maintaining all formatting and code examples',
    './docs/api-guide.md',
    './docs/es/api-guide.md',
    { 
      mimeType: 'text/markdown',
      perf: true 
    }
  );
  
  console.log('Documentation translated to Spanish');
}

// Translate email template
async function translateEmailTemplate(targetLanguage: string) {
  return await translateAndSave(
    targetLanguage,
    'Translate this email template maintaining HTML structure and professional tone',
    './templates/welcome-email.html',
    `./templates/welcome-email-${targetLanguage.toLowerCase()}.html`,
    { 
      mimeType: 'text/html',
      perf: false 
    }
  );
}

// Batch translation
async function translateAllContent(languages: string[]) {
  const sourceFiles = [
    './content/about.md',
    './content/features.md',
    './content/pricing.md'
  ];
  
  for (const language of languages) {
    for (const sourceFile of sourceFiles) {
      const fileName = sourceFile.split('/').pop()?.replace('.md', '');
      const destinationFile = `./content/${language}/${fileName}.md`;
      
      await translateAndSave(
        language,
        'Translate this marketing content maintaining persuasive tone and formatting',
        sourceFile,
        destinationFile,
        { mimeType: 'text/markdown' }
      );
      
      // Add delay to respect API limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
```

### Translator Class

Advanced translator class with text cleaning capabilities and better control over the translation process.

**Import:**
```typescript
import { Translator } from '@mjs/utils';
```

**Constructor:**
```typescript
const translator = new Translator(apiKey: string);
```

**Methods:**

#### translateAndSave()
Same interface as the function version but with automatic text cleaning.

#### cleanText()
Cleans translated text by removing formatting artifacts.

**Signature:**
```typescript
cleanText(content: string, extension?: string): string
```

**Usage Examples:**

```typescript
// Initialize translator
const translator = new Translator(process.env.GOOGLE_AI_API_KEY!);

// Advanced translation with cleaning
async function translateWithCleaning() {
  const result = await translator.translateAndSave(
    'French',
    'Translate this API documentation maintaining technical accuracy',
    './docs/api-reference.md',
    './docs/fr/api-reference.md',
    { 
      mimeType: 'text/markdown',
      perf: true 
    }
  );
  
  console.log('Translation completed with automatic cleaning');
}

// Manual text cleaning
function processTranslatedContent(content: string, fileType: string) {
  const cleaned = translator.cleanText(content, fileType);
  
  // Additional custom processing
  const processed = cleaned
    .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
    .trim();
    
  return processed;
}

// Batch processing with different file types
async function batchTranslate(files: Array<{path: string, type: string}>) {
  for (const file of files) {
    const result = await translator.translateAndSave(
      'German',
      `Translate this ${file.type} content professionally`,
      file.path,
      file.path.replace('/en/', '/de/'),
      { 
        mimeType: `text/${file.type}`,
        perf: false
      }
    );
    
    if (result) {
      console.log(`Translated ${file.path} successfully`);
    }
  }
}
```

**Text Cleaning Features:**

The `cleanText` method automatically:
- Removes wrapping code blocks (```txt, ```md, etc.)
- Handles frontmatter delimiters for markdown files
- Strips trailing empty lines
- Preserves original formatting when possible
- Handles different file extensions appropriately

---

## UI Utilities

### cn Function

Utility function for conditional class name concatenation using `clsx` and `tailwind-merge`.

**Import:**
```typescript
import { cn } from '@mjs/ui/lib/utils';
```

**Signature:**
```typescript
function cn(...inputs: ClassValue[]): string
```

**Usage Examples:**

```typescript
// Basic conditional classes
const buttonClass = cn(
  'px-4 py-2 rounded', // base classes
  variant === 'primary' && 'bg-blue-500 text-white',
  variant === 'secondary' && 'bg-gray-200 text-gray-800',
  disabled && 'opacity-50 cursor-not-allowed',
  className // additional classes from props
);

// Complex component styling
function Card({ children, variant, size, className, ...props }) {
  return (
    <div
      className={cn(
        // Base styles
        'bg-white rounded-lg shadow-sm border',
        
        // Variant styles
        {
          'border-gray-200': variant === 'default',
          'border-blue-200 bg-blue-50': variant === 'info',
          'border-red-200 bg-red-50': variant === 'error',
          'border-green-200 bg-green-50': variant === 'success',
        },
        
        // Size styles
        {
          'p-4': size === 'sm',
          'p-6': size === 'md',
          'p-8': size === 'lg',
        },
        
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Responsive classes
const gridClass = cn(
  'grid gap-4',
  'grid-cols-1',
  'sm:grid-cols-2',
  'md:grid-cols-3',
  'lg:grid-cols-4',
  isMobile && 'grid-cols-1',
  hasLargeItems && 'lg:grid-cols-2'
);

// State-based styling
function InteractiveButton({ isPressed, isHovered, isActive }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded transition-colors',
        'bg-gray-100 text-gray-800',
        'hover:bg-gray-200',
        'active:bg-gray-300',
        isPressed && 'bg-gray-300',
        isHovered && 'bg-gray-200',
        isActive && 'bg-blue-500 text-white'
      )}
    >
      Click me
    </button>
  );
}
```

### Color System

**Import:**
```typescript
import { colors } from '@mjs/ui/lib/colors';
```

**Usage Examples:**

```typescript
// Access design system colors
const theme = {
  primary: colors.primary[500],
  primaryHover: colors.primary[600],
  secondary: colors.secondary[300],
  accent: colors.accent[400],
  text: colors.gray[900],
  textMuted: colors.gray[600],
};

// Dynamic color selection
function getStatusColor(status: string) {
  const statusColors = {
    success: colors.green[500],
    warning: colors.yellow[500],
    error: colors.red[500],
    info: colors.blue[500],
  };
  
  return statusColors[status] || colors.gray[500];
}

// Custom CSS properties
function createThemeVariables(isDark: boolean) {
  const colorScheme = isDark ? 'dark' : 'light';
  
  return {
    '--color-primary': colors.primary[isDark ? 400 : 600],
    '--color-background': colors.gray[isDark ? 900 : 50],
    '--color-text': colors.gray[isDark ? 100 : 900],
  };
}
```

---

## Styling Utilities

### Responsive Design Helpers

```typescript
// Breakpoint utilities
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Media query helper
export function createMediaQuery(minWidth: string) {
  return `@media (min-width: ${minWidth})`;
}

// Usage
const styles = {
  container: cn(
    'w-full px-4',
    'sm:px-6',
    'lg:px-8',
    'xl:max-w-7xl xl:mx-auto'
  ),
  
  grid: cn(
    'grid gap-4',
    'grid-cols-1',
    'sm:grid-cols-2',
    'lg:grid-cols-3',
    'xl:grid-cols-4'
  )
};
```

### Animation Utilities

```typescript
// Animation classes
export const animations = {
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-300',
  slideIn: 'animate-in slide-in-from-bottom duration-300',
  slideOut: 'animate-out slide-out-to-bottom duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-300',
  scaleOut: 'animate-out zoom-out-95 duration-300',
};

// Usage in components
function Modal({ isOpen, children }) {
  return (
    <div className={cn(
      'fixed inset-0 z-50',
      isOpen ? animations.fadeIn : animations.fadeOut
    )}>
      <div className={cn(
        'absolute inset-0 bg-black/50',
        isOpen ? animations.fadeIn : animations.fadeOut
      )} />
      <div className={cn(
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'bg-white rounded-lg p-6',
        isOpen ? animations.scaleIn : animations.scaleOut
      )}>
        {children}
      </div>
    </div>
  );
}
```

---

## Helper Functions

### Type Guards

```typescript
// Type checking utilities
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

// Usage
function processData(data: unknown) {
  if (isArray(data)) {
    return data.map(item => processItem(item));
  }
  
  if (isObject(data)) {
    return processObject(data);
  }
  
  throw new Error('Invalid data format');
}
```

### Formatting Utilities

```typescript
// Date formatting
export function formatDate(date: Date | string, locale = 'en-US'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

// Currency formatting
export function formatCurrency(
  amount: number, 
  currency = 'USD', 
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

// Number formatting
export function formatNumber(
  number: number, 
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat('en-US', options).format(number);
}

// File size formatting
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

// Usage examples
const examples = {
  date: formatDate(new Date()), // "January 15, 2024"
  currency: formatCurrency(1234.56), // "$1,234.56"
  percentage: formatNumber(0.856, { style: 'percent' }), // "85.6%"
  fileSize: formatFileSize(1536000), // "1.5 MB"
};
```

### Validation Utilities

```typescript
// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Phone number validation (basic)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

// Password strength validation
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

### Async Utilities

```typescript
// Delay utility
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry utility
export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < attempts - 1) {
        await delay(delayMs * Math.pow(2, i)); // Exponential backoff
      }
    }
  }
  
  throw lastError!;
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage examples
const debouncedSearch = debounce((query: string) => {
  performSearch(query);
}, 300);

const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 100);

// Retry API call
const fetchWithRetry = () => retry(
  () => fetch('/api/data').then(res => res.json()),
  3,
  1000
);
```

---

## Best Practices

### 1. File Operations

```typescript
// ✅ Always handle errors
async function safeFileOperation() {
  try {
    const content = await getFile('./important-file.txt');
    return content;
  } catch (error) {
    console.error('File operation failed:', error);
    return null;
  }
}

// ✅ Use proper paths
const configPath = path.join(process.cwd(), 'config', 'app.json');
const content = await getFile(configPath);

// ✅ Validate file existence
import { access } from 'fs/promises';

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
```

### 2. Translation Best Practices

```typescript
// ✅ Use descriptive prompts
const prompt = `
Translate this user interface text from English to ${targetLanguage}.
Maintain:
- Professional tone
- Technical accuracy
- UI context appropriateness
- Character limits for buttons and labels
`;

// ✅ Handle translation errors gracefully
async function safeTranslate(text: string, language: string) {
  try {
    return await translateAndSave(language, prompt, null, undefined, {
      perf: false
    });
  } catch (error) {
    console.warn(`Translation failed for ${language}, using fallback`);
    return text; // Return original text as fallback
  }
}

// ✅ Batch process with rate limiting
async function batchTranslate(items: string[], language: string) {
  const results = [];
  
  for (const item of items) {
    const translated = await safeTranslate(item, language);
    results.push(translated);
    
    // Rate limiting
    await delay(1000);
  }
  
  return results;
}
```

### 3. Styling Utilities

```typescript
// ✅ Use consistent naming
const componentVariants = {
  size: {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  },
  variant: {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-800',
  },
};

// ✅ Create reusable utility functions
function createButtonClass(variant: string, size: string, className?: string) {
  return cn(
    'inline-flex items-center justify-center rounded-md font-medium',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    componentVariants.size[size],
    componentVariants.variant[variant],
    className
  );
}
```

### 4. Type Safety

```typescript
// ✅ Use proper TypeScript types
interface TranslationOptions {
  sourceLanguage?: string;
  targetLanguage: string;
  preserveFormatting?: boolean;
  customPrompt?: string;
}

async function translateContent(
  content: string,
  options: TranslationOptions
): Promise<string> {
  // Implementation with type safety
}

// ✅ Export types for consumers
export type { TranslationOptions };
export type ClassValue = string | number | boolean | undefined | null;
export type FileExtension = 'md' | 'html' | 'txt' | 'json';
```

### 5. Error Handling

```typescript
// ✅ Create custom error classes
class FileOperationError extends Error {
  constructor(operation: string, path: string, cause?: Error) {
    super(`${operation} failed for file: ${path}`);
    this.name = 'FileOperationError';
    this.cause = cause;
  }
}

class TranslationError extends Error {
  constructor(language: string, cause?: Error) {
    super(`Translation to ${language} failed`);
    this.name = 'TranslationError';
    this.cause = cause;
  }
}

// ✅ Use proper error handling
async function robustFileOperation(path: string) {
  try {
    return await getFile(path);
  } catch (error) {
    throw new FileOperationError('read', path, error as Error);
  }
}
```

### 6. Performance Optimization

```typescript
// ✅ Cache frequently used values
const memoizedFormatters = new Map<string, Intl.DateTimeFormat>();

function getCachedFormatter(locale: string): Intl.DateTimeFormat {
  if (!memoizedFormatters.has(locale)) {
    memoizedFormatters.set(locale, new Intl.DateTimeFormat(locale));
  }
  return memoizedFormatters.get(locale)!;
}

// ✅ Use efficient string operations
function optimizedClassNames(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ✅ Lazy load heavy utilities
const heavyUtility = lazy(() => import('./heavy-utility'));