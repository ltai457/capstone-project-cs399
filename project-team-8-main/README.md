# project-team-8

## Vue modernization

The new frontend lives in [`client/`](client/README.md): Vue 3 + Vuetify 4, using plain JavaScript with controller composables, services, DTOs, repositories, and shared HTTP/action handlers. It includes project browsing, submissions, profiles, and admin data tables. The backend uses ASP.NET Core 10, EF Core 10, and PostgreSQL, with compatibility and access-control fixes.

```sh
cd client
npm ci
npm run dev
```

See [the client guide](client/README.md) for API configuration, architecture, production builds, validation commands, and migration limitations. The original project notes follow below.

## Backend: .NET 10 and PostgreSQL

Install the [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0).
Run backend commands from this directory (`project-team-8-main`). The repository
pins .NET 10 and a local EF CLI version. No SQL Server installation is needed.

### Start a local database

With Docker Desktop running:

```sh
cp .env.example .env
# Edit .env and replace POSTGRES_PASSWORD with a long random password.
docker compose up -d --wait

dotnet user-secrets set "ConnectionStrings:CS399Database" "Host=localhost;Port=5432;Database=democraft;Username=democraft;Password=YOUR_PASSWORD"
dotnet tool restore
dotnet ef database update
dotnet dev-certs https --trust
dotnet run --project "Project Authentication.csproj"
```

Use the same password in `.env` and the connection string. If port 5432 is already
in use, change `POSTGRES_PORT` in `.env` and `Port` in the connection string.
Docker reads `.env`; ASP.NET reads user secrets and environment variables, not
`.env`. Both local credential stores are excluded from Git.

The API serves Swagger at `https://localhost:8080/swagger`. Start the Vue client
with the commands above, or build it to serve `/app/` from ASP.NET. Data persists
in the Docker volume when containers stop. Changing `POSTGRES_PASSWORD` after
initializing the volume does not change the existing database user's password;
change it in PostgreSQL too.

After configuring your local database and applying migrations, you can start
both the backend and frontend with one command from this directory:

```sh
bash scripts/dev.sh
```

Open `http://localhost:5173/app/` for the frontend and
`http://localhost:8081/swagger` for the API. This local development command uses
HTTP on localhost and sets the Vite API proxy automatically. It also finds a
.NET 10 SDK installed in `~/.dotnet`. Press Ctrl+C to stop both servers.
Register a Student or Visitor account through the frontend to begin testing.

### Add local demo data

```sh
bash scripts/seed-demo.sh
```

This command adds 15 fictional projects (12 published, three awaiting approval),
three award winners, seven accounts with profiles, comments and varied like
counts. It only runs in Development against PostgreSQL on localhost; normal
startup does not add demo data. Repeating it fills missing demo records without
resetting existing passwords or overwriting edited project details.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@demo.test` | `DemoPass123!` |
| Student | `student@demo.test` | `DemoPass123!` |
| Visitor | `visitor@demo.test` | `DemoPass123!` |

Additional demo accounts are `student2@demo.test`, `student3@demo.test`,
`visitor2@demo.test` and `visitor3@demo.test`, with the same initial password.
Refresh the project gallery after seeding. The admin can review three pending
submissions, manage members and award projects. The student owns published and
pending projects; the visitor can comment and like projects. Repository links
are placeholders, and each project links to the same sample video.

### Connect the whole team to one database

A shared connection string works when it points to **one reachable PostgreSQL
server**, rather than each teammate's `localhost`. This repository does not
provision a cloud database. Have one teammate create a hosted PostgreSQL database
and share the host, port, database name, username and password privately. Each
teammate saves the connection string on their own computer:

```sh
dotnet user-secrets set "ConnectionStrings:CS399Database" "Host=YOUR_SHARED_HOST;Port=5432;Database=democraft;Username=YOUR_USER;Password=YOUR_PASSWORD;SSL Mode=VerifyFull"
dotnet tool restore
```

Use the provider's **Npgsql / ADO.NET** connection string and TLS/CA settings. A
`postgres://...` URL must be converted to the `Host=...;Database=...` format.
Environment variables are also supported, including for deployments:

```sh
export ConnectionStrings__CS399Database='Host=YOUR_SHARED_HOST;Port=5432;Database=democraft;Username=YOUR_USER;Password=YOUR_PASSWORD;SSL Mode=VerifyFull'
```

In PowerShell, use `$env:ConnectionStrings__CS399Database = 'Host=...;...'`.
Environment variables override user secrets. Never put database passwords in
Vue's `VITE_` settings or commit real credentials. In pgAdmin, DBeaver or `psql`,
use the same host, port, database, username and password with the provider's TLS
settings. Database access is separate from app login accounts.

One teammate applies `dotnet ef database update` when setting up the shared
database or after new migrations are merged; the others can then run the API.
Normal application startup does not change the schema. New schema changes use
`dotnet ef migrations add DescriptiveName`, and the generated migration and
snapshot must be committed together.

For a database hosted on a teammate's computer, run the supplied Compose service
only on that machine. Set `POSTGRES_BIND_ADDRESS` in its `.env` to its LAN/VPN IP
(or `0.0.0.0`), then run `docker compose up -d --wait`. Teammates replace `Host`
with that machine's reachable IP. Allow TCP on `POSTGRES_PORT` from the team's
LAN/VPN; keep the host awake. The provided local container has no TLS, so use
this setup on a trusted LAN/VPN. For teammates on different networks, use a
hosted database or VPN. A connection string alone cannot make a private host
reachable.

