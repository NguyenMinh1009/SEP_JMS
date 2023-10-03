using System.ComponentModel.DataAnnotations;

namespace SEP_JMS.Model.Api.Request.User
{
    public class UserLoginRequest
    {
        [Required]
        public string Username { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }
}
