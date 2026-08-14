# Flight Management Frontend - AI Coding Instructions

## Project Overview

Flight management system frontend built with React 19, TypeScript, TanStack Router, and TanStack Query. Uses shadcn/ui with Tailwind CSS v4 and Radix UI components. Backend integration via OpenAPI-generated types.

## Architecture Patterns

### Routing & Authentication

- **TanStack Router** with file-based routing in `src/routes/`
- Protected routes live under `_authenticated/route.tsx` which redirects to `/sign-in` if `context.auth.isAuthenticated` is false
- Additional password change check: redirects to `/change-password` if `context.auth.requiresPasswordChange` is true
- Auth context in `src/context/auth-context.tsx`:
  - JWT tokens stored in `localStorage` via `react-use`'s `useLocalStorage`
  - `AUTH_TOKEN_KEY` constant for token key, `REQUIRES_PASSWORD_CHANGE_KEY` for password state
  - Fetches `/api/users/me` on mount when authenticated
  - Provides `hasRole(role: string)` helper for role-based checks
- Route groups: `(auth)/` for login/signup, `(errors)/` for error pages
- Auto-generated route tree at `src/routeTree.gen.ts` (ignored in git/eslint)
- Route components include `pendingComponent` for loading states (e.g., `PageTableSkeleton`)

### Feature Organization

- **Feature-first structure** in `src/features/[feature-name]/`
- Each feature contains: `components/`, `hooks/`, `types.ts`, `schema.ts`, `utils.ts`, `config.ts`, `constants.ts`
- Hooks naming: `use-[entity].ts` for queries, `use-create-[entity].ts`, `use-update-[entity].ts`, `use-delete-[entity].ts` for mutations
- Example: `tasks/hooks/` has `use-tasks.ts`, `use-create-task.ts`, `use-update-task.ts`, `use-delete-tasks.ts`, etc.
- All API calls abstracted through feature-specific hooks using `$queryClient`

### API Integration

- **openapi-fetch + openapi-react-query** for type-safe API calls
- Generated types in `src/generated/api-schema.d.ts` from `openapi.json` (kept in repo root)
- Centralized API client exported as `$queryClient` from `src/api/index.ts`:
  - `fetchClient` with `baseUrl: envVariables.viteBaseApi`
  - Request interceptor adds `Authorization: Bearer ${token}` header
  - Response interceptor throws `FetchError` for non-ok responses and offline states
- Custom `FetchError` class in `src/models/fetch-error.ts` with static factories: `fromResponse()`, `networkError()`, `timeoutError()`
- Query key factories in `src/api/query-key-factory.ts` for reusable, type-safe query keys:
  - Pattern: `entityKeysFactory = { lists: () => [...], detail: (id) => [...] }`
  - Example: `taskKeysFactory.detail(5)` returns `['get', '/api/tasks/{id}', { params: { path: { id: 5 } } }]`
- Query options pattern: export functions like `tasksQueryOptions(params)` that return `$queryClient.queryOptions(...)` for reusability

### Data Tables

- Custom `useDataTable` hook in `src/hooks/use-data-table.ts` wraps TanStack Table with URL state sync via `nuqs`
- URL params: `page`, `size`, `sort` (with custom parser for multi-column sorting)
- Debounced search and filter updates (300ms default, configurable)
- Column filters, visibility, row selection, and sorting all synced to URL
- Pagination, sorting, filtering are **manual** (controlled by backend)
- Data table components in `src/components/data-table/` handle action bars, faceted filters, view options
- Table skeleton: `PageTableSkeleton` component for pending states

### Dialog Management

- Context-based dialog system in `src/context/dialogs-context.tsx`
- `useDialogs()` hook provides `open()`, `sheet()`, `close()`, `closeAll()` API
- Promise-based dialog results: `const result = await open(MyDialog, payload, { onClose })`
- Dialog stack with auto-unmounting after 1s (configurable)
- Pre-built wrappers: `AppDialog`, `AppSheet`, `AppConfirmDialog` in `src/components/`
- Dialog/Sheet component pattern with typed payload:

  ```typescript
  // Pattern 1: Sheet with void return
  interface CreateSubTaskSheetPayload {
    parentTaskId: number
  }

  export const CreateSubTaskSheet: React.FC<
    DialogProps<CreateSubTaskSheetPayload>
  > = ({ payload, open, onClose }) => {
    const { parentTaskId } = payload
    // ... implementation
  }

  // Pattern 2: Dialog with typed return value
  interface DeleteAttachmentPayload {
    taskId: number
    attachment: TaskAttachment
    onSuccess?: () => void
  }

  export function DeleteAttachmentConfirmDialog({
    open,
    payload,
    onClose,
  }: DialogProps<DeleteAttachmentPayload, boolean>) {
    const { taskId, attachment } = payload
    // onClose(true) or onClose(false) returns boolean to caller
  }

  // Pattern 3: Destructuring payload inline
  export const CreateTaskSheet: React.FC<
    DialogProps<CreateTaskSheetPayload>
  > = ({ open, onClose, payload: { filterType } }) => {
    // Direct destructuring of payload props
  }
  ```

