# Feature Specification: UI Components Migration Framework

**Feature Branch**: `010-ui-components-migration`
**Created**: 2026-02-05
**Status**: Draft
**Input**: User description: "Migrate UI components from frontend web (Tailwind 4) to white-label-app (Uniwind/React Native)"

## Overview

This spec defines the **migration framework** for converting UI components from the web frontend (`frontend/packages/web/src/app/components/ui/`) to React Native (`white-label-app/shared/components/`).

**Usage**: Reference this spec when migrating any component. Specify the target component and this framework provides the rules, patterns, and checklist.

---

## Source Analysis (Web)

### Technology Stack
| Technology | Purpose |
|------------|---------|
| Tailwind CSS 4 | Utility-first styling via `className` |
| class-variance-authority (CVA) | Variant management with `cva()` |
| Radix UI | Unstyled primitives (`@radix-ui/react-slot`) |
| Lucide React | Icon library |
| `cn()` utility | className merging (clsx + tailwind-merge) |

### Source Components Available
| Component | Path | Compound Parts |
|-----------|------|----------------|
| Button | `button.tsx` | - |
| Card | `card.tsx` | Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter |
| Input | `input.tsx` | Input, InputAddon, InputGroup, InputWrapper |
| Badge | `badge.tsx` | - |
| Alert | `alert.tsx` | Alert, AlertTitle, AlertDescription |
| Dialog | `dialog.tsx` | Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription |
| Select | `select.tsx` | Select, SelectTrigger, SelectContent, SelectItem, SelectValue |
| Checkbox | `checkbox.tsx` | - |
| Switch | `switch.tsx` | - |
| Tabs | `tabs.tsx` | Tabs, TabsList, TabsTrigger, TabsContent |
| Avatar | `avatar.tsx` | Avatar, AvatarImage, AvatarFallback |
| Skeleton | `skeleton.tsx` | - |
| Separator | `separator.tsx` | - |
| Label | `label.tsx` | - |
| Form | `form.tsx` | Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage |

---

## Target Requirements (React Native)

### Technology Stack
| Technology | Purpose | Replaces |
|------------|---------|----------|
| Uniwind | Tailwind 4 for RN via `className` | StyleSheet |
| Pressable | Touch handling | TouchableOpacity |
| Lucide React Native | Icons | lucide-react |
| `cn()` utility | className merging | - |
| Theme tokens | CSS variables in `global.css` | Hardcoded colors |

### Mandatory Rules (from Constitution & Vercel Skills)

#### 1. Use Pressable, NOT TouchableOpacity
```tsx
// ❌ Wrong
<TouchableOpacity onPress={onPress}>

// ✅ Correct
<Pressable onPress={onPress}>
```
*Reference: Vercel React Native Skills 9.9*

#### 2. Use Uniwind className, NOT StyleSheet
```tsx
// ❌ Wrong
<View style={styles.container}>
const styles = StyleSheet.create({ container: { backgroundColor: '#007AFF' } })

// ✅ Correct
<View className="bg-primary rounded-xl p-4">
```

#### 3. Use Theme Tokens, NOT Hardcoded Colors
```tsx
// ❌ Wrong
backgroundColor: '#007AFF'
color: '#ff3b30'

// ✅ Correct (in className)
className="bg-primary text-destructive"
```

#### 4. Use Compound Components for Complex UI
```tsx
// ❌ Wrong - polymorphic children
<Button icon={<Icon />}>Save</Button>

// ✅ Correct - compound components
<Button>
  <ButtonIcon><SaveIcon /></ButtonIcon>
  <ButtonText>Save</ButtonText>
</Button>
```
*Reference: Vercel React Native Skills 10.1*

#### 5. Wrap Strings in Text Components
```tsx
// ❌ Wrong - crashes
<View>Hello</View>

// ✅ Correct
<View><Text>Hello</Text></View>
```
*Reference: Vercel React Native Skills 1.2*

#### 6. Use Ternary for Conditional Rendering
```tsx
// ❌ Wrong - crashes if count is 0
{count && <Text>{count}</Text>}

// ✅ Correct
{count ? <Text>{count}</Text> : null}
```
*Reference: Vercel React Native Skills 1.1*

#### 7. Use expo-image, NOT Image
```tsx
// ❌ Wrong
import { Image } from 'react-native'

// ✅ Correct
import { Image } from 'expo-image'
```
*Reference: Vercel React Native Skills 9.5*

#### 8. Kebab-case File Names
```
// ❌ Wrong
ButtonGroup.tsx
CardHeader.tsx

// ✅ Correct
button-group.tsx
card-header.tsx
```

---

## Migration Checklist (Per Component)

Use this checklist when migrating each component:

### Pre-Migration
- [ ] Read source web component thoroughly
- [ ] Identify variants, sizes, states (loading, disabled, error)
- [ ] Identify compound parts (if any)
- [ ] Check if RN equivalent exists in `shared/components/`
- [ ] Review existing RN implementation issues

### Implementation
- [ ] Create/update component with Pressable (not TouchableOpacity)
- [ ] Use Uniwind `className` (not StyleSheet)
- [ ] Map all web variants to RN equivalents
- [ ] Map all web sizes to RN equivalents
- [ ] Implement loading state with ActivityIndicator
- [ ] Implement disabled state with opacity + non-interactive
- [ ] Use theme tokens (bg-primary, text-destructive, etc.)
- [ ] Implement compound components if needed
- [ ] Add TypeScript interfaces for all props
- [ ] Add `testID` prop for testing
- [ ] Add accessibility props (accessibilityRole, accessibilityLabel)

