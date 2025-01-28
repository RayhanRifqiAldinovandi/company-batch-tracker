namespace backend.Models
{
    public class User
    {
        public int id { get; set; }
        public required string username { get; set; }
        public required string password { get; set; }
        public required string email { get; set; }
        public required string name { get; set; }
        public required string department { get; set; } 
        public required string userType {  get; set; }
  
    }

    public class UserLogin
    {
        public required string username {  get; set; }
        public required string  password { get; set; }  
    }

    public class UserForgotPass
    {
        public required string email { get; set; }
        public string? resetToken { get; set; }
    }

    public class TokenRequest
    {
        public required string Token { get; set; }
    }

    public class UserResetPass
    {
        public required string username { get; set;}
        public required string newPassword { get; set;}
        public required string confirmNewPassword { get; set;}
        public string? resetToken { get; set; }
    }
}
