# Hooks Documentation

This document provides comprehensive information about all React hooks available in the @mjs/ui package and web application, including usage patterns, examples, and best practices.

## Table of Contents

1. [UI Package Hooks](#ui-package-hooks)
2. [Custom Hooks](#custom-hooks)
3. [Third-party Hooks](#third-party-hooks)
4. [Hook Patterns](#hook-patterns)
5. [Best Practices](#best-practices)

---

## UI Package Hooks

### useActiveLink

Hook for managing active navigation link states across the application.

**Import:**
```typescript
import { useActiveLink, ActiveLinkProvider } from '@mjs/ui/hooks/use-active-link';
```

**API:**

| Return Value | Type | Description |
|--------------|------|-------------|
| `isActive` | `(path: string) => boolean` | Check if a path is currently active |
| `setActiveLink` | `(path: string) => void` | Set the active link path |
| `activeLink` | `string` | Currently active link path |

**Setup:**
```tsx
// Wrap your app with the provider
import { ActiveLinkProvider } from '@mjs/ui/hooks/use-active-link';

function App() {
  return (
    <ActiveLinkProvider>
      <Router>
        <Navigation />
        <Routes>
          {/* Your routes */}
        </Routes>
      </Router>
    </ActiveLinkProvider>
  );
}
```

**Usage Examples:**

```tsx
// Basic navigation link
function NavigationLink({ href, children, className }) {
  const { isActive, setActiveLink } = useActiveLink();
  
  return (
    <Link
      href={href}
      className={cn(
        'nav-link',
        isActive(href) && 'nav-link-active',
        className
      )}
      onClick={() => setActiveLink(href)}
    >
      {children}
    </Link>
  );
}

// Navigation menu with active states
function MainNavigation() {
  const { isActive } = useActiveLink();
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];
  
  return (
    <nav className="flex space-x-4">
      {navItems.map(({ href, label }) => (
        <NavigationLink
          key={href}
          href={href}
          className={isActive(href) ? 'text-blue-600 font-semibold' : 'text-gray-600'}
        >
          {label}
        </NavigationLink>
      ))}
    </nav>
  );
}

// Breadcrumb with active link
function BreadcrumbNavigation({ paths }) {
  const { isActive } = useActiveLink();
  
  return (
    <nav className="flex items-center space-x-2">
      {paths.map(({ href, label }, index) => (
        <div key={href} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          {isActive(href) ? (
            <span className="text-gray-900 font-medium">{label}</span>
          ) : (
            <Link href={href} className="text-blue-600 hover:underline">
              {label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
```

### useActionListener

Hook for listening to keyboard events and other global actions.

**Import:**
```typescript
import { useActionListener } from '@mjs/ui/hooks/use-action-listener';
```

**API:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `eventType` | `string` | Event type to listen for (e.g., 'keydown', 'click') |
| `handler` | `(event: Event) => void` | Event handler function |
| `options` | `UseActionListenerOptions` | Configuration options |

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `target` | `EventTarget` | `window` | Target element to listen on |
| `enabled` | `boolean` | `true` | Whether the listener is enabled |
| `deps` | `DependencyList` | `[]` | Dependencies for the effect |

**Usage Examples:**

```tsx
// Global keyboard shortcuts
function useKeyboardShortcuts() {
  const router = useRouter();
  const { toast } = useToast();
  
  useActionListener('keydown', (event) => {
    // Handle different key combinations
    if (event.metaKey || event.ctrlKey) {
      switch (event.key) {
        case 'k':
          event.preventDefault();
          // Open search
          openSearch();
          break;
        case '/':
          event.preventDefault();
          // Show help
          showHelp();
          break;
        case 'n':
          event.preventDefault();
          // Create new item
          createNew();
          break;
      }
    }
    
    // Escape key handling
    if (event.key === 'Escape') {
      closeModal();
      clearSearch();
    }
  });
}

// Modal close on escape
function Modal({ isOpen, onClose, children }) {
  useActionListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  }, { enabled: isOpen });
  
  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>
  ) : null;
}

// Click outside to close
function Dropdown({ isOpen, onClose, children }) {
  const dropdownRef = useRef(null);
  
  useActionListener('click', (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      onClose();
    }
  }, { enabled: isOpen });
  
  return (
    <div ref={dropdownRef} className="relative">
      {children}
    </div>
  );
}

// Custom target element
function InteractiveCard({ onDoubleClick }) {
  const cardRef = useRef(null);
  
  useActionListener('dblclick', onDoubleClick, {
    target: cardRef.current,
    enabled: !!cardRef.current
  });
  
  return (
    <div ref={cardRef} className="card">
      Double-click me!
    </div>
  );
}
```

### useHash

Hook for managing URL hash state with reactive updates.

**Import:**
```typescript
import { useHash } from '@mjs/ui/hooks/use-hash';
```

**API:**

| Return Value | Type | Description |
|--------------|------|-------------|
| `[hash, setHash]` | `[string, (hash: string) => void]` | Current hash and setter function |

**Usage Examples:**

```tsx
// Tab navigation with URL hash
function TabNavigation() {
  const [hash, setHash] = useHash();
  const activeTab = hash || 'overview';
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'settings', label: 'Settings' },
    { id: 'history', label: 'History' },
  ];
  
  return (
    <div>
      <div className="tab-list">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setHash(id)}
            className={cn(
              'tab-button',
              activeTab === id && 'tab-button-active'
            )}
          >
            {label}
          </button>
        ))}
      </div>
      
      <div className="tab-content">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'history' && <HistoryTab />}
      </div>
    </div>
  );
}

// Scroll to section navigation
function TableOfContents({ sections }) {
  const [hash, setHash] = useHash();
  
  const scrollToSection = (sectionId) => {
    setHash(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <nav className="table-of-contents">
      <h3>Contents</h3>
      <ul>
        {sections.map(({ id, title }) => (
          <li key={id}>
            <button
              onClick={() => scrollToSection(id)}
              className={cn(
                'toc-link',
                hash === id && 'toc-link-active'
              )}
            >
              {title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Modal state management
function useModalState(modalId) {
  const [hash, setHash] = useHash();
  const isOpen = hash === modalId;
  
  const openModal = () => setHash(modalId);
  const closeModal = () => setHash('');
  
  return { isOpen, openModal, closeModal };
}

// Usage in component
function ProductGallery() {
  const { isOpen, openModal, closeModal } = useModalState('gallery');
  
  return (
    <div>
      <button onClick={openModal}>
        Open Gallery
      </button>
      
      {isOpen && (
        <GalleryModal onClose={closeModal} />
      )}
    </div>
  );
}
```

### useLocale

Hook for accessing and managing locale information.

**Import:**
```typescript
import { useLocale } from '@mjs/ui/hooks/use-locale';
```

**API:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `defaultLocale` | `string` | Default locale to use |
| `supportedLocales` | `string[]` | Array of supported locales |

| Return Value | Type | Description |
|--------------|------|-------------|
| `locale` | `string` | Current locale |

**Usage Examples:**

```tsx
// Basic locale detection
function LanguageAwareComponent() {
  const locale = useLocale('en', ['en', 'es', 'fr', 'de']);
  
  const messages = {
    en: { welcome: 'Welcome' },
    es: { welcome: 'Bienvenido' },
    fr: { welcome: 'Bienvenue' },
    de: { welcome: 'Willkommen' }
  };
  
  return (
    <h1>{messages[locale]?.welcome || messages.en.welcome}</h1>
  );
}

// Date formatting with locale
function LocalizedDate({ date }) {
  const locale = useLocale('en-US', ['en-US', 'es-ES', 'fr-FR']);
  
  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
  
  return <time>{formattedDate}</time>;
}

// Number formatting
function LocalizedPrice({ amount, currency = 'USD' }) {
  const locale = useLocale('en-US');
  
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
  
  return <span className="price">{formattedPrice}</span>;
}

// Locale-aware form validation
function ContactForm() {
  const locale = useLocale('en');
  
  const validationMessages = {
    en: {
      required: 'This field is required',
      email: 'Please enter a valid email'
    },
    es: {
      required: 'Este campo es obligatorio',
      email: 'Por favor ingrese un email válido'
    }
  };
  
  const messages = validationMessages[locale] || validationMessages.en;
  
  return (
    <form>
      <FormInput
        label="Email"
        type="email"
        required
        error={emailError ? messages.email : ''}
      />
    </form>
  );
}
```

### useIsMobile

Hook for detecting mobile devices and responsive breakpoints.

**Import:**
```typescript
import { useIsMobile } from '@mjs/ui/hooks/use-mobile';
```

**API:**

| Return Value | Type | Description |
|--------------|------|-------------|
| `isMobile` | `boolean` | True if device is mobile |

**Usage Examples:**

```tsx
// Responsive component rendering
function ResponsiveNavigation() {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileNavigation /> : <DesktopNavigation />;
}

// Conditional feature rendering
function VideoPlayer({ src }) {
  const isMobile = useIsMobile();
  
  return (
    <div className="video-container">
      <video
        src={src}
        controls
        autoPlay={!isMobile} // Don't autoplay on mobile
        muted={isMobile}     // Mute on mobile
        playsInline={isMobile}
      />
      
      {!isMobile && (
        <div className="video-controls">
          <FullscreenButton />
          <QualitySelector />
        </div>
      )}
    </div>
  );
}

// Layout adjustments
function ProductGrid({ products }) {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      'grid gap-4',
      isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    )}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          compact={isMobile}
        />
      ))}
    </div>
  );
}

// Touch-friendly interactions
function SwipeableCard({ children, onSwipeLeft, onSwipeRight }) {
  const isMobile = useIsMobile();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    if (!isMobile) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!isMobile || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
    if (isRightSwipe && onSwipeRight) onSwipeRight();
  };
  
  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="swipeable-card"
    >
      {children}
    </div>
  );
}
```

---

## Custom Hooks

### useThemeSwitch

Hook for managing theme switching functionality (from web app components).

**Usage:**
```tsx
// Extracted from useThemeSwitch.tsx
function useThemeSwitch() {
  const [theme, setTheme] = useState('system');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  
  return { theme, setTheme, toggleTheme };
}

// Usage in components
function ThemeToggle() {
  const { theme, toggleTheme } = useThemeSwitch();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
```

---

## Third-party Hooks

The UI package also re-exports useful hooks from `usehooks-ts`:

### useLocalStorage

**Import:**
```typescript
import { useLocalStorage } from '@mjs/ui/hooks';
```

**Usage Examples:**

```tsx
// User preferences
function UserPreferences() {
  const [preferences, setPreferences] = useLocalStorage('userPrefs', {
    theme: 'system',
    language: 'en',
    notifications: true
  });
  
  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div className="preferences">
      <Select
        value={preferences.theme}
        onValueChange={(value) => updatePreference('theme', value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// Shopping cart
function useShoppingCart() {
  const [cart, setCart] = useLocalStorage('cart', []);
  
  const addItem = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  
  const removeItem = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => setCart([]);
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };
}
```

### useReadLocalStorage

**Import:**
```typescript
import { useReadLocalStorage } from '@mjs/ui/hooks';
```

**Usage Examples:**

```tsx
// Read-only access to stored data
function WelcomeMessage() {
  const userName = useReadLocalStorage('userName');
  
  return userName ? (
    <h1>Welcome back, {userName}!</h1>
  ) : (
    <h1>Welcome, guest!</h1>
  );
}

// Feature flags
function FeatureGatedComponent() {
  const featureFlags = useReadLocalStorage('featureFlags', {});
  
  if (!featureFlags.newFeature) {
    return <LegacyComponent />;
  }
  
  return <NewFeatureComponent />;
}
```

---

## Hook Patterns

### Compound Hooks

Create hooks that combine multiple concerns:

```tsx
// User session management
function useUserSession() {
  const [user, setUser] = useLocalStorage('user', null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${userData.name}!`
      });
      return userData;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };
  
  return {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    logout
  };
}

// API data fetching with local storage cache
function useApiWithCache(url, key) {
  const [cachedData, setCachedData] = useLocalStorage(`cache_${key}`, null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = async (force = false) => {
    if (cachedData && !force) return cachedData;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      setCachedData(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [url]);
  
  return {
    data: cachedData,
    isLoading,
    error,
    refetch: () => fetchData(true),
    clearCache: () => setCachedData(null)
  };
}
```

### Hook Composition Patterns

```tsx
// Form state management
function useFormState(initialValues, validation) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const setTouched = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };
  
  const validate = () => {
    const newErrors = {};
    
    for (const [field, rules] of Object.entries(validation)) {
      const value = values[field];
      
      for (const rule of rules) {
        const error = rule(value);
        if (error) {
          newErrors[field] = error;
          break;
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);
    
    if (validate()) {
      onSubmit(values);
    }
  };
  
  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    handleSubmit,
    isValid: Object.keys(errors).length === 0
  };
}

// Usage
function ContactForm() {
  const { toast } = useToast();
  
  const {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    handleSubmit,
    isValid
  } = useFormState(
    { name: '', email: '', message: '' },
    {
      name: [(value) => !value ? 'Name is required' : null],
      email: [
        (value) => !value ? 'Email is required' : null,
        (value) => !/\S+@\S+\.\S+/.test(value) ? 'Invalid email' : null
      ],
      message: [(value) => !value ? 'Message is required' : null]
    }
  );
  
  const onSubmit = async (formData) => {
    try {
      await submitForm(formData);
      toast({
        title: "Message sent!",
        description: "We'll get back to you soon."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        label="Name"
        value={values.name}
        onChange={(e) => setValue('name', e.target.value)}
        onBlur={() => setTouched('name')}
        error={touched.name && errors.name}
      />
      
      <FormInput
        label="Email"
        type="email"
        value={values.email}
        onChange={(e) => setValue('email', e.target.value)}
        onBlur={() => setTouched('email')}
        error={touched.email && errors.email}
      />
      
      <Textarea
        placeholder="Your message"
        value={values.message}
        onChange={(e) => setValue('message', e.target.value)}
        onBlur={() => setTouched('message')}
      />
      {touched.message && errors.message && (
        <p className="text-red-500 text-sm">{errors.message}</p>
      )}
      
      <Button type="submit" disabled={!isValid}>
        Send Message
      </Button>
    </form>
  );
}
```

---

## Best Practices

### 1. Hook Dependencies

Always include proper dependencies in useEffect and other hooks:

```tsx
// ❌ Missing dependencies
function useApiData(url) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData(url).then(setData);
  }, []); // Missing url dependency
  
  return data;
}

// ✅ Proper dependencies
function useApiData(url) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData(url).then(setData);
  }, [url]); // Include url in dependencies
  
  return data;
}
```

### 2. Cleanup Functions

Always cleanup side effects:

```tsx
// ✅ Proper cleanup
function useInterval(callback, delay) {
  useEffect(() => {
    if (delay === null) return;
    
    const interval = setInterval(callback, delay);
    
    return () => clearInterval(interval);
  }, [callback, delay]);
}

