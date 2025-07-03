# API Documentation

## Overview

This documentation covers all public APIs, functions, and components in the MJS monorepo. The project is organized as follows:

- **@mjs/ui** - Reusable UI components, primitives, and hooks
- **@mjs/utils** - Utility functions for file handling and translation
- **Web App** - Main application with business-specific components

## Table of Contents

1. [UI Package](#ui-package)
   - [Primitives](#primitives)
   - [Components](#components)
   - [Hooks](#hooks)
2. [Utils Package](#utils-package)
   - [File Operations](#file-operations)
   - [Translation](#translation)
3. [Web App Components](#web-app-components)

---

## UI Package

### Primitives

#### Button

A versatile button component with multiple variants and sizes.

**Import:**
```typescript
import { Button } from '@mjs/ui/primitives/button';
```

**Props:**
- `variant`: `'default' | 'destructive' | 'outline' | 'outlinePrimary' | 'outlineSecondary' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'link'`
- `size`: `'default' | 'sm' | 'lg' | 'xl' | 'icon'`
- `loading`: `boolean` - Shows loading spinner when true
- `asChild`: `boolean` - Renders as child element using Radix Slot

**Example:**
```tsx
import { Button } from '@mjs/ui/primitives/button';

function MyComponent() {
  return (
    <div>
      <Button variant="primary" size="lg">
        Primary Button
      </Button>
      <Button variant="outline" loading>
        Loading Button
      </Button>
    </div>
  );
}
```

#### Toast System

A comprehensive toast notification system.

**Import:**
```typescript
import { useToast } from '@mjs/ui/primitives/use-toast';
import { Toaster } from '@mjs/ui/primitives/toaster';
```

**Hook Usage:**
```tsx
import { useToast } from '@mjs/ui/primitives/use-toast';

function MyComponent() {
  const { toast } = useToast();
  
  const showToast = () => {
    toast({
      title: "Success!",
      description: "Your action was completed successfully.",
    });
  };
  
  return <button onClick={showToast}>Show Toast</button>;
}
```

**Setup:**
```tsx
// Add to your app root
import { Toaster } from '@mjs/ui/primitives/toaster';

function App() {
  return (
    <div>
      {/* Your app content */}
      <Toaster />
    </div>
  );
}
```

#### Form Components

##### Input
```tsx
import { Input } from '@mjs/ui/primitives/input';

<Input 
  type="email" 
  placeholder="Enter your email"
  className="w-full"
/>
```

##### Textarea
```tsx
import { Textarea } from '@mjs/ui/primitives/textarea';

<Textarea 
  placeholder="Enter your message"
  rows={4}
/>
```

##### Select
```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@mjs/ui/primitives/select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

##### FormInput
Advanced form input with built-in validation and styling.

```tsx
import { FormInput } from '@mjs/ui/primitives/form-input';

<FormInput
  label="Email Address"
  type="email"
  required
  placeholder="Enter your email"
  helpText="We'll never share your email"
/>
```

#### Layout Components

##### Card
```tsx
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@mjs/ui/primitives/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

##### Separator
```tsx
import { Separator } from '@mjs/ui/primitives/separator';

<div>
  <p>Above separator</p>
  <Separator className="my-4" />
  <p>Below separator</p>
</div>
```

#### Navigation Components

##### Tabs
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@mjs/ui/primitives/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for tab 1</TabsContent>
  <TabsContent value="tab2">Content for tab 2</TabsContent>
</Tabs>
```

##### Breadcrumb
```tsx
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@mjs/ui/primitives/breadcrumb';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/products">Products</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

##### Pagination
```tsx
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@mjs/ui/primitives/pagination';

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

#### Data Display Components

##### Avatar
```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@mjs/ui/primitives/avatar';

<Avatar>
  <AvatarImage src="/path/to/image.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

##### Badge
```tsx
import { Badge } from '@mjs/ui/primitives/badge';

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

##### Progress
```tsx
import { Progress } from '@mjs/ui/primitives/progress';

<Progress value={60} className="w-full" />
```

##### Skeleton
```tsx
import { Skeleton } from '@mjs/ui/primitives/skeleton';

<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

#### Interactive Components

##### Dialog
```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@mjs/ui/primitives/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <p>Dialog content goes here</p>
  </DialogContent>
</Dialog>
```

##### Alert Dialog
```tsx
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@mjs/ui/primitives/alert-dialog';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

##### Popover
```tsx
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@mjs/ui/primitives/popover';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Popover content goes here</p>
  </PopoverContent>
</Popover>
```

##### Tooltip
```tsx
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@mjs/ui/primitives/tooltip';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Tooltip content</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

#### Form Components

##### Checkbox
```tsx
import { Checkbox } from '@mjs/ui/primitives/checkbox';

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms">Accept terms and conditions</label>
</div>
```

##### Radio Group
```tsx
import { RadioGroup, RadioGroupItem } from '@mjs/ui/primitives/radio-group';
import { Label } from '@mjs/ui/primitives/label';

<RadioGroup defaultValue="option1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="option2" />
    <Label htmlFor="option2">Option 2</Label>
  </div>
</RadioGroup>
```

##### Switch
```tsx
import { Switch } from '@mjs/ui/primitives/switch';

<div className="flex items-center space-x-2">
  <Switch id="notifications" />
  <label htmlFor="notifications">Enable notifications</label>
</div>
```

##### Slider
```tsx
import { Slider } from '@mjs/ui/primitives/slider';

<Slider
  defaultValue={[50]}
  max={100}
  min={0}
  step={1}
  className="w-full"
/>
```

#### Mobile Utility

##### useIsMobile Hook
```tsx
import { useIsMobile } from '@mjs/ui/primitives/use-mobile';

function ResponsiveComponent() {
  const isMobile = useIsMobile();
  
  return (
    <div>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
```

### Components

#### Text Animations

##### TextAnimate
Advanced text animation component with multiple animation types.

```tsx
import { TextAnimate } from '@mjs/ui/components/text-animate';

<TextAnimate
  text="Animated Text"
  type="fadeInUp"
  duration={1000}
  delay={200}
/>
```

**Available animation types:**
- `fadeIn`
- `fadeInUp`
- `fadeInDown`
- `fadeInLeft`
- `fadeInRight`
- `slideInUp`
- `slideInDown`
- `typewriter`
- `wave`

##### AuroraText
Text with animated aurora/gradient effect.

```tsx
import { AuroraText } from '@mjs/ui/components/aurora-text';

<AuroraText>
  Beautiful Aurora Text
</AuroraText>
```

#### Interactive Buttons

##### ShinyButton
Button with animated shiny effect.

```tsx
import { ShinyButton } from '@mjs/ui/components/shiny-button';

<ShinyButton>
  Shiny Button
</ShinyButton>
```

##### ShimmerButton
Button with shimmer animation effect.

```tsx
import { ShimmerButton } from '@mjs/ui/components/shimmer-button';

<ShimmerButton>
  Shimmer Button
</ShimmerButton>
```

##### InteractiveHoverButton
Button with interactive hover animations.

```tsx
import { InteractiveHoverButton } from '@mjs/ui/components/interactive-hover-button';

<InteractiveHoverButton>
  Interactive Button
</InteractiveHoverButton>
```

##### RainbowButton
Button with animated rainbow border effect.

```tsx
import { RainbowButton } from '@mjs/ui/components/rainbow-button';

<RainbowButton>
  Rainbow Button
</RainbowButton>
```

#### Layout Components

##### Cards
Multiple card component variations.

```tsx
import { ExampleCard, Card, GlassyCard } from '@mjs/ui/components/cards';

// Basic example card
<ExampleCard
  title="Card Title"
  description="Card description"
  icon={<SomeIcon />}
/>

// Custom card
<Card className="p-6">
  <h3>Custom Card</h3>
  <p>Custom content</p>
</Card>

// Glassmorphism card
<GlassyCard>
  <p>Glassy card content</p>
</GlassyCard>
```

#### Background Effects

##### SoftBg
Soft gradient background component.

```tsx
import { SoftBg } from '@mjs/ui/primitives/soft-bg';

<SoftBg
  variant="primary"
  intensity="medium"
  className="relative"
>
  <div>Content with soft background</div>
</SoftBg>
```

##### GlowBg
Glowing background effect component.

```tsx
import { GlowBg } from '@mjs/ui/primitives/glow-bg';

<GlowBg
  color="blue"
  size="large"
  className="relative"
>
  <div>Content with glow effect</div>
</GlowBg>
```

##### BackdropImage
Image component with backdrop effects.

```tsx
import BackdropImage from '@mjs/ui/primitives/backdrop-image';

<BackdropImage
  src="/path/to/image.jpg"
  alt="Description"
  className="w-full h-96"
  effect="blur"
/>
```

#### Motion Components

##### Animation Wrappers
```tsx
import { EnterAnimation, FadeAnimation } from '@mjs/ui/components/motion';

<EnterAnimation
  delay={0.2}
  duration={0.8}
  direction="up"
>
  <div>Animated content</div>
</EnterAnimation>

<FadeAnimation
  trigger="scroll"
  threshold={0.1}
>
  <div>Fade in on scroll</div>
</FadeAnimation>
```

#### Utility Components

##### ScrollProgress
Shows scroll progress indicator.

```tsx
import { ScrollProgress } from '@mjs/ui/components/scroll-progress';

<ScrollProgress className="fixed top-0 left-0 right-0 z-50" />
```

##### ThemeSwitcher
Theme toggle component.

```tsx
import { ThemeSwitcher } from '@mjs/ui/components/theme-switcher';

<ThemeSwitcher />
```

##### Icons
Comprehensive icon set.

```tsx
import { Icons } from '@mjs/ui/components/icons';

<Icons.loader className="animate-spin" />
<Icons.home />
<Icons.user />
<Icons.settings />
// ... many more icons available
```

##### SocialFooter
Social media links footer component.

```tsx
import { SocialFooter } from '@mjs/ui/components/socials';

<SocialFooter
  config={{
    github: "https://github.com/username",
    twitter: "https://twitter.com/username",
    linkedin: "https://linkedin.com/in/username"
  }}
  className="mt-8"
/>
```

### Hooks

#### useActiveLink
Hook for managing active navigation links.

```tsx
import { useActiveLink, ActiveLinkProvider } from '@mjs/ui/hooks/use-active-link';

// Wrap your app with the provider
function App() {
  return (
    <ActiveLinkProvider>
      <Navigation />
    </ActiveLinkProvider>
  );
}

// Use in components
function NavigationLink({ href, children }) {
  const { isActive, setActiveLink } = useActiveLink();
  
  return (
    <a
      href={href}
      className={isActive(href) ? 'active' : ''}
      onClick={() => setActiveLink(href)}
    >
      {children}
    </a>
  );
}
```

#### useActionListener
Hook for listening to keyboard and other actions.

```tsx
import { useActionListener } from '@mjs/ui/hooks/use-action-listener';

function MyComponent() {
  useActionListener('keydown', (event) => {
    if (event.key === 'Escape') {
      // Handle escape key
    }
  });
  
  return <div>Component content</div>;
}
```

#### useHash
Hook for managing URL hash state.

```tsx
import { useHash } from '@mjs/ui/hooks/use-hash';

function MyComponent() {
  const [hash, setHash] = useHash();
  
  return (
    <div>
      <p>Current hash: {hash}</p>
      <button onClick={() => setHash('#section1')}>
        Go to Section 1
      </button>
    </div>
  );
}
```

#### useLocale
Hook for accessing locale information.

```tsx
import { useLocale } from '@mjs/ui/hooks/use-locale';

function MyComponent() {
  const locale = useLocale('en', ['en', 'es', 'fr']);
  
  return <div>Current locale: {locale}</div>;
}
```

#### useIsMobile
Hook for detecting mobile devices.

```tsx
import { useIsMobile } from '@mjs/ui/hooks/use-mobile';

function ResponsiveComponent() {
  const isMobile = useIsMobile();
  
  return (
    <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
      Content
    </div>
  );
}
```

---

## Utils Package

### File Operations

#### getFile
Asynchronously reads a file from the filesystem.

```typescript
import { getFile } from '@mjs/utils';

async function loadTemplate() {
  try {
    const content = await getFile('/path/to/template.html');
    console.log(content);
  } catch (error) {
    console.error('Failed to load file:', error);
  }
}
```

**Parameters:**
- `path` (string): The path to the file to read

**Returns:**
- `Promise<string>`: The file content as a string

**Throws:**
- `Error`: If the file doesn't exist or cannot be read

#### getPrompt
Reads a template file and compiles it with variables using Handlebars.

```typescript
import { getPrompt } from '@mjs/utils';

async function generatePrompt() {
  const prompt = await getPrompt('/templates/email.hbs', {
    name: 'John Doe',
    product: 'Premium Plan',
    date: new Date().toLocaleDateString()
  });
  
  console.log(prompt);
}
```

**Parameters:**
- `promptPath` (string): Path to the template file
- `variables` (Record<string, string>): Object containing template variables

**Returns:**
- `Promise<string>`: Compiled template with variables replaced

#### saveFile
Asynchronously saves content to a file.

```typescript
import { saveFile } from '@mjs/utils';

async function saveReport() {
  const report = generateReport();
  await saveFile('/reports/monthly-report.txt', report);
}
```

**Parameters:**
- `path` (string): The path where to save the file
- `content` (string): The content to write to the file

### Translation

#### translateAndSave (Function)
Translates content using Google's Gemini AI and optionally saves to file.

```typescript
import { translateAndSave } from '@mjs/utils';

async function translateDocument() {
  const translatedText = await translateAndSave(
    'Spanish',
    'Translate this document professionally',
    '/docs/english-doc.md',
    '/docs/spanish-doc.md',
    { 
      perf: true, 
      mimeType: 'text/markdown' 
    }
  );
  
  console.log('Translation completed:', translatedText);
}
```

**Parameters:**
- `language` (string): Target language for translation
- `prompt` (string): System prompt for the AI translator
- `sourceFile` (string | null): Path to source file to translate
- `destinationFile` (string, optional): Path to save translated content
- `options` (object, optional):
  - `perf` (boolean): Whether to log performance metrics (default: true)
  - `mimeType` (string): MIME type of the content (default: 'text/plain')

**Returns:**
- `Promise<string | undefined>`: The translated text

#### Translator Class
Class-based translator with advanced text cleaning capabilities.

```typescript
import { Translator } from '@mjs/utils';

// Initialize translator
const translator = new Translator(process.env.GOOGLE_AI_API_KEY);

// Translate content
async function translateWithClass() {
  const result = await translator.translateAndSave(
    'French',
    'Translate this technical documentation',
    '/docs/api-docs.md',
    '/docs/api-docs-fr.md',
    { 
      mimeType: 'text/markdown',
      perf: true 
    }
  );
  
  console.log('Translation result:', result);
}
```

**Methods:**

##### constructor(apiKey: string)
Creates a new Translator instance.

##### translateAndSave()
Same parameters as the function version, but with automatic text cleaning.

##### cleanText(content: string, extension?: string)
Cleans translated text by removing code blocks and formatting artifacts.

**Text Cleaning Features:**
- Removes wrapping code blocks (```txt, ```md, etc.)
- Handles frontmatter delimiters
- Strips trailing empty lines
- Preserves original formatting when possible

---

## Web App Components

### Navigation Components

#### Header
Main application header with navigation.

```tsx
import { Header } from '@/components/Header';

<Header />
```

#### MobileNav
Mobile navigation component.

```tsx
import { MobileNav } from '@/components/MobileNav';

<MobileNav />
```

#### Footer
Application footer component.

```tsx
import { Footer } from '@/components/Footer';

<Footer />
```

#### ActiveLink
Navigation link with active state management.

```tsx
import { ActiveLink } from '@/components/ActiveLink';

<ActiveLink href="/products" activeClassName="text-primary">
  Products
</ActiveLink>
```

### UI Components

#### LocaleSwitcher
Language/locale switching component.

```tsx
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

<LocaleSwitcher />
```

#### ThemeSwitch
Theme toggle switch.

```tsx
import { ThemeSwitch } from '@/components/ThemeSwitch';

<ThemeSwitch />
```

#### SearchProvider
Search functionality provider.

```tsx
import { SearchProvider } from '@/components/SearchProvider';

<SearchProvider>
  <App />
</SearchProvider>
```

### Content Components

#### PageTitle
Standard page title component.

```tsx
import { PageTitle } from '@/components/PageTitle';

<PageTitle>Page Title</PageTitle>
```

#### SectionContainer
Container for page sections.

```tsx
import { SectionContainer } from '@/components/SectionContainer';

<SectionContainer>
  <div>Section content</div>
</SectionContainer>
```

#### HeroText
Hero section text component.

```tsx
import { HeroText } from '@/components/HeroText';

<HeroText
  title="Welcome to Our Platform"
  subtitle="Build amazing things"
/>
```

### Media Components

#### Image
Optimized image component.

```tsx
import { Image } from '@/components/Image';

<Image
  src="/images/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
/>
```

#### VideoBackground
Background video component.

```tsx
import { VideoBackground } from '@/components/VideoBackground';

<VideoBackground
  src="/videos/background.mp4"
  poster="/images/video-poster.jpg"
>
  <div>Content over video</div>
</VideoBackground>
```

#### VideoPlayer
Video player component.

```tsx
import { VideoPlayer } from '@/components/VideoPlayer';

<VideoPlayer
  src="/videos/demo.mp4"
  poster="/images/video-poster.jpg"
  controls
  autoPlay={false}
/>
```

### Interactive Components

#### ContactForm
Contact form component.

```tsx
import { ContactForm } from '@/components/ContactForm';

<ContactForm
  onSubmit={handleSubmit}
  className="max-w-md mx-auto"
/>
```

#### Altcha
CAPTCHA component integration.

```tsx
import { Altcha } from '@/components/Altcha';

<Altcha
  onVerify={handleVerification}
  challengeUrl="/api/altcha/challenge"
/>
```

#### ScrollTop
Scroll to top button.

```tsx
import { ScrollTop } from '@/components/ScrollTop';

<ScrollTop />
```

### Feature Components

#### GameVariants
Game variants display component.

```tsx
import { GameVariants } from '@/components/GameVariants';

<GameVariants />
```

#### IngameFeatures
In-game features showcase.

```tsx
import { IngameFeatures } from '@/components/IngameFeatures';

<IngameFeatures />
```

#### CharactersCarousel
Character showcase carousel.

```tsx
import { CharactersCarousel } from '@/components/CharactersCarousel';

<CharactersCarousel />
```

### Utility Components

#### JsonLd
JSON-LD structured data component.

```tsx
import { JsonLd } from '@/components/JsonLd';

<JsonLd
  data={{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Company Name"
  }}
/>
```

#### PostHogProvider
Analytics provider component.

```tsx
import { PostHogProvider } from '@/components/PostHogProvider';

<PostHogProvider>
  <App />
</PostHogProvider>
```

#### MDXComponents
MDX components configuration.

```tsx
import { MDXComponents } from '@/components/MDXComponents';

// Used in mdx-components.tsx
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Custom components
  }
}
```

### Support Components

#### FooterSupportButton
Support button for footer.

```tsx
import { FooterSupportButton } from '@/components/FooterSupportButton';

<FooterSupportButton />
```

#### WebSupportDetector
Web support detection component.

```tsx
import { WebSupportDetector } from '@/components/WebSupportDetector';

<WebSupportDetector>
  <App />
</WebSupportDetector>
```

---

## Styling and Utilities

### CSS Utilities

#### cn Function
Utility for conditional class names.

```typescript
import { cn } from '@mjs/ui/lib/utils';

const buttonClass = cn(
  'base-button-class',
  variant === 'primary' && 'primary-variant',
  disabled && 'disabled-state',
  className
);
```

### Color System

```typescript
import { colors } from '@mjs/ui/lib/colors';

// Access design system colors
const primaryColor = colors.primary[500];
const accentColor = colors.accent[300];
```

---

## Best Practices

### Component Usage

1. **Import Components**: Always import components from their specific paths for better tree-shaking
2. **TypeScript**: All components are fully typed - use TypeScript for better development experience
3. **Styling**: Use the provided variants and size props before applying custom styles
4. **Accessibility**: Components include built-in accessibility features - preserve them when customizing

### Performance

1. **Lazy Loading**: Use dynamic imports for large components
2. **Memoization**: Wrap expensive components in React.memo when needed
3. **Bundle Size**: Import only the components you need

### Customization

1. **CSS Variables**: Use CSS custom properties for theme customization
2. **Tailwind**: Extend the Tailwind config for design system consistency
3. **Variants**: Use the built-in variant system before creating custom styles

---

## Examples and Patterns

### Form Example

```tsx
import { Button } from '@mjs/ui/primitives/button';
import { Input } from '@mjs/ui/primitives/input';
import { Label } from '@mjs/ui/primitives/label';
import { Card, CardContent, CardHeader, CardTitle } from '@mjs/ui/primitives/card';
import { useToast } from '@mjs/ui/primitives/use-toast';

function ContactForm() {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Form submitted!",
      description: "We'll get back to you soon.",
    });
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Dashboard Layout Example

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@mjs/ui/primitives/card';
import { Badge } from '@mjs/ui/primitives/badge';
import { Progress } from '@mjs/ui/primitives/progress';
import { Separator } from '@mjs/ui/primitives/separator';

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Badge variant="secondary">+12%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Badge variant="default">+8%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,847</div>
            <Progress value={62} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Badge variant="outline">Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <Progress value={89} className="mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## Support and Contributing

For issues, feature requests, or contributions, please refer to the project's repository. All components are built with accessibility, performance, and developer experience in mind.