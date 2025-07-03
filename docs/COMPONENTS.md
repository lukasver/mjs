# Component Documentation

This document provides detailed information about all UI components in the @mjs/ui package, including comprehensive prop tables, examples, and usage patterns.

## Table of Contents

1. [Primitive Components](#primitive-components)
2. [Enhanced Components](#enhanced-components)
3. [Layout Components](#layout-components)
4. [Form Components](#form-components)
5. [Feedback Components](#feedback-components)
6. [Navigation Components](#navigation-components)
7. [Media Components](#media-components)

---

## Primitive Components

### Button

A versatile button component built on Radix UI primitives with extensive customization options.

**Import:**
```typescript
import { Button, buttonVariants } from '@mjs/ui/primitives/button';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'outlinePrimary' \| 'outlineSecondary' \| 'primary' \| 'secondary' \| 'accent' \| 'ghost' \| 'link'` | `'default'` | Button style variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'xl' \| 'icon'` | `'default'` | Button size |
| `loading` | `boolean` | `false` | Shows loading spinner when true |
| `asChild` | `boolean` | `false` | Renders as child element using Radix Slot |
| `className` | `string` | - | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disables the button |

**Examples:**

```tsx
// Basic usage
<Button>Click me</Button>

// Different variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outlined</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link Style</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
<Button size="icon">🏠</Button>

// Loading state
<Button loading>Processing...</Button>

// As a link
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>

// Custom styling
<Button 
  variant="outline" 
  size="lg"
  className="border-dashed hover:bg-blue-50"
>
  Custom Button
</Button>
```

### Input

A styled input component with support for various types and states.

**Import:**
```typescript
import { Input } from '@mjs/ui/primitives/input';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | HTML input type |
| `placeholder` | `string` | - | Placeholder text |
| `disabled` | `boolean` | `false` | Disables the input |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `InputHTMLAttributes` | - | All standard input props |

**Examples:**

```tsx
// Basic input
<Input placeholder="Enter your name" />

// Different types
<Input type="email" placeholder="email@example.com" />
<Input type="password" placeholder="Enter password" />
<Input type="number" placeholder="Enter age" />
<Input type="tel" placeholder="Phone number" />

// Disabled state
<Input placeholder="Disabled input" disabled />

// With validation styling
<Input 
  placeholder="Email address" 
  className="border-red-500 focus:border-red-500" 
/>
```

### Textarea

A resizable textarea component with consistent styling.

**Import:**
```typescript
import { Textarea } from '@mjs/ui/primitives/textarea';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | - | Placeholder text |
| `disabled` | `boolean` | `false` | Disables the textarea |
| `rows` | `number` | `3` | Number of visible rows |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `TextareaHTMLAttributes` | - | All standard textarea props |

**Examples:**

```tsx
// Basic textarea
<Textarea placeholder="Enter your message" />

// Custom rows
<Textarea 
  placeholder="Long message" 
  rows={6}
/>

// Disabled state
<Textarea 
  placeholder="Read-only content" 
  disabled 
  value="This cannot be edited"
/>
```

### Card

A flexible card component for content containers.

**Import:**
```typescript
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@mjs/ui/primitives/card';
```

**Props:**

| Component | Props | Description |
|-----------|-------|-------------|
| `Card` | `className`, `...props` | Main card container |
| `CardHeader` | `className`, `...props` | Header section |
| `CardTitle` | `className`, `...props` | Title text |
| `CardDescription` | `className`, `...props` | Description text |
| `CardContent` | `className`, `...props` | Main content area |
| `CardFooter` | `className`, `...props` | Footer section |

**Examples:**

```tsx
// Complete card structure
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>
      A brief description of the card content
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Simple card
<Card className="p-6">
  <h3 className="text-lg font-semibold mb-2">Simple Card</h3>
  <p>Just some content without the structured components</p>
</Card>

// Card with custom styling
<Card className="border-2 border-dashed border-gray-300 bg-gray-50">
  <CardContent className="pt-6">
    <div className="text-center">
      <h3>Upload Area</h3>
      <p>Drag and drop files here</p>
    </div>
  </CardContent>
</Card>
```

---

## Enhanced Components

### TextAnimate

Advanced text animation component with multiple animation types and customization options.

**Import:**
```typescript
import { TextAnimate } from '@mjs/ui/components/text-animate';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | **required** | Text to animate |
| `type` | `AnimationType` | `'fadeInUp'` | Animation type |
| `duration` | `number` | `1000` | Animation duration in ms |
| `delay` | `number` | `0` | Delay before animation starts |
| `className` | `string` | - | Additional CSS classes |
| `once` | `boolean` | `true` | Whether to animate only once |
| `threshold` | `number` | `0.1` | Intersection observer threshold |

**Animation Types:**
- `fadeIn` - Simple fade in
- `fadeInUp` - Fade in from bottom
- `fadeInDown` - Fade in from top  
- `fadeInLeft` - Fade in from left
- `fadeInRight` - Fade in from right
- `slideInUp` - Slide in from bottom
- `slideInDown` - Slide in from top
- `typewriter` - Typewriter effect
- `wave` - Wave animation
- `bounce` - Bounce effect
- `zoom` - Zoom in effect

**Examples:**

```tsx
// Basic usage
<TextAnimate 
  text="Welcome to our website" 
  type="fadeInUp"
/>

// Typewriter effect
<TextAnimate 
  text="This text appears character by character"
  type="typewriter"
  duration={2000}
/>

// Staggered animations
<div>
  <TextAnimate 
    text="First line"
    type="fadeInLeft"
    delay={0}
  />
  <TextAnimate 
    text="Second line"
    type="fadeInLeft"
    delay={200}
  />
  <TextAnimate 
    text="Third line"
    type="fadeInLeft"
    delay={400}
  />
</div>

// Custom styling
<TextAnimate 
  text="Animated Heading"
  type="bounce"
  className="text-4xl font-bold text-center text-blue-600"
  duration={1500}
/>
```

### AuroraText

Text component with animated aurora/gradient background effect.

**Import:**
```typescript
import { AuroraText } from '@mjs/ui/components/aurora-text';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Text content |
| `className` | `string` | - | Additional CSS classes |
| `colors` | `string[]` | Default aurora colors | Custom gradient colors |
| `speed` | `number` | `1` | Animation speed multiplier |

**Examples:**

```tsx
// Basic usage
<AuroraText>Beautiful Aurora Text</AuroraText>

// Custom colors
<AuroraText colors={['#ff0000', '#00ff00', '#0000ff']}>
  Custom Colored Aurora
</AuroraText>

// Different sizes and styling
<AuroraText className="text-6xl font-bold">
  Large Aurora Heading
</AuroraText>

<AuroraText className="text-sm" speed={2}>
  Fast animation
</AuroraText>
```

### Interactive Buttons

#### ShinyButton

Button with animated shiny reflection effect.

**Import:**
```typescript
import { ShinyButton } from '@mjs/ui/components/shiny-button';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Button content |
| `className` | `string` | - | Additional CSS classes |
| `shine` | `boolean` | `true` | Enable shine effect |
| `...props` | `ButtonHTMLAttributes` | - | Standard button props |

**Examples:**

```tsx
// Basic shiny button
<ShinyButton>Click for shine</ShinyButton>

// Custom styling
<ShinyButton className="bg-gradient-to-r from-purple-500 to-pink-500">
  Gradient Shiny Button
</ShinyButton>

// Disabled shine
<ShinyButton shine={false}>
  No shine effect
</ShinyButton>
```

#### ShimmerButton

Button with shimmer animation effect.

**Import:**
```typescript
import { ShimmerButton } from '@mjs/ui/components/shimmer-button';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Button content |
| `className` | `string` | - | Additional CSS classes |
| `shimmerColor` | `string` | `'rgba(255,255,255,0.5)'` | Shimmer color |
| `background` | `string` | - | Custom background |
| `...props` | `ButtonHTMLAttributes` | - | Standard button props |

**Examples:**

```tsx
// Basic shimmer button
<ShimmerButton>Shimmer Effect</ShimmerButton>

// Custom colors
<ShimmerButton 
  background="linear-gradient(45deg, #1e3a8a, #3b82f6)"
  shimmerColor="rgba(255,255,255,0.8)"
>
  Blue Shimmer
</ShimmerButton>
```

#### RainbowButton

Button with animated rainbow border effect.

**Import:**
```typescript
import { RainbowButton } from '@mjs/ui/components/rainbow-button';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Button content |
| `className` | `string` | - | Additional CSS classes |
| `speed` | `number` | `1` | Animation speed |
| `...props` | `ButtonHTMLAttributes` | - | Standard button props |

**Examples:**

```tsx
// Basic rainbow button
<RainbowButton>Rainbow Border</RainbowButton>

// Slow animation
<RainbowButton speed={0.5}>
  Slow Rainbow
</RainbowButton>
```

---

## Layout Components

### Background Effects

#### SoftBg

Soft gradient background component with customizable intensity and colors.

**Import:**
```typescript
import { SoftBg } from '@mjs/ui/primitives/soft-bg';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Content to overlay |
| `variant` | `'primary' \| 'secondary' \| 'accent'` | `'primary'` | Color variant |
| `intensity` | `'low' \| 'medium' \| 'high'` | `'medium'` | Effect intensity |
| `className` | `string` | - | Additional CSS classes |

**Examples:**

```tsx
// Basic soft background
<SoftBg variant="primary" intensity="medium">
  <div className="p-8">
    <h2>Content with soft background</h2>
    <p>This content has a beautiful soft gradient behind it</p>
  </div>
</SoftBg>

// Different variants
<SoftBg variant="secondary" intensity="high">
  <div>High intensity secondary background</div>
</SoftBg>

<SoftBg variant="accent" intensity="low">
  <div>Subtle accent background</div>
</SoftBg>
```

#### GlowBg

Glowing background effect component with customizable glow properties.

**Import:**
```typescript
import { GlowBg } from '@mjs/ui/primitives/glow-bg';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Content to overlay |
| `color` | `string` | `'blue'` | Glow color |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Glow size |
| `intensity` | `number` | `0.5` | Glow intensity (0-1) |
| `className` | `string` | - | Additional CSS classes |

**Examples:**

```tsx
// Basic glow effect
<GlowBg color="blue" size="large">
  <div className="p-8 text-center">
    <h1>Glowing Content</h1>
  </div>
</GlowBg>

// Custom colors and intensity
<GlowBg 
  color="purple" 
  size="medium" 
  intensity={0.8}
>
  <div>Intense purple glow</div>
</GlowBg>

// Multiple glows
<div className="relative">
  <GlowBg color="red" size="small" intensity={0.3}>
    <GlowBg color="blue" size="small" intensity={0.3}>
      <div>Multi-colored glow effect</div>
    </GlowBg>
  </GlowBg>
</div>
```

---

## Form Components

### FormInput

Advanced form input with built-in validation, help text, and error handling.

**Import:**
```typescript
import { FormInput } from '@mjs/ui/primitives/form-input';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `helpText` | `string` | - | Help text below input |
| `error` | `string` | - | Error message |
| `required` | `boolean` | `false` | Required field indicator |
| `icon` | `ReactNode` | - | Icon before input |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon position |
| `className` | `string` | - | Additional CSS classes |
| `inputClassName` | `string` | - | Input-specific classes |
| `...props` | `InputHTMLAttributes` | - | Standard input props |

**Examples:**

```tsx
// Basic form input
<FormInput
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  required
/>

// With help text
<FormInput
  label="Password"
  type="password"
  helpText="Must be at least 8 characters long"
  required
/>

// With error
<FormInput
  label="Username"
  error="Username is already taken"
  className="mb-4"
/>

// With icon
<FormInput
  label="Search"
  icon={<SearchIcon />}
  placeholder="Search products..."
/>

// Right-aligned icon
<FormInput
  label="Amount"
  type="number"
  icon={<DollarIcon />}
  iconPosition="right"
/>
```

### Select

Customizable select dropdown with search and multi-select capabilities.

**Import:**
```typescript
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectGroup,
  SelectLabel
} from '@mjs/ui/primitives/select';
```

**Examples:**

```tsx
// Basic select
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="orange">Orange</SelectItem>
  </SelectContent>
</Select>

// Grouped options
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a category" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
    </SelectGroup>
    <SelectGroup>
      <SelectLabel>Vegetables</SelectLabel>
      <SelectItem value="carrot">Carrot</SelectItem>
      <SelectItem value="broccoli">Broccoli</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

// With controlled state
function ControlledSelect() {
  const [value, setValue] = useState('');
  
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger>
        <SelectValue placeholder="Choose option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

---

## Feedback Components

### Toast System

Comprehensive toast notification system with multiple variants and positions.

**Import:**
```typescript
import { useToast } from '@mjs/ui/primitives/use-toast';
import { Toaster } from '@mjs/ui/primitives/toaster';
```

**useToast Hook:**

| Method | Parameters | Description |
|--------|------------|-------------|
| `toast` | `ToastProps` | Show a toast notification |
| `dismiss` | `toastId?: string` | Dismiss specific or all toasts |

**ToastProps:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Toast title |
| `description` | `string` | - | Toast description |
| `variant` | `'default' \| 'destructive'` | `'default'` | Toast variant |
| `duration` | `number` | `5000` | Duration in ms |
| `action` | `ReactNode` | - | Action button |

**Examples:**

```tsx
// Setup in your app root
function App() {
  return (
    <div>
      {/* Your app content */}
      <Toaster />
    </div>
  );
}

// Using toasts in components
function MyComponent() {
  const { toast } = useToast();
  
  const showSuccess = () => {
    toast({
      title: "Success!",
      description: "Your changes have been saved.",
      duration: 3000,
    });
  };
  
  const showError = () => {
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  };
  
  const showWithAction = () => {
    toast({
      title: "Update available",
      description: "A new version is ready to install.",
      action: (
        <Button variant="outline" size="sm">
          Update
        </Button>
      ),
    });
  };
  
  return (
    <div>
      <Button onClick={showSuccess}>Show Success</Button>
      <Button onClick={showError}>Show Error</Button>
      <Button onClick={showWithAction}>Show with Action</Button>
    </div>
  );
}
```

### Progress

Progress indicator component with customizable styling.

**Import:**
```typescript
import { Progress } from '@mjs/ui/primitives/progress';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Progress value (0-100) |
| `max` | `number` | `100` | Maximum value |
| `className` | `string` | - | Additional CSS classes |

**Examples:**

```tsx
// Basic progress bar
<Progress value={60} className="w-full" />

// Custom max value
<Progress value={45} max={50} />

// With text
<div>
  <div className="flex justify-between text-sm mb-1">
    <span>Progress</span>
    <span>60%</span>
  </div>
  <Progress value={60} />
</div>

// Different colors
<Progress 
  value={80} 
  className="w-full [&>div]:bg-green-500" 
/>

// Animated progress
function AnimatedProgress() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 10));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return <Progress value={progress} />;
}
```

---

## Navigation Components

### Tabs

Accessible tab component with keyboard navigation and customizable styling.

**Import:**
```typescript
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@mjs/ui/primitives/tabs';
```

**Props:**

| Component | Props | Description |
|-----------|-------|-------------|
| `Tabs` | `defaultValue`, `value`, `onValueChange`, `orientation` | Tab container |
| `TabsList` | `className` | Tab triggers container |
| `TabsTrigger` | `value`, `disabled`, `className` | Individual tab trigger |
| `TabsContent` | `value`, `className` | Tab content panel |

**Examples:**

```tsx
// Basic tabs
<Tabs defaultValue="tab1" className="w-full">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="tab1">Account</TabsTrigger>
    <TabsTrigger value="tab2">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1" className="space-y-4">
    <div>
      <h3>Account Settings</h3>
      <p>Manage your account information here.</p>
    </div>
  </TabsContent>
  <TabsContent value="tab2" className="space-y-4">
    <div>
      <h3>Password Settings</h3>
      <p>Change your password here.</p>
    </div>
  </TabsContent>
</Tabs>

// Controlled tabs
function ControlledTabs() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        Overview content
      </TabsContent>
      <TabsContent value="analytics">
        Analytics content
      </TabsContent>
      <TabsContent value="reports">
        Reports content
      </TabsContent>
    </Tabs>
  );
}

// Vertical tabs
<Tabs defaultValue="general" orientation="vertical">
  <TabsList className="flex-col h-auto">
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
  </TabsList>
  <TabsContent value="general">General settings</TabsContent>
  <TabsContent value="security">Security settings</TabsContent>
  <TabsContent value="notifications">Notification settings</TabsContent>
</Tabs>
```

### Breadcrumb

Navigation breadcrumb component for showing current page location.

**Import:**
```typescript
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from '@mjs/ui/primitives/breadcrumb';
```

**Examples:**

```tsx
// Basic breadcrumb
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
      <BreadcrumbPage>T-Shirts</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

// With custom separator
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>→</BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>→</BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbPage>Components</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

// With ellipsis for long paths
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbEllipsis />
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/category">Category</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

## Media Components

### BackdropImage

Enhanced image component with backdrop effects and optimization.

**Import:**
```typescript
import BackdropImage from '@mjs/ui/primitives/backdrop-image';
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | Image source URL |
| `alt` | `string` | **required** | Alt text |
| `effect` | `'blur' \| 'brightness' \| 'contrast' \| 'none'` | `'none'` | Backdrop effect |
| `intensity` | `number` | `0.5` | Effect intensity (0-1) |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ImgHTMLAttributes` | - | Standard img props |

**Examples:**

```tsx
// Basic image
<BackdropImage
  src="/images/hero.jpg"
  alt="Hero image"
  className="w-full h-96 object-cover"
/>

// With blur effect
<BackdropImage
  src="/images/background.jpg"
  alt="Background"
  effect="blur"
  intensity={0.8}
  className="absolute inset-0"
/>

// Hero section with backdrop
<div className="relative h-screen flex items-center justify-center">
  <BackdropImage
    src="/images/hero-bg.jpg"
    alt="Hero background"
    effect="brightness"
    intensity={0.3}
    className="absolute inset-0 object-cover"
  />
  <div className="relative z-10 text-center text-white">
    <h1 className="text-6xl font-bold">Welcome</h1>
    <p className="text-xl">Beautiful backdrop effects</p>
  </div>
</div>
```

---

## Best Practices

### Component Composition

**Do:**
```tsx
// Compose components for flexibility
<Card>
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
    <CardDescription>Manage your account settings</CardDescription>
  </CardHeader>
  <CardContent>
    <FormInput label="Name" />
    <FormInput label="Email" type="email" />
  </CardContent>
  <CardFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>
```

**Don't:**
```tsx
// Avoid monolithic components
<UserProfileCard 
  title="User Profile"
  description="Manage your account settings"
  fields={[...]}
  actions={[...]}
/>
```

### Styling Guidelines

**Do:**
```tsx
// Use provided variants
<Button variant="primary" size="lg">
  Primary Action
</Button>

// Extend with additional classes
<Button 
  variant="outline" 
  className="border-dashed hover:border-solid"
>
  Custom Style
</Button>
```

**Don't:**
```tsx
// Override core styles completely
<Button className="bg-red-500 text-white px-4 py-2 rounded">
  Completely Custom
</Button>
```

### Accessibility

All components include built-in accessibility features:

- **Keyboard Navigation**: Tab, Arrow keys, Enter, Space
- **Screen Reader Support**: ARIA labels, roles, descriptions
- **Focus Management**: Visible focus indicators, proper tab order
- **Color Contrast**: WCAG compliant color combinations

**Example with accessibility:**
```tsx
<Button
  onClick={handleSubmit}
  disabled={isLoading}
  aria-label="Submit form"
  aria-describedby="submit-help"
>
  {isLoading ? 'Submitting...' : 'Submit'}
</Button>
<div id="submit-help" className="sr-only">
  This will submit your form data for processing
</div>
```

### Performance Tips

1. **Import Optimization:**
```tsx
// Good - specific imports
import { Button } from '@mjs/ui/primitives/button';
import { Card } from '@mjs/ui/primitives/card';

// Avoid - barrel imports in production
import { Button, Card } from '@mjs/ui';
```

2. **Conditional Rendering:**
```tsx
// Use loading states effectively
<Button loading={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save'}
</Button>
```

3. **Memoization:**
```tsx
// Memoize expensive components
const MemoizedComplexComponent = memo(({ data }) => (
  <Card>
    {/* Complex rendering logic */}
  </Card>
));
```