using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SEP_JMS.Common.Utils
{
    public class DataVerificationUtility
    {
        public static bool VerifyPasswordStrong(string password)
        {
            string pattern = @"^(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$";
            bool isMatch = Regex.IsMatch(password, pattern);
            return isMatch;
        }

        public static bool VerifyUsernameStrong(string username)
        {
            string pattern = "^[a-zA-Z0-9_-]{3,20}$";
            bool isMatch = Regex.IsMatch(username, pattern);
            return isMatch;
        }
    }
}
