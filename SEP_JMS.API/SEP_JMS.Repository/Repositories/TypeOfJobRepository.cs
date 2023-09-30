using SEP_JMS.Model.Models;
using SEP_JMS.Repository.IRepositories;

namespace SEP_JMS.Repository.Repositories
{
    public class TypeOfJobRepository : BaseRepository<TypeOfJob>, ITypeOfJobRepository
    {
        public TypeOfJobRepository(JSMContext context) : base(context)
        {
        }
    }
}
