using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Tests
{
    public static class Global
    {
        public readonly static IMapper Mapper = new MapperConfiguration(config => config.AddMaps(Assembly.Load("SEP_JMS.Mapper"))).CreateMapper();
    }
}
