using System.Linq.Expressions;

namespace SEP_JMS.Repository.IRepositories
{
    public interface IBaseRepository<T> where T : class
    {
        public Task<List<T>> GetAll(Expression<Func<T, bool>> conditions, int skip = 0, int top = 1000);

        public Task<int> Count(Expression<Func<T, bool>> conditions);

        public Task<T?> Get(object identifier);

        public Task<T> Add(T entity);

        public Task<int> Update(T entity);

        public Task<int> Delete(T entity);
    }
}
