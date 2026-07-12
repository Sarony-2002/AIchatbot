using AIChatbot.Models;
using AIChatbot.Services;
using Microsoft.AspNetCore.Mvc;

namespace AIChatbot.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly ChatService _chatService;

    public ChatController(ChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpPost]
    public IActionResult Chat([FromBody] ChatRequest request)
    {
        var response = _chatService.GetResponse(request.Message);

        return Ok(new
        {
            response = response
        });
    }
}