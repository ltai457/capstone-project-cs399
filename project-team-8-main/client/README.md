# Democraft Vue client

Vue 3, Vue Router, Vuetify 4, and Vite, written in JavaScript. No TypeScript or jQuery is used in this client. The backend uses ASP.NET Core 10, EF Core 10 and PostgreSQL.

## Run locally

Use Node.js 22.12+ (Node 24 is also supported).

```sh
cd project-team-8-main/client
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173/app/`. In another terminal, start the existing API from its project directory:

```sh
cd project-team-8-main
dotnet run --project "Project Authentication.csproj"
```

The API requires the .NET 10 SDK and a configured PostgreSQL database. Follow the [backend setup guide](../README.md#backend-net-10-and-postgresql) to configure local or shared database access and apply migrations. Supply deployment secrets through ASP.NET configuration (environment variables or user secrets). The Vue app uses email/password authentication; Google sign-in remains in the legacy implementation and has not been migrated.

Vite proxies `/api` to `https://localhost:8080`. Copy `.env.example` to `.env` to change `API_PROXY_TARGET`. Its certificate bypass applies only to the local development proxy. Production should use a valid HTTPS certificate.

Leave `VITE_API_BASE_URL` empty for a same-origin API. When using a separate API origin, set it to that origin without `/api` and configure CORS on the backend. Every `VITE_` variable is public browser configuration; never put credentials there.

## Architecture

```text
src/
  views/          Route screens and presentation
  components/     Reusable visual components
  controllers/    Vue composables: state, lifecycle, user actions, navigation
  services/       Application operations, input rules, DTO composition
  dto/            Explicit API-to-view and form-to-API transformations
  data/           Endpoint repositories and session persistence
  handlers/       HTTP transport, errors, and asynchronous action state
  router/         Lazy-loaded routes and navigation guards
```

The normal flow is **view → controller → service → repository → HTTP handler → API**, with DTO functions translating data at the service boundary. A controller is a Vue composable, not an HTTP endpoint. The existing C# controllers are the server's HTTP controllers. Services and DTOs do not depend on Vue; the HTTP handler accepts an injectable fetch function for contract tests.

For example, submitting a project calls `useProjectForm.submit()`, then `projectService.save()`, then `projectRepository.create()`. `projectFormData()` maps view names to existing fields such as `projectOverView` and `teamMember`. The repository alone knows the legacy endpoint name `AddNewProjectWithImage`.

To add a feature:

1. Add API request/response mappings in `dto/`.
2. Add endpoint access to a repository in `data/`.
3. Put validation and application rules in a service.
4. Use a controller composable to manage reactive state and actions through `useAction()`.
5. Keep the view focused on rendering and event binding.

Use a new layer only when it has a distinct responsibility. There is no need for one class per operation or for every component to have a controller.

## Included screens

- Public project gallery with search, semester and award filters, and grid/table modes.
- Project details, poster, external demo/repository links, likes, and discussion.
- Email/password registration and sign-in, with return-to-page navigation.
- Student project creation and editing, optional PNG poster uploads, and review status.
- Profile creation/update and a table containing all of the user's projects.
- Admin review queue, publish/decline, editing/deletion, project awards, and member tables.
- About and not-found pages.

Tables use `VDataTable` with sorting, search where applicable, and pagination. Filtering and pagination run in the browser because the existing API returns complete lists. Add server pagination before using these screens with large datasets.

JWT sessions persist in `sessionStorage` for the current tab and clear on sign-out or an HTTP 401. The API remains the authority for access checks; route guards only control navigation. There is no refresh-token endpoint in the existing API. Future authentication work can consider server-managed HttpOnly sessions.

## Build and checks

```sh
npm test
npm run build
npm run format
```

The build writes only to `../wwwroot/app/`; it does not replace the legacy static files. ASP.NET serves the new app at `/app/` and redirects `/` there after a build. Hash routing keeps deep links working without a catch-all route that could swallow API errors. The old `/homePage.html` remains accessible during migration.

From the API project directory, compile compatibility changes with:

```sh
dotnet build "Project Authentication.csproj"
```

Generated bundles, local environment files, and `node_modules` are ignored. Commit `package-lock.json` and use `npm ci` for reproducible installs.

## API compatibility changes

- `/api/Projects/user` now returns an array of **all** owned projects, including an empty array. Legacy consumers expecting a single object must be updated or continue using their original backend release.
- Profile `PUT /api/Profile/{id}` treats `id` as the authenticated **user ID**, matching the existing ownership check and the new client.
- Comment response DTOs now include `commentID` for admin deletion.
- Student project edits require ownership and return the project to the review queue. Unapproved project details are visible only to the owner or an admin.
- Public registration accepts only Student/Visitor roles, checks duplicate emails, and returns no password hash. Member listing requires Admin access.
- Profile update/deletion requires authentication; deletion checks ownership or Admin access. Creating a second profile returns 409.
- Poster uploads enforce PNG MIME type and a 5 MB size limit, and create the destination directory if missing. This remains the existing filesystem upload model.

The backend includes PostgreSQL migrations; see the backend guide before starting it. Existing nullable/compiler warnings remain. Frontend build and contract tests do not establish that Google authentication or full browser workflows have been verified.
