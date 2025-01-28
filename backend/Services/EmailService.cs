using System;
using System.Net;
using System.Net.Mail;

public class EmailService
{
    private readonly IConfiguration _configuration;
    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public IConfiguration Get_configuration()
    {
        return _configuration;
    }

    public bool SendResetPasswordEmail (string recipientEmail, string resetToken, IConfiguration _configuration)
    {
        

        try
        {
            string smtpServer = _configuration["SmtpSettings:Server"];
            int smtpPort = int.Parse(_configuration["SmtpSettings:Port"]);
            string smtpUsername = _configuration["SmtpSettings:Username"];
            string smtpPassword = _configuration["SmtpSettings:Password"];

            using (SmtpClient client = new SmtpClient(smtpServer, smtpPort))
            {
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                client.EnableSsl = true;
                client.Timeout = 10000;

                MailMessage message = new MailMessage();
                message.From = new MailAddress(smtpUsername); // change this according your own SMTP email address
                message.To.Add(recipientEmail);
                message.Subject = "Reset Password"; // change this code to set the subject of the email
                message.Body = $"Click this link to reset your password : http://localhost:3000/reset-password?token={resetToken}"; // change this code to set the body of the email

                client.Send(message);
            }
            Console.WriteLine("Email sent successully");
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send Email: {ex.Message}");
            return false;
        }
    }
}