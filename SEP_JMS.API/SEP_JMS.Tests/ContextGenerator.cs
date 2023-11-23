using Microsoft.EntityFrameworkCore;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.Repositories;

namespace SEP_JMS.Tests
{
    public static class ContextGenerator
    {
        public static readonly JSMContext Instance = Generate();
        public static JSMContext Generate()
        {
            var optionBuilder = new DbContextOptionsBuilder<JSMContext>()
                .UseInMemoryDatabase("SEP_JMS_Test");
            return new JSMContext(optionBuilder.Options);
        }

        public static T GetRepository<T, TEntity>() 
            where T : BaseRepository<TEntity>
            where TEntity : class
        {
            var instance = Activator.CreateInstance(typeof(T), Instance);
            return (T?)instance ?? throw new Exception($"Can't create instance of {typeof(T).FullName}");
        }
    }
}
