using Microsoft.EntityFrameworkCore;
using Npgsql;
using Project_Authentication.Model;

namespace Project_Authentication.Data;

public static class DevelopmentDataSeeder
{
    private const string DemoPassword = "DemoPass123!";

    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ProjectDBContext>();
        var connection = new NpgsqlConnectionStringBuilder(db.Database.GetConnectionString());
        if (connection.Host is not ("localhost" or "127.0.0.1" or "::1"))
            throw new InvalidOperationException("Demo data requires a PostgreSQL connection on localhost.");

        await db.Database.MigrateAsync();
        await using var transaction = await db.Database.BeginTransactionAsync();
        var today = DateTime.UtcNow.Date;
        var accounts = new[]
        {
            new DemoAccount("admin", "Demo Admin", 1, "Community moderation and project reviews", "C#, PostgreSQL"),
            new DemoAccount("student", "Aroha Blake", 2, "Climate technology and community tools", "C#, Vue, Python"),
            new DemoAccount("student2", "Sam Park", 2, "Accessible design and student experiences", "JavaScript, Vue, C#"),
            new DemoAccount("student3", "Maya Chen", 2, "Data visualisation and machine learning", "Python, TypeScript, C#"),
            new DemoAccount("visitor", "Riley Morgan", 3, "Discovering student projects", "JavaScript"),
            new DemoAccount("visitor2", "Jordan Singh", 3, "Social impact and inclusive technology", "Python"),
            new DemoAccount("visitor3", "Alex Turner", 3, "Games, creative coding and open source", "C#, Unity")
        };
        var users = new Dictionary<string, User>();
        foreach (var account in accounts)
        {
            var email = $"{account.Key}@demo.test";
            var user = await db.Users.SingleOrDefaultAsync(u => u.Email == email);
            if (user is null)
            {
                user = new User
                {
                    UserName = account.Name,
                    Email = email,
                    Password = BCrypt.Net.BCrypt.HashPassword(DemoPassword),
                    RoleID = account.RoleId,
                    RoleName = account.RoleId switch { 1 => "Admin", 2 => "Student", _ => "Visitor" }
                };
                db.Users.Add(user);
                await db.SaveChangesAsync();
            }
            users.Add(account.Key, user);
            if (!await db.Profiles.AnyAsync(p => p.UserID == user.UserID))
            {
                db.Profiles.Add(new Profile
                {
                    UserID = user.UserID,
                    UserName = user.UserName,
                    Semester = "2026 S2",
                    Interest = account.Interests,
                    MainCoding_Language = account.Languages,
                    Contact_Detail = email
                });
            }
        }
        await db.SaveChangesAsync();

        var fixtures = new[]
        {
            new DemoProject("tidewatch", "TideWatch", "Coastline Labs", "student", "2026 S2", "Python, Vue, PostgreSQL", true, true,
                "A coastal monitoring dashboard that turns water-quality readings into clear maps for community volunteers.\n\nExplore sample sensor histories, discover cleanup locations, and compare trends across Auckland beaches."),
            new DemoProject("campus-connect", "Campus Connect", "Common Ground", "student2", "2026 S2", ".NET 10, Vue, PostgreSQL", true, false,
                "One place for students to discover clubs, events, and study groups.\n\nThe team built an accessible event directory with calendar filters and a simple registration flow."),
            new DemoProject("accessmap", "AccessMap", "Open Path", "student3", "2026 S1", "React, TypeScript, PostgreSQL", true, true,
                "An accessibility-first campus map with step-free routes, lift locations, and community reports.\n\nDesigned with keyboard navigation and readable directions to help more people move confidently around campus."),
            new DemoProject("harvest-hub", "Harvest Hub", "Good Growth", "student", "2026 S1", "Python, Django, PostgreSQL", true, false,
                "A neighbourhood exchange for surplus garden produce.\n\nGardeners list what they have available, arrange collection, and see how much food their community has shared."),
            new DemoProject("studybuddy", "StudyBuddy", "Focus Crew", "student2", "2025 S2", "C#, Vue, PostgreSQL", true, false,
                "A shared planner for coursework, study sessions, and team milestones.\n\nStudents can break assignments into small tasks and keep their project group informed without another long message thread."),
            new DemoProject("kauricare", "KauriCare", "Forest Signals", "student3", "2026 S2", "Python, FastAPI, TensorFlow", true, true,
                "A field observation tool for native forest restoration teams.\n\nVolunteers capture trail observations and review sample plant-health classifications. The prototype helps coordinators prioritise follow-up visits."),
            new DemoProject("cyclewise", "CycleWise", "Pedal Lab", "student", "2025 S2", "JavaScript, Node.js, PostgreSQL", true, false,
                "A cycling companion that compares route distance, hills, and reported hazards.\n\nThe dashboard highlights safer alternatives and helps new cyclists plan a comfortable commute."),
            new DemoProject("replate", "RePlate", "Second Serving", "student2", "2026 S1", "Vue, .NET 10, PostgreSQL", true, false,
                "A prototype connecting campus kitchens with community food partners.\n\nTrack available servings, arrange collection windows, and review a clear handover history to reduce avoidable waste."),
            new DemoProject("openmuse", "OpenMuse", "Pixel Workshop", "student3", "2025 S2", "Unity, C#, Blender", true, false,
                "An interactive digital exhibition for student artists.\n\nWalk through a small virtual gallery, open artwork stories, and explore how accessible controls can make online exhibitions more welcoming."),
            new DemoProject("signalsafe", "SignalSafe", "Street Sense", "student", "2026 S2", "C#, Vue, OpenStreetMap", true, false,
                "A community reporting board for broken crossing signals and unsafe intersections.\n\nA map and timeline help residents understand reported issues and see which reports have been resolved."),
            new DemoProject("makermatch", "MakerMatch", "Build Together", "student2", "2026 S1", ".NET 10, Vue, PostgreSQL", true, false,
                "A collaboration directory that helps students find teammates with complementary interests.\n\nBrowse skills, describe a project idea, and build a balanced group before the next capstone semester."),
            new DemoProject("waterline", "Waterline", "Blue Circuit", "student3", "2025 S2", "Python, Vue, IoT", true, false,
                "An educational dashboard for household water use.\n\nSample device readings show daily patterns, unusual usage, and progress toward a family conservation goal."),
            new DemoProject("helpdesk-ai", "HelpDesk AI", "Campus Answers", "student", "2026 S2", ".NET 10, Vue, PostgreSQL", false, false,
                "A searchable student-services knowledge base with suggested answers and source links.\n\nThis submission is awaiting review, giving administrators a realistic project to approve or decline."),
            new DemoProject("quiet-space", "Quiet Space", "Room to Focus", "student2", "2026 S2", "Vue, C#, SQLite", false, false,
                "A campus quiet-space finder with room features, availability notes, and accessibility details.\n\nThis project is still in the review queue and is visible to its owner and administrators."),
            new DemoProject("skillswap", "SkillSwap", "Learn in Pairs", "student3", "2026 S2", "React, .NET 10, PostgreSQL", false, false,
                "A peer-learning board where students trade short lessons and practical skills.\n\nThe team is testing topic tags, availability, and a clear session request flow before publication.")
        };
        var supporters = new[] { users["visitor"], users["student2"], users["visitor2"], users["student3"], users["visitor3"] };
        var commentTexts = new[]
        {
            "The overview makes the problem easy to understand. I would like to see this tested with a wider group.",
            "Great to see accessibility considered in the design. The team presentation is clear and well structured.",
            "Interesting use of the technology stack. What would you prioritise for the next version?"
        };

