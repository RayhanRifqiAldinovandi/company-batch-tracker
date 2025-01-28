using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using backend.Models;
using Microsoft.AspNetCore.Cors;
using System.Security.Claims;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using System.Xml.Linq;
using System.Reflection.Metadata.Ecma335;


namespace backend.Controllers
{
    [ApiController]
    [Route("api")]

    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly PasswordHashService _passwordHashService;
        private readonly EmailService _emailService;
        private readonly IJwtService _jwtService;
        private readonly IResetTokenService _resetTokenService;

        public LoginController(IConfiguration configuration, PasswordHashService passwordHashService, EmailService emailService, JwtService jwtService, ResetTokenService resetTokenService)
        {
            _configuration = configuration;
            _passwordHashService = passwordHashService;
            _emailService = emailService;
            _jwtService = jwtService;
            _resetTokenService = resetTokenService;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        }


        //REGISTER (MANAGE USER) ENDPOINT
        [EnableCors("AllowAll")]
        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                Console.WriteLine("Authorization not found");
            }

            var token = authHeader.Substring("Bearer ".Length);
            try
            {
                uploadRegister(token,user.username);
                using (var connection = GetConnection())
                {
                    connection.Open();

                    //check username availability
                    var checkQuery = "SELECT COUNT(*) FROM login WHERE username = @username";
                    using (var checkCommand = new MySqlCommand(checkQuery, connection))
                    {
                        checkCommand.Parameters.AddWithValue("@username", user.username);
                        int ExistingUserCount = Convert.ToInt32(checkCommand.ExecuteScalar());
                        if (ExistingUserCount > 0)
                        {
                            return Conflict("Username Already Exist");
                        }
                    }

                    //register new user
                    var hashedPassword = _passwordHashService.HashPassword(user.password);
                    var query = "INSERT INTO login (username, password, email, name, department, userType) VALUES (@username, @password, @email, @name, @department, @userType)";
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@username", user.username);
                        cmd.Parameters.AddWithValue("@password", hashedPassword);
                        cmd.Parameters.AddWithValue("@email", user.email);
                        cmd.Parameters.AddWithValue("@name", user.name);
                        cmd.Parameters.AddWithValue("@department", user.department);
                        cmd.Parameters.AddWithValue("@userType", user.userType);

                        try
                        {
                            int rowsAffected = cmd.ExecuteNonQuery();
                            if (rowsAffected > 0)
                            {
                                return Ok("Registration Successful");
                            }
                            else
                            {
                                return BadRequest("Registration Failed");
                            }
                        }
                        catch (Exception ex)
                        {
                            return StatusCode(500, $"An error occurred : {ex.Message}");
                        }
                    }

                   
                }
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
            
        }

        public void uploadRegister(string token, string newUsername)
        {

            try
            {
                var claims = _jwtService.ExtractClaims(token);  // Get all claims

                // Find the claim with the "username" key
                var rawUsername = claims.FirstOrDefault(c => c.Type == "username").Value;
                var username = rawUsername.Replace("username:", ""); // This will give "adminwarehouse"
                using (var connection = GetConnection())
                {
                    connection.Open();
                    var query = $"INSERT INTO audit_trail (user,action,timestamp,request_data) VALUES (@username,'Create User',NOW(),'Create User {newUsername}')";
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@username", username);

                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error: {e}");
            }



        }


        // LOGIN ENDPOINT
        [EnableCors("AllowAll")]
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLogin user)
        {
            using (var connection = GetConnection())
            {
                connection.Open();
                var query = "SELECT password, usertype, department, name FROM login WHERE username = @username";
                using (var cmd = new MySqlCommand(query, connection))
                {
                    cmd.Parameters.AddWithValue("@username", user.username);
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var hashedPasswordFromDb = reader.GetString("password");
                            var usertype = reader.GetString("userType");
                            var department = reader.GetString("department");
                            var name = reader.GetString("name");

                            // Decode the hashed password from database to confirm the inputted password
                            if (_passwordHashService.VerifyPassword(user.password, hashedPasswordFromDb))
                            {
                                // Generate JWT token with user claims
                                var claims = new List<Claim>()
                                {
                                    new Claim("username", user.username),
                                    new Claim("name", name),
                                    new Claim("userType", usertype),
                                    new Claim("department", department)
                                };

                                var jwtToken = _jwtService.GenerateJwtToken(user.username, usertype, department, name);

                                uploadLogin(name);
                               

                                // Return JWT token in response
                                return Ok(new { token = jwtToken, username = user.username, userType = usertype, department = department, name = name });
                            }
                            else
                            {
                                return BadRequest("Invalid Password");
                            }
                        }
                        else
                        {
                            return BadRequest("Invalid Username");
                        }
                    }

                    
                }
            }
        }


        //Helper code to upload login record to audit_trail
        public void uploadLogin(string username)
        {
            using (var conn = GetConnection())
            {
                conn.Open();
                var audit = "INSERT INTO audit_trail (user,action,timestamp,request_data) VALUES (@username, 'Login',NOW(),'User Data')";

                using (var insertCmd = new MySqlCommand(audit, conn))
                {
                    insertCmd.Parameters.AddWithValue("@username", username);
                    insertCmd.ExecuteNonQuery();
                }
            }
          
        }


        // FORGOT-PASSWORD ENDPOINT
        [EnableCors("AllowAll")]
        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword(UserForgotPass user)
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();

                    // Check if the email exists in the database
                    var checkQuery = "SELECT COUNT(*) FROM login WHERE email = @email";
                    using (var cmd = new MySqlCommand(checkQuery, connection))
                    {
                        cmd.Parameters.AddWithValue("@email", user.email);
                        int existingEmailCount = Convert.ToInt32(cmd.ExecuteScalar());
                        if (existingEmailCount == 0)
                        {
                            return NotFound("Email not found");
                        }
                    }

                    // Generate a reset token
                    string resetToken = _resetTokenService.GenerateResetToken(user.email);

                    // Store the reset token in the database
                    var updateQuery = "UPDATE login SET resetToken = @resetToken WHERE email = @email";
                    using (var cmd = new MySqlCommand(updateQuery, connection))
                    {
                        cmd.Parameters.AddWithValue("@resetToken", resetToken);
                        cmd.Parameters.AddWithValue("@email", user.email);
                        int rowsAffected = cmd.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return StatusCode(500, "Failed to update reset token");
                        }
                    }

                    // Send reset password email
                    bool emailSent = _emailService.SendResetPasswordEmail(user.email, resetToken, _emailService.Get_configuration());
                    if (!emailSent)
                    {
                        return StatusCode(500, "Failed to send reset password email. Please try again later.");
                    }

                    return Ok("Email sent successfully");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, $"An error occurred while processing the request: {ex.Message}");
            }
        }


        [EnableCors("AllowAll")]
        [HttpPost("reset-password")]
        public IActionResult ResetPassword(UserResetPass user)
        {
            ///Get token

            using (var connection = GetConnection())
            {
                try
                {
                    connection.Open();
                    var checkUsernameQuery = "SELECT COUNT(*) FROM login WHERE username = @username";
                    using (var cmd = new MySqlCommand(checkUsernameQuery, connection))
                    {
                        cmd.Parameters.AddWithValue("@Username", user.username);
                        object result = cmd.ExecuteScalar();
                        int ExistingUsernameCount = Convert.ToInt32(result ?? 0);
                        if (ExistingUsernameCount == 0)
                        {
                            return StatusCode(404, "Username not found");
                        }
                    }

                    var getTokenQuery = "SELECT resetToken FROM login WHERE username = @Username";
                    string? storedResetToken = null;
                    using (var cmd = new MySqlCommand(getTokenQuery, connection))
                    {
                        cmd.Parameters.AddWithValue("@Username", user.username);
                        using (var reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                storedResetToken = reader.GetString("resetToken");
                            }
                        }
                    }

                    var hashedPassword = _passwordHashService.HashPassword(user.newPassword);
                    var updateQuery = "UPDATE login SET password = @Password WHERE username = @Username";
                    using (var cmd = new MySqlCommand(updateQuery, connection))
                    {
                        cmd.Parameters.AddWithValue("@Password", hashedPassword);
                        cmd.Parameters.AddWithValue("@Username", user.username);
                        cmd.ExecuteNonQuery();
                    }

                    var clearTokenQuery = "UPDATE login SET resetToken = NULL WHERE username = @Username";
                    using (var cmd = new MySqlCommand(clearTokenQuery, connection))
                    {
                        cmd.Parameters.AddWithValue("@Username", user.username);
                        cmd.ExecuteNonQuery();
                    }
                    /*uploadResetPassword(user.username);*/
                    return Ok("Password reset successfully");
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"An error occurred while updating the password: {ex.Message}");
                }
            }
        }
        public void uploadResetPassword(string username)
        {

            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();
                    var query = $"INSERT INTO audit_trail (user,action,timestamp,request_data) VALUES (@username,'Reset Password',NOW(),'User {username} Reset Password')";
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@username", username);
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error: {e}");
            }



        }



[EnableCors("AllowAll")]
[HttpPost("logout")]

public IActionResult Logout() 
{
    var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();

    if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
    {
        Console.WriteLine("Authorization not found");
    }

    var token = authHeader.Substring("Bearer ".Length);

    uploadlogout(token);
       
    return Ok("Logout Successfully");
}

//Helper code to upload logout activity to audit trail
public void uploadlogout(string token)
{
    
    try
    {
        var claims = _jwtService.ExtractClaims(token);  // Get all claims

        // Find the claim with the "username" key
        var rawUsername = claims.FirstOrDefault(c => c.Type == "username").Value;
        var username = rawUsername.Replace("username:", ""); // This will give "adminwarehouse"
        using (var connection = GetConnection())
        {
            connection.Open();
            var query = $"INSERT INTO audit_trail (user,action,timestamp,request_data) VALUES (@username,'Logout',NOW(),'User {username} logout')";
            using (var cmd = new MySqlCommand(query, connection))
            {
                cmd.Parameters.AddWithValue("@username",username);
                cmd.ExecuteNonQuery();
            }
        }
    }
    catch (Exception e)
    {
        Console.WriteLine($"Error: {e}");
    }



}
    }
}
