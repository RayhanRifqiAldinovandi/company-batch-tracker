namespace backend.Middleware
{
    public class IpWhitelistMiddleware : IMiddleware
    {
        private readonly string[] _allowedIps;

        public IpWhitelistMiddleware()
        {
            _allowedIps = ["127.0.0.1", "localhost" ];
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            var ipAddress = context.Connection.RemoteIpAddress.ToString();
            if (!_allowedIps.Contains(ipAddress))
            {
                context.Response.StatusCode = 403; // Forbidden
                await context.Response.WriteAsync("Access denied. IP address not whitelisted.");
                return;
            }

            await next(context);
        }
    }
}