### Post-Migration
- [ ] Verify all variants render correctly
- [ ] Verify loading/disabled states work
- [ ] Verify theme tokens apply (test brand switch)
- [ ] Test with VoiceOver/TalkBack
- [ ] Update barrel export in `index.ts`
- [ ] Backward compatible with existing usage (if updating)

---

## File Structure Template

```
shared/components/{component-name}/
├── {component-name}.tsx           # Main component
├── {component-name}-{part}.tsx    # Compound parts (if any)
├── {component-name}.types.ts      # TypeScript interfaces
├── {component-name}.utils.ts      # Variant/utility functions (optional)
└── index.ts                       # Public exports
```

**Example for Button:**
```
shared/components/button/
├── button.tsx
├── button-text.tsx
├── button-icon.tsx
├── button.types.ts
└── index.ts
```

---

## Common Variant Mappings

### Colors (Web → RN Uniwind)
| Web Class | RN Uniwind Class | Theme Token |
|-----------|------------------|-------------|
| `bg-primary` | `bg-primary` | --color-primary |
| `bg-destructive` | `bg-destructive` | --color-destructive |
| `bg-secondary` | `bg-secondary` | --color-secondary |
| `bg-muted` | `bg-muted` | --color-muted |
| `bg-accent` | `bg-accent` | --color-accent |
| `bg-card` | `bg-card` | --color-card |
| `text-foreground` | `text-foreground` | --color-foreground |
| `text-muted-foreground` | `text-muted-foreground` | --color-muted-foreground |
| `border-border` | `border-border` | --color-border |
| `border-input` | `border-input` | --color-input |

### Sizing (Web → RN)
| Web | RN | Min Height |
|-----|-----|------------|
| `h-8` | `h-8` or `min-h-[32px]` | 32px |
| `h-9` | `h-9` or `min-h-[36px]` | 36px |
| `h-10` | `h-10` or `min-h-[44px]` | 44px (iOS touch target) |
| `h-12` | `h-12` or `min-h-[52px]` | 52px |

### Spacing
| Web | RN |
|-----|-----|
| `p-4` | `p-4` |
| `px-6` | `px-6` |
| `gap-2` | `gap-2` |
| `rounded-xl` | `rounded-xl` |
| `rounded-md` | `rounded-md` |

---

## Component Priority List

### P1 - Core (Migrate First)
| Component | Status | Notes |
|-----------|--------|-------|
| Button | Exists (needs update) | Add variants, Pressable, Uniwind |
| Input | Exists (needs update) | Add variants, theme tokens |
| Card | Exists (needs update) | Add compound components |
| Text | Exists | May need variant support |
| Loading | Exists | Review for consistency |

### P2 - Common
| Component | Status | Notes |
|-----------|--------|-------|
| Badge | Not exists | Create new |
| Alert | Not exists | Create new |
| Avatar | Not exists | Create new |
| Checkbox | Not exists | Create new |
| Switch | Not exists | Create new |
| Label | Not exists | Create new |

### P3 - Complex
| Component | Status | Notes |
|-----------|--------|-------|
| Dialog | Not exists | Use native Modal |
| Select | Not exists | Use native picker or zeego |
| Tabs | Not exists | Create new |
| Form | Not exists | Integrate with React Hook Form |

---

## User Stories Template (Per Component)

When migrating a specific component, create these user stories:

### Story 1 - Basic Interaction (P1)
"As a user, I want to interact with {Component} and receive visual feedback."

### Story 2 - Variants (P1)
"As a user, I want {Component} to have distinct visual styles for different contexts."

### Story 3 - States (P1)
"As a user, I want {Component} to show loading/disabled/error states clearly."

### Story 4 - Sizes (P2)
"As a user, I want {Component} in different sizes for different contexts."

### Story 5 - Theme Support (P2)
"As a brand owner, I want {Component} to adopt my brand colors automatically."

### Story 6 - Accessibility (P3)
"As a user with accessibility needs, I want {Component} to work with screen readers."

---

## Success Criteria (All Components)

- **SC-001**: Zero hardcoded color values (all via theme tokens)
- **SC-002**: All interactive components use Pressable
- **SC-003**: All components use Uniwind className
- **SC-004**: All components support testID for testing
- **SC-005**: All text wrapped in Text components
- **SC-006**: All components have TypeScript interfaces
- **SC-007**: All file names use kebab-case
- **SC-008**: Backward compatible with existing usage
- **SC-009**: Pass accessibility audit (VoiceOver/TalkBack)
- **SC-010**: Theme switching works without code changes

---

## How to Use This Spec

When you want to migrate a component:

1. **Reference this spec**: "Migrate Card component using 010-ui-components-migration spec"

2. **I will**:
   - Read the source web component
   - Apply all rules from this framework
   - Follow the checklist
   - Create/update files with correct structure
   - Ensure theme token usage
   - Follow compound component pattern if needed

3. **Deliverables**:
   - Updated/new component files
   - TypeScript interfaces
   - Barrel exports
   - (Optional) Component-specific user stories if complex

---

## Assumptions

- Uniwind is configured with Tailwind 4 CSS in `global.css`
- Theme tokens are defined as CSS variables
- Brand configuration can override theme colors at runtime
- Lucide React Native is available or will be added
- React Hook Form is used for form components
