# AI-Assisted Development Guide

This guide explains how to use the AI development tools configured in this project.

## Quick Start

1. **Clone the repo** → AI tools auto-load
2. **(Recommended)** Set your Context7 API key in a `.env.local` file:
   ```bash
   CONTEXT7_API_KEY="your-key-here"
   ```
3. **Open with Claude Code** → Start developing!

---

## Available Tools

| Tool | Purpose | Auto-Loaded? |
|------|---------|--------------|
| **Context7 MCP** | Real-time library documentation | ✅ Yes |
| **Vercel React Native Skills** | Best practices for RN/Expo | ✅ Yes |
| **Speckit** | Project architecture rules | ✅ Yes |

---

## Using Context7

Context7 fetches **up-to-date documentation** for any library directly into your AI's context.

### Basic Usage

Just ask normally - Context7 auto-fetches docs:
```
How do I implement pull-to-refresh with FlashList?
```

### Explicit Library Request

For faster lookups, specify the library:
```
How to configure caching? use library /expo/expo
```

### Common Library IDs

| Library | Context7 ID |
|---------|-------------|
| React Native | `/facebook/react-native` |
| Expo | `/expo/expo` |
| FlashList | `/shopify/flash-list` |
| Reanimated | `/software-mansion/react-native-reanimated` |
| Zustand | `/pmndrs/zustand` |
| React Navigation | `/react-navigation/react-navigation` |

### Rate Limits

| Account | Limit |
|---------|-------|
| No API key | Shared limits (may be slow) |
| Free account | 1,000 calls/month |

Get free key at: [context7.com/dashboard](https://context7.com/dashboard)

---

## Using Vercel React Native Skills

The skills provide **28 best practice rules** for React Native development.

### When Skills Apply

The AI automatically references these skills when:
- Building React Native or Expo components
- Optimizing list and scroll performance
- Implementing animations
- Working with images and media
- Managing state

### Key Rules Summary

| Priority | Category | Best Practice |
|----------|----------|---------------|
| 🔴 CRITICAL | Lists | Use `FlashList` instead of `FlatList` |
| 🔴 CRITICAL | Lists | Memoize list item components |
| 🟠 HIGH | Animation | Use Reanimated, not Animated API |
| 🟠 HIGH | Animation | Only animate `transform` and `opacity` |
| 🟠 HIGH | Navigation | Use native stack/tabs |
| 🟠 HIGH | UI | Use `expo-image` instead of `Image` |
| 🟠 HIGH | UI | Use `Pressable` instead of `TouchableOpacity` |
| 🟡 MEDIUM | State | Use Zustand patterns |
| 🟡 MEDIUM | Rendering | Wrap text in `Text` components |

### Full Documentation

Read the complete rules at:
```
.claude/skills/vercel-react-native-skills/AGENTS.md
```

---

## Using Speckit

Speckit ensures all AI-generated code follows the project's **architecture rules**.

### Constitution

The project constitution at `.specify/memory/constitution.md` defines:
- Clean Architecture principles
- Feature-based module structure
- White-label and multi-tenant patterns
- Technology stack requirements

### Creating New Features

When creating new features, the AI will:
1. Check the constitution for compliance
2. Reference the Skills Check in plan templates
3. Use Vercel React Native Skills guidelines

### Templates Location

```
.specify/templates/
├── spec-template.md      # Feature specifications
├── plan-template.md      # Implementation plans
├── tasks-template.md     # Task breakdowns
└── checklist-template.md # Review checklists
```

---

## Example Prompts

### Good Prompts (Skills Auto-Applied)

```
Create a user list screen with infinite scroll and pull-to-refresh
```
→ AI will use FlashList, proper memoization, and follow list performance rules

```
Add an avatar image component with caching
```
→ AI will use expo-image with blurhash placeholder

```
Implement a slide-in animation for the notification banner
```
→ AI will use Reanimated with transform/opacity only

### Explicit Skills Request

```
Review this component against Vercel React Native skills
```
→ AI will audit code against all 28 rules

---

## Troubleshooting

### Context7 Not Working

1. Check Node.js version: `node --version` (needs 18+)
2. Verify `.mcp.json` exists in project root
3. Restart Claude Code

### Skills Not Applied

1. Verify `.claude/skills/` directory exists
2. Check symlinks: `ls -la .claude/skills/`
3. Reinstall: `npx skills add vercel-labs/agent-skills`

### Rate Limit Errors

1. Get free API key at context7.com
2. Set environment variable:
   ```bash
   export CONTEXT7_API_KEY="your-key"
   ```

---

## File Locations

| File | Purpose |
|------|---------|
| `.mcp.json` | Context7 MCP config |
| `.claude/skills/` | Vercel skills (symlinked) |
| `.agents/skills/` | Skills source files |
| `.specify/memory/constitution.md` | Project rules |
| `CLAUDE.md` | AI auto-invoke rules |
