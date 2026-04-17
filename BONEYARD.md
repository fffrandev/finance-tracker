# Boneyard Skeleton Loading Implementation

## Overview
This project now uses `boneyard-js` for beautiful, pixel-perfect skeleton loading screens extracted from your actual UI components.

## Installation
Already installed: `npm install boneyard-js`

## Configuration
- Config file: `boneyard.config.json`
- Bones registry: `src/bones/registry.ts`
- Animation: pulse (can be changed to shimmer)

## How to Add Skeletons to Components

### 1. Wrap component with `<Skeleton>`
```tsx
import { Skeleton } from 'boneyard-js/react';
import '@/bones/registry';

export function MyComponent() {
  const { data, isLoading } = useFetch('/api/data');
  
  return (
    <Skeleton 
      name="my-component" 
      loading={isLoading}
      animate="pulse"
      transition={300}
    >
      {data && <ActualContent data={data} />}
    </Skeleton>
  );
}
```

### 2. Register skeleton bones in `src/bones/registry.ts`
```tsx
registerBones('my-component', {
  375: [  // Mobile (375px)
    { x: 0, y: 0, w: 100, h: 20, r: 4 },
    { x: 0, y: 30, w: '100%', h: 60, r: 8 },
  ],
  768: [  // Tablet (768px)
    { x: 0, y: 0, w: 150, h: 20, r: 4 },
    { x: 0, y: 30, w: '100%', h: 60, r: 8 },
  ],
  1280: [ // Desktop (1280px)
    { x: 0, y: 0, w: 200, h: 20, r: 4 },
    { x: 0, y: 30, w: '100%', h: 60, r: 8 },
  ],
});
```

### Bone Properties
- `x`: horizontal position (px or %)
- `y`: vertical position (px)
- `w`: width (px or %)
- `h`: height (px)
- `r`: border radius (px)

## Current Implementation

### Auth Loading Screen
- Replaced "Cargando..." with beautiful skeleton
- Shows when auth is not ready
- Uses `auth-loading` skeleton
- Smooth fade-out transition on login

### Dashboard Page
- Created `dashboard-page` skeleton
- Shows loading state for all main sections
- Responsive across breakpoints

## Framework Exports
- `boneyard-js/react` - React Skeleton component
- `boneyard-js/vue` - Vue component
- `boneyard-js/svelte` - Svelte component
- `boneyard-js/angular` - Angular component
- `boneyard-js/native` - React Native (if needed)
- `boneyard-js/vite` - Vite plugin (auto-capture)

## Commands

### Generate skeletons automatically (requires dev server running)
```bash
npx boneyard-js build --watch
```

### Manual CLI
```bash
npx boneyard-js build [url] --breakpoints 375,768,1280 --wait 800 --out ./src/bones
```

## Best Practices

1. **Name your skeletons descriptively**: `auth-login`, `dashboard-page`, `user-card`
2. **Keep bone layouts simple**: Use 2-4 bones per breakpoint
3. **Match actual UI dimensions**: Bones should approximate real content height
4. **Test on devices**: Verify skeletons look good on mobile, tablet, desktop
5. **Use consistent animation**: All components should use same `animate` prop

## Performance Notes
- Boneyard skeletons are lightweight (~1kb gzipped)
- No runtime overhead - bones are precomputed
- Works great with Context API loading states
- Smooth transitions improve perceived performance

## Troubleshooting

If skeletons don't appear:
1. Check that `@/bones/registry` is imported
2. Verify skeleton `name` matches registered bones
3. Ensure `loading={true}` when you want skeleton visible
4. Check browser console for errors

## References
- GitHub: https://github.com/0xGF/boneyard
- Docs: https://boneyard.vercel.app/
- NPM: https://www.npmjs.com/package/boneyard-js
