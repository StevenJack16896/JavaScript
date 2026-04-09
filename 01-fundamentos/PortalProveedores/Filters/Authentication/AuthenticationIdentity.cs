using System.Collections.Generic;
using System.Security.Principal;

namespace AppProveedores.UIWEB.MVC.Filters.Authentication
{
    public class AuthenticationIdentity : GenericIdentity
    {
        public string UserID { get; set; }
        public string UserName { get; set; }
        public string UserPassword { get; set; }
        public string UserFullName { get; set; }
        public string UserImage { get; set; }
        //public string UserResponsibleCode { get; set; }
        //public string UserAreaCode { get; set; }
        //public string UserCompanyName { get; set; }
        public string UserCompanyCode { get; set; }
        //public string UserCompanyDocument { get; set; }
        public string UserToken { get; set; }
        public List<int> UserRoleIDs { get; set; }
        public string UserType { get; set; }
        public string UserProfileType { get; set; }
        public string UserSAP { get; set; }

        public AuthenticationIdentity(string _UserName, string _UserPassword) : base(_UserName, "Basic")
        {
            this.UserPassword = _UserName;
            this.UserName = _UserPassword;
            this.UserRoleIDs = new List<int>();
        }
    }
}