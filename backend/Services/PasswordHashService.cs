using System.Security.Cryptography;
using System.Text;

namespace backend.Services
{
    public class PasswordHashService
    {
        public string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {
            var hashedInputBytes = Convert.FromBase64String(hashedPassword);
            using (var sha256 = SHA256.Create())
            {
                var hashedInput = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));

                if (hashedInput.Length != hashedInputBytes.Length)
                {
                    return false;
                }

                for (int i = 0; i < hashedInputBytes.Length; i++)
                {
                    if (hashedInput[i] != hashedInputBytes[i])
                    {
                        return false;
                    }
                }
            }
            return true;
        }
    }
}
