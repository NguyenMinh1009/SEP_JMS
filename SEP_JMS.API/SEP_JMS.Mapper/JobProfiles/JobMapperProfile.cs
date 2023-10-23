using AutoMapper;
using Newtonsoft.Json;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Models.ExtensionModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Mapper.JobProfiles
{

    public class JobModelToInternalJobDetailsDisplayModelMapperProfile : Profile
    {
        public JobModelToInternalJobDetailsDisplayModelMapperProfile()
        {
            CreateMap<Model.Models.Job, InternalJobDetailsDisplayModel>()
                .ForMember(des => des.Requirements, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<FolderItem>(src.Requirements ?? string.Empty)))
                .ForMember(des => des.FinalProducts, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<FolderItem>(src.FinalProducts ?? string.Empty)))
                .ForMember(dest => dest.PreviewProducts, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<FolderItem>(src.FinalPreview ?? string.Empty)))
                .ForMember(des => des.Account, opt => opt.Ignore())
                .ForMember(des => des.Customer, opt => opt.Ignore())
                .ForMember(des => des.Designer, opt => opt.Ignore())
                .ForMember(des => des.CreatedBy, opt => opt.Ignore())
                .ForMember(des => des.JobType, opt => opt.Ignore())
                .ForMember(des => des.Company, opt => opt.Ignore());
        }
    }
}
