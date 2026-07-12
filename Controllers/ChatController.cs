using Microsoft.AspNetCore.Mvc;

namespace AIChatbot.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    [HttpGet]
    public IActionResult Test()
    {
        return Ok("Chatbot backend is working!");
    }
}