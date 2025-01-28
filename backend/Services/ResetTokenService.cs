using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Services
{
    public interface IResetTokenService
    {
        string GenerateResetToken(string email);
        bool IsTokenExpired(string token);
    }

    public class ResetTokenService : IResetTokenService
    {
        private readonly string _secretKey;

        public ResetTokenService(IConfiguration configuration)
        {
            _secretKey = "x8AfzQ9gqJ5YdvsX+44+0X5B0OG3hrxJ3c+bwscm/3c=\r\n"; // can be change manually or generate secret key code
        }

        public string GenerateResetToken(string email)
        {
            try
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Email, email),
                    new Claim("resetToken", "true")
                };

                var token = GenerateToken(claims);
                return token;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error generating reset token: {ex.Message}");
            }
        }

        // Check if the token expiration
        public bool IsTokenExpired(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero // No ClockSkew
                };

                tokenHandler.ValidateToken(token, validationParameters, out _);
                return false; // Token is not expired
            }
            catch (SecurityTokenExpiredException)
            {
                return true; // Token is expired
            }
            catch (Exception ex)
            {
                throw new Exception($"Error validating token: {ex.Message}");
            }
        }

        private string GenerateToken(IEnumerable<Claim> claims)
        {
            try
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
                var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var tokenOptions = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(60), // Example expiration time (adjust as needed)
                    signingCredentials: signingCredentials
                );

                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.WriteToken(tokenOptions);

                return token;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error generating JWT token: {ex.Message}");
            }
        }
    }
}