function useEventListener(event, handler, element = window) {
  useEffect(() => {
    element.addEventListener(event, handler);
    
    return () => element.removeEventListener(event, handler);
  }, [event, handler, element]);
}
```

### 3. Stable References

Use useCallback and useMemo for stable references:

```tsx
// ✅ Stable callback reference
function useDebounce(callback, delay) {
  const callbackRef = useRef(callback);
  
  // Keep callback reference up to date
  useEffect(() => {
    callbackRef.current = callback;
  });
  
  // Stable debounced function
  const debouncedCallback = useCallback(
    debounce((...args) => callbackRef.current(...args), delay),
    [delay]
  );
  
  return debouncedCallback;
}
```

### 4. Error Handling

Always handle errors in custom hooks:

```tsx
function useAsyncOperation() {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null
  });
  
  const execute = useCallback(async (operation) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await operation();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error }));
      throw error;
    }
  }, []);
  
  return { ...state, execute };
}
```

### 5. Type Safety

Use TypeScript for better hook APIs:

```tsx
interface UseLocalStorageOptions<T> {
  serializer?: {
    parse: (value: string) => T;
    stringify: (value: T) => string;
  };
}

function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>
): [T, (value: T | ((prev: T) => T)) => void] {
  // Implementation with proper typing
}

// Usage with type safety
const [user, setUser] = useLocalStorage<User | null>('user', null);
const [settings, setSettings] = useLocalStorage('settings', {
  theme: 'light' as const,
  language: 'en' as const
});
```

### 6. Testing Hooks

Write tests for custom hooks:

```tsx
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

test('should initialize with default value', () => {
  const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
  
  expect(result.current[0]).toBe('default');
});

test('should update value', () => {
  const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
  
  act(() => {
    result.current[1]('updated');
  });
  
  expect(result.current[0]).toBe('updated');
});
```