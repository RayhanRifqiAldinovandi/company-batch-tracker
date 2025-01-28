namespace backend.Middleware
{
    public static class IpWhitelistMiddlewareExtensions
    {
        public static IApplicationBuilder UseIpWhitelistMiddleware(this IApplicationBuilder builder, string[] allowedIps)
        {
            return builder.UseMiddleware<IpWhitelistMiddleware>(allowedIps);
        }
    }
}