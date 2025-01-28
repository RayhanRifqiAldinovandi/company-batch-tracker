using backend.Services;

var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    builder.Services.AddControllers();
    builder.Services.AddScoped<PasswordHashService>();
    builder.Services.AddScoped<EmailService>();
    builder.Services.AddScoped<JwtService>();
    builder.Services.AddScoped<ResetTokenService>();


    // Add configuration from appsettings.json
    builder.Configuration.AddJsonFile("appsettings.json");

    var app = builder.Build();

    // Enable CORS
    app.UseCors(options =>
    {
        options.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });

    // Configure the HTTP request pipeline.
    if (!app.Environment.IsDevelopment())
    {
        app.UseExceptionHandler("/Home/Error");
    }

    app.UseStaticFiles();

    app.UseAuthentication();

    app.UseAuthorization();

    app.UseRouting();

    app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

    app.MapControllers();

    app.Run();
