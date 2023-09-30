using Microsoft.EntityFrameworkCore;
using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;
using System.Linq.Expressions;

namespace SEP_JMS.Repository.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        private readonly JSMContext _context;

        protected JSMContext Context { get => _context; }

        public BaseRepository(JSMContext context)
        {
            _context = context;
        }

        public async Task<List<T>> GetAll(Expression<Func<T, bool>> conditions, int skip = 0, int top = 1000)
        {
            return await _context.Set<T>().Where(conditions)
                 .Skip(skip).Take(top).AsNoTracking().ToListAsync();
        }

        public async Task<T?> Get(object identifier)
        {
            return await _context.Set<T>().FindAsync(identifier);
        }

        public async Task<T> Add(T entity)
        {
            if (entity == null) throw new NullReferenceException("adding data can not be null");
            await _context.AddAsync(entity);
            await _context.SaveChangesAsync();
            _context.Entry(entity).State = EntityState.Detached;
            return entity;
        }

        public async Task<int> Update(T entity)
        {
            if (entity == null) throw new NullReferenceException("updating data can not be null");
            _context.Update(entity);
            var count = await _context.SaveChangesAsync();
            _context.Entry(entity).State = EntityState.Detached;
            return count;
        }

        public async Task<int> Delete(T entity)
        {
            if (entity == null) throw new NullReferenceException("deleting data can not be null");
            _context.Remove(entity);
            return await _context.SaveChangesAsync();
        }
    }
}