### Authentication settings

Development includes a development-only JWT key of the length required for
HS512. For a deployed API, set `JWTKEY__Secret` to a random secret of at least
64 UTF-8 bytes (or use `dotnet user-secrets set "JWTKEY:Secret" "YOUR_SECRET"`
for local overrides). All instances of the same deployed API must use the same
signing key. Production has no default key.

Google credentials are optional for email/password login. Configure
`GoogleAuth__ClientId` and `GoogleAuth__ClientSecret` separately to enable the
Google authentication handler. The Vue client currently uses email/password.
The historical database, Google and JWT secrets were removed from checked-in
configuration; rotate those old credentials if they are still active.

### Migrations and existing data

The initial PostgreSQL migration creates the current schema and the roles
`1=Admin`, `2=Student`, `3=Visitor`, so registration works on an empty database.
It creates no users or admin passwords. The old SQL Server migrations are
archived under `Migrations/SqlServer` and excluded from the PostgreSQL build.
Applying PostgreSQL migrations creates a fresh database; it does **not** import
existing SQL Server data. Existing data needs a separate export/import, with
original IDs, foreign keys, identity sequences and timestamp timezone conversion
handled explicitly. Stored project, comment and like timestamps now use UTC.
Uploaded images remain on the API server's filesystem; sharing the database
does not share those files between separate API servers.

Implementation references: [Microsoft's .NET 10 migration guide](https://learn.microsoft.com/aspnet/core/migration/90-to-100?view=aspnetcore-10.0),
[Npgsql EF Core 10](https://www.npgsql.org/efcore/release-notes/10.0.html),
[PostgreSQL connection string options](https://www.npgsql.org/doc/connection-string-parameters.html).

## Original project notes

project-team-8 created by GitHub Classroom
## Project Title :Democraft
## Project Management Tool: https://aucklanduni105211.monday.com/boards/4137264981/views/93675730

## Project Information
The project is a product of the University of Auckland Capstone Course Compsci 399. Its main purpose is to provide a platform for students who have enrolled in the Capstone course to showcase the projects they have developed. It is a website where students can upload demo video links, explaining the functionality or flow of their projects. They can also include the poster image, GitHub links, and the names of the participants who contributed to the project. Users have the ability to like and comment on the videos, subject to certain conditions. By developing this website, the developers aim to increase the visibility and reach of the Capstone course, making it more influential and accessible to a wider audience. Additionally, it may create potential employment opportunities as potential employers could come across the website and discover the projects showcased by the students.

## Technologies Used
Coding Softwares: Visual Studio Code, Visual Studio

    Former Design
    Software: Figma (For low fidelity prototype)

    Frontend
    Coding Languages: HTML, CSS, JavaScript, jQuery

    Backend
    Coding Language: C#
    Database: PostgreSQL
    API Testing: .NET 10, Swagger UI, Postman

## Installation Instructions
![image](https://github.com/uoa-compsci399-s1-2023/project-team-8/assets/114079256/34508235-f0f8-4bab-83da-53f5bfdc613e)


To run ProjectAuthentication, Open Project Authentication.csproj and run the solution file  through Visual Studio 2022 and it will directly go homePage.html that is our homepage for our project. Here is link that it will go through : https://localhost:8080/homePage.html.
If you want to access our backend code https://localhost:8080/swagger/index.html
### Configuration


## Usage Examples
## Non-login
- If you don't have an account yet, feel free to play around the website, you can view project, see comments and number of like of each project
## -Visitor
- you could like the project and comment, but unfortunately, visitors are not allowed to do anything further than this.
- You can register an account by clicking the Login/Sign up button on the upper right corner of the website. We are allowed sign up with Google account.
- If you've already had an account, then you could leave comments under videos.
## -Student
- Sign up first to gain access to the main function for students.
- After signing up for an account and logging in, the upper right corner will show the entrance for your profile page. Students could click and access it to do further steps such as uploading their project.
- When Student successfully upload project, it need to get an approval from admin before it can published
- Now as you've already had an account, you could share the same rights as logged in visitors, feel free to like or comment on the project.
## -Admin

Admin accounts must be provisioned separately in the configured database; the new PostgreSQL database has no default admin login.
- Log in with pre-specified account and then could process students' request of uploading the project demos. Admin staff could choose either to publish or decline the requests or edit the project if there is any mistake.
- Admin is allowed to delete comments or existing projects.
- Admin also can edit publised project or delete project and reward project

## Deployment

## Future Plans
- The filter on our website page could be improved with more detailed categories.
- The website would be perfect if it could combined with big data. As we are hoping the profile page is more of a page for potential students who wants to enroll in this course to have others who share the same interest team up with them after viewing their profiles. Therefore, with big data, the algorithm will push this kind of students profiles to any student users.

## Acknowledgements
- We would like to express our sincere gratitude to Asma Shakil for her invaluable feedback, which greatly contributed to the improvement of our project.
- Additionally, we extend our heartfelt thanks to Philipp Skavantzos for generously dedicating his time to support us throughout the entire semester.
- We would also like to extend my heartfelt thanks to those friends of each of our team members, either from China or Cambodia, for their patience in answering our questions and guiding us through various obstacles we encountered. Their support and industry experience were instrumental in our success.






