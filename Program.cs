using AIChatbot.Services;

var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddControllers();
builder.Services.AddOpenApi();


// Register FAQService
builder.Services.AddSingleton<FAQService>();
builder.Services.AddSingleton<ChatService>();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthorization();

// Register all controllers
app.MapControllers();

app.Run();