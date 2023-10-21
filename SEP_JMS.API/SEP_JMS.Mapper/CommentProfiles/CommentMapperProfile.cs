using AutoMapper;
using Newtonsoft.Json;
using SEP_JMS.Model.Api.Response.Comment;
using SEP_JMS.Model.Models.ExtensionModels;

namespace SEP_JMS.Mapper.CommentProfiles
{
    public class CommentModelToReplyCommentDetailsDisplayModelMapperProfile : Profile
    {
        public CommentModelToReplyCommentDetailsDisplayModelMapperProfile()
        {
            CreateMap<Model.Models.Comment, ReplyCommentDetailsDisplayModel>()
                .ForMember(des => des.User, opt => opt.Ignore())
                .ForMember(des => des.Attachments, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<FolderItem>(src.Attachments ?? string.Empty)));
        }
    }
    public class CommentModelToCommentDetailsDisplayModelMapperProfile : Profile
    {
        public CommentModelToCommentDetailsDisplayModelMapperProfile()
        {
            CreateMap<Model.Models.Comment, CommentDetailsDisplayModel>()
                .ForMember(des => des.User, opt => opt.Ignore())
                .ForMember(des => des.Attachments, opt => opt.MapFrom(src => JsonConvert.DeserializeObject<FolderItem>(src.Attachments ?? string.Empty)));
        }
    }
}
