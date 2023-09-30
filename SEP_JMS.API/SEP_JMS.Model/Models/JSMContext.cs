using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace SEP_JMS.Model.Models
{
    public class JSMContext : DbContext
    {
        public JSMContext() { }

        public JSMContext(DbContextOptions<JSMContext> options)
            : base(options) { }

        public DbSet<Comment> Comments { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Price> Prices { get; set; }
        public DbSet<PriceGroup> PriceGroups { get; set; }
        public DbSet<TypeOfJob> TypeOfJobs { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var connectionString = new ConfigurationBuilder().AddJsonFile("dbconfig.json")
                    .Build()["DBConnectionString"];
                optionsBuilder.UseSqlServer(connectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Comment>().ToTable("Comment");
            modelBuilder.Entity<Company>().ToTable("Company");
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<Job>().ToTable("Job");
            modelBuilder.Entity<TypeOfJob>().ToTable("TypeOfJob");
            modelBuilder.Entity<Price>().ToTable("Price");
            modelBuilder.Entity<PriceGroup>().ToTable("PriceGroup");
        }
    }
}
