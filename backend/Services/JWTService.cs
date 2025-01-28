using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public interface IJwtService
    {
        string GenerateJwtToken(string username, string userType, string department, string name);
        ClaimsPrincipal DecodeJwtToken(string token);
        IEnumerable<Claim> ExtractClaims(string token);
    }

    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;
        private readonly string _secretKey;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
            _secretKey = "x8AfzQ9gqJ5YdvsX+44+0X5B0OG3hrxJ3c+bwscm/3c=\r\n"; // can be changed manually or generate secret key code
        }

        public string GenerateJwtToken(string username, string userType, string department, string name)
        {
            var claims = new List<Claim>
            {
                new Claim("username", username),
                new Claim("name", name),
                new Claim("userType", userType),
                new Claim("department", department)
            };

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpiresInMinutes"])),
                signingCredentials: signingCredentials
            );

            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return token;
        }

        public ClaimsPrincipal DecodeJwtToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey)),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(5)
            };

            try
            {
                var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
                return principal;
            }
            catch (SecurityTokenException ex)
            {
                // Log the details of the inner exception for debugging purposes
                Console.WriteLine($"Inner Exception Message: {ex.InnerException?.Message}");
                Console.WriteLine($"Inner Exception Stack Trace: {ex.InnerException?.StackTrace}");

                // Rethrow the exception with a custom message
                throw new SecurityTokenException("Token Validation Failed", ex);
            }

        }

        public IEnumerable<Claim> ExtractClaims(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = (JwtSecurityToken)tokenHandler.ReadToken(token);
            return jwtToken.Claims;
        }
    }
}