- **Cách gọi Dialog/Sheet (ưu tiên pattern này):**

  ```typescript
  // 1. Get dialogs instance from hook
  const dialogs = useDialogs()

  // 2. Open dialog without return value
  const handleDelete = () => {
    dialogs.open(DeleteAttachmentConfirmDialog, {
      attachment,
      filterType,
      taskId,
    })
  }

  // 3. Open dialog with await for return value
  const handleViewAssignments = async () => {
    await dialogs.open(TaskAssignmentsDialog, {
      task,
      filterType,
      allowCellEditing,
    })
  }

  // 4. Open sheet (for side panels)
  const handleOpenSheet = () => {
    dialogs.sheet(CreateSubTaskSheet, {
      parentTaskId: taskId,
    })
  }
  ```

### Component Architecture

- **shadcn/ui** components in `src/components/ui/` (generated via CLI, don't edit manually)
- Custom shared components in `src/components/`: datetime pickers, password input, user avatar, navigation breadcrumb, etc.
- Layout components in `src/components/layout/`: `AppSidebar`, `Header`
- Feature components stay within their feature directory
- Context providers composed in `__root.tsx`: `DialogsProvider`, `NavigationProgress`

## Development Workflow

### Essential Commands

```bash
# Development
pnpm dev                    # Start dev server with HMR
pnpm build                  # Production build
pnpm preview                # Preview production build (port 5173)
pnpm typecheck              # Run TypeScript compiler checks

# Code Quality
pnpm lint                   # Run ESLint
pnpm lint:fix               # Fix auto-fixable ESLint issues
pnpm format                 # Format with Prettier
pnpm format:check           # Check Prettier formatting
pnpm knip                   # Detect unused exports/dependencies

# API Schema
pnpm schema:fetch           # Fetch OpenAPI spec from API server
pnpm schema:format          # Format openapi.json
pnpm schema:generate        # Complete flow: fetch → format → generate types

# Analysis
pnpm sizecheck              # Visualize bundle size with vite-bundle-visualizer

# Add UI Components
npx shadcn@latest add [component-name]
```

### Environment Setup

- Environment variables defined in `src/schemas/env.ts` and validated with Zod
- Required: `VITE_BASE_API` (must be valid URL)
- Accessed via `envVariables` from `src/lib/env.ts`
- Mode-specific behavior: dev tools only show in development mode

### Code Quality Tools

- **ESLint**: strict TypeScript, React hooks, TanStack Query/Router, Unicorn, Promise rules
- Disabled rules: `no-console` is error, `unicorn/prevent-abbreviations` off, unused vars use `unused-imports` plugin
- **Prettier**: auto-sorts imports (external → internal → relative) via `@trivago/prettier-plugin-sort-imports`
- **Knip**: configured to detect unused code (check `knip.config.ts`)
- Path aliases: `@/` and `~/` both resolve to `src/`

### Build Configuration

- **Vite** with `@vitejs/plugin-react-swc` for fast refresh
- `@tanstack/router-plugin/vite` with `autoCodeSplitting: true`
- Manual chunks: `vendor` (react/react-dom), `router`, `ui` (radix components)
- Tabler icons fix: alias `@tabler/icons-react` to ESM index to prevent dev mode chunk loading issues
- Production: esbuild minification, no sourcemaps, CSS code splitting

## Key Conventions

### File Naming & Structure

- Components: PascalCase (`CreateUserDialog.tsx`)
- Hooks: kebab-case with `use-` prefix (`use-create-task.ts`)
- Types/schemas/utils: kebab-case (`task-types.ts`, `create-user-schema.ts`)
- Feature folders: kebab-case or camelCase (`my-tasks/`, `taskDetail/`)
- Constants/config files: singular (`config.ts`, `constants.ts`, `types.ts`, `schema.ts`)

### Import Organization

- Absolute imports via `@/` for `src/` (avoid relative imports from parent dirs)
- Import order (auto-sorted): external deps → `@/` imports → relative imports
- Group related imports: hooks together, components together, types/schemas together

### State Management Patterns

- **Server state**: TanStack Query via `$queryClient.useQuery()` / `useMutation()`
- **URL state**: TanStack Router's `useSearch()` or `nuqs` for complex table state
- **Global UI state**: React Context (`AuthContext`, `DialogsContext`, `ThemeContext`, `CommandSearchContext`)
- **Local state**: `useState`, `useReducer`, or `@uidotdev/usehooks` utilities
- **Form state**: `react-hook-form` with Zod schemas via `@hookform/resolvers/zod`

### Mutation Patterns with Optimistic Updates

- Mutations use `onMutate`, `onError`, `onSettled` lifecycle hooks
- Example from `use-create-task.ts`:
  - `onMutate`: cancel queries, snapshot old data, optimistically update cache
  - `onError`: rollback to snapshot if available
  - `onSettled`: always invalidate queries to refetch
- Return context from `onMutate` to pass to `onError`/`onSuccess`

### Form Patterns

- Define Zod schemas in feature's `schema.ts` (e.g., `createUserSchema`)
- Infer types from schemas: `type CreateUserInput = z.infer<typeof createUserSchema>`
- Use `useForm<T>({ resolver: zodResolver(schema), defaultValues })` from `react-hook-form`
- Form components from `src/components/ui/form.tsx` (shadcn/ui)
- Watch form values with `form.watch()` for dynamic behavior
- Handle submission: `form.handleSubmit(onSubmit)` where `onSubmit` receives validated data

### Styling Conventions

- Tailwind CSS v4 with CSS variables in `src/index.css` for theming
- Component variants via `class-variance-authority` (cva)
- Utility: `cn()` from `src/lib/utils.ts` for conditional class merging (uses `clsx` + `tailwind-merge`)
- Responsive: mobile-first approach (base styles, then `sm:`, `md:`, `lg:`)
- Dark/light theme: CSS variables auto-switch via `ThemeContext`

## Common Implementation Patterns

### Adding a New Feature

1. Create feature dir: `src/features/[name]/`
2. Add `types.ts` (define entity interfaces, query params, responses)
3. Add `schema.ts` (Zod schemas for forms/validation)
4. Add `hooks/use-[entity].ts` (query options function returning `$queryClient.queryOptions(...)`)
5. Add mutation hooks: `use-create-[entity].ts`, `use-update-[entity].ts`, etc.
6. Add `components/` for feature-specific UI
7. Create route: `src/routes/_authenticated/[name]/index.tsx` with `validateSearch` for URL params
8. Reference existing features like `users/` or `tasks/` for patterns

### Query Key Factory Pattern

```typescript
// src/api/query-key-factory.ts
export const entityKeysFactory = {
  lists: () => ['get', '/api/entities'] as const,
  detail: (id: number) =>
    ['get', '/api/entities/{id}', { params: { path: { id } } }] as const,
}

// In feature hook
export const entityQueryOptions = (params) => {
  return $queryClient.queryOptions('get', '/api/entities', {
    params: { query: params },
  })
}
```

### Date Handling

- Use `date-fns` for parsing/formatting (imported in `src/config/date.ts`)
- Parse user input: `parse(dateStr, dateFormatPatterns.fullDate, new Date())`
- Format for API: `format(date, dateFormatPatterns.standardizedDate)`
- DatePicker components: `datetime-picker.tsx`, `time-picker.tsx` using `react-day-picker`

### Error Handling

- API errors throw `FetchError` with `status`, `response`, `request` properties
- Route error boundaries: `errorComponent: GeneralError` in `__root.tsx`
- Form errors: `FormMessage` displays Zod validation errors automatically
- Custom error pages: `NotFoundError`, `GeneralError` in `src/features/errors/`

### Search Params Validation

```typescript
// In route file
export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: (search) => searchUsersParamsSchema.parse(search),
  // ...
})

// In feature schema.ts
export const searchUsersParamsSchema = z.object({
  page: z.coerce.number().default(1),
  size: z.coerce.number().default(20),
  keyword: z.string().optional(),
})
```

## Gotchas & Important Notes

- Never edit `src/routeTree.gen.ts` or `src/generated/api-schema.d.ts` - they're generated
- TanStack Router's `beforeLoad` runs before route component renders, use for auth checks
- `nuqs` requires URL params to have parsers (see `src/lib/parsers.ts` for custom ones)
- ESLint will error on `console.log` - use proper logging or remove before commit
- Date format mismatches: always convert to backend's expected format before API calls
- Optimistic updates: snapshot data in `onMutate`, restore in `onError`
- Dialog promises: `await open(...)` only resolves when dialog closes with result