        for (var index = 0; index < fixtures.Length; index++)
        {
            var fixture = fixtures[index];
            var owner = users[fixture.Owner];
            var repository = $"https://example.com/democraft-demo/{fixture.Slug}";
            var project = await db.Projects.SingleOrDefaultAsync(p => p.OwnerID == owner.UserID && p.LinktoGit == repository);
            if (project is null)
            {
                project = new Project
                {
                    TeamName = fixture.Team,
                    TeamNumber = index + 1,
                    TeamMember = $"{owner.UserName}, Taylor Reed, Jamie Patel",
                    ProjectName = fixture.Name,
                    ProjectOverView = fixture.Overview,
                    Semester = fixture.Semester,
                    LanguageUsed = fixture.Languages,
                    LinktoGit = repository,
                    LinktoYoutube = "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
                    DateCreated = today.AddDays(-index * 3 - 2),
                    OwnerID = owner.UserID,
                    IsApproved = fixture.Approved,
                    IsWinner = fixture.Winner
                };
                db.Projects.Add(project);
                await db.SaveChangesAsync();
            }

            if (!fixture.Approved) continue;
            var supporterCount = index % supporters.Length + 1;
            for (var supporterIndex = 0; supporterIndex < supporterCount; supporterIndex++)
            {
                var supporter = supporters[supporterIndex];
                if (!await db.Likes.AnyAsync(l => l.ProjectID == project.ProjectID && l.UserID == supporter.UserID))
                    db.Likes.Add(new Like
                    {
                        ProjectID = project.ProjectID,
                        UserID = supporter.UserID,
                        UserName = supporter.UserName!,
                        DateLiked = project.DateCreated.AddHours(supporterIndex + 1)
                    });
            }
            for (var commentIndex = 0; commentIndex < commentTexts.Length; commentIndex++)
            {
                var commenter = supporters[(index + commentIndex) % supporters.Length];
                var text = commentTexts[commentIndex];
                if (!await db.Comments.AnyAsync(c => c.ProjectID == project.ProjectID && c.UserID == commenter.UserID && c.CommentText == text))
                    db.Comments.Add(new Comment
                    {
                        ProjectID = project.ProjectID,
                        UserID = commenter.UserID,
                        UserName = commenter.UserName,
                        CommentText = text,
                        DateTimes = project.DateCreated.AddHours(commentIndex + 6)
                    });
            }
            await db.SaveChangesAsync();
            project.LikeCount = await db.Likes.CountAsync(l => l.ProjectID == project.ProjectID);
        }

        await db.SaveChangesAsync();
        await transaction.CommitAsync();
        Console.WriteLine($"Demo data ready: {accounts.Length} accounts and {fixtures.Length} projects (12 published, 3 awaiting review), with profiles, comments and likes.");
        Console.WriteLine($"Local demo logins: admin@demo.test, student@demo.test, visitor@demo.test. Password: {DemoPassword}");
        Console.WriteLine("Existing account passwords and edited project details are preserved when this command is repeated.");
    }

    private sealed record DemoAccount(string Key, string Name, int RoleId, string Interests, string Languages);
    private sealed record DemoProject(string Slug, string Name, string Team, string Owner, string Semester,
        string Languages, bool Approved, bool Winner, string Overview);
}
