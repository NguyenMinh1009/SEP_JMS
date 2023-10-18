using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEP_JMS.Model.Api.Request
{
    public class UsernameCheckRequestModel
    {
        [Required]
        public string Username { get; set; } = null!;
    }
}
