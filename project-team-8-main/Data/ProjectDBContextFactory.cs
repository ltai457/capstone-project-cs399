using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Project_Authentication.Data;

// EF tooling needs database configuration, but should not require JWT/Google secrets.
public sealed class ProjectDBContextFactory : IDesignTimeDbContextFactory<ProjectDBContext>
{
    public ProjectDBContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddJsonFile($"appsettings.{environment}.json", optional: true);

        if (environment == "Development")
            configuration.AddUserSecrets<ProjectDBContextFactory>();

        var settings = configuration.AddEnvironmentVariables().AddCommandLine(args).Build();
        var connectionString = settings.GetConnectionString("CS399Database");
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException("Set ConnectionStrings:CS399Database before running EF commands. See README.md.");

        return new ProjectDBContext(new DbContextOptionsBuilder<ProjectDBContext>()
            .UseNpgsql(connectionString).Options);
    }
}
