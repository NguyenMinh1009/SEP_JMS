using Microsoft.EntityFrameworkCore;
using SEP_JMS.Model.Models;

namespace SEP_JSM.Repository.Repositories
{
    public class BaseRepository<T>
    {
        private readonly JSMContext _context;

        protected JSMContext Context { get => _context; }

        public BaseRepository(JSMContext context)
        {
            _context = context;
        }

        public async Task<T> Add(T entity)
        {
            if (entity == null) throw new NullReferenceException("data can not be null");
            await _context.AddAsync(entity);
            await _context.SaveChangesAsync();
            _context.Entry(entity).State = EntityState.Detached;
            return entity;
        }

        public async Task<int> Update(T entity)
        {
            if (entity == null) throw new NullReferenceException("data can not be null");
            _context.Update(entity);
            var count = await _context.SaveChangesAsync();
            _context.Entry(entity).State = EntityState.Detached;
            return count;
        }

        public async Task<int> Delete(T entity)
        {
            if (entity == null) throw new NullReferenceException("data can not be null");
            _context.Remove(entity);
            return await _context.SaveChangesAsync();
        }
    }
}
