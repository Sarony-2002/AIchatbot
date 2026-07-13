using AIChatbot.Models;
using AIChatbot.Services;
using Microsoft.AspNetCore.Mvc;

namespace AIChatbot.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly ChatService _chatService;
    private readonly FAQService _faqService;

    public ChatController(ChatService chatService, FAQService faqService)
    {
        _chatService = chatService;
        _faqService = faqService;
    }

    [HttpGet("faqs")]
    public IActionResult GetFaqs()
    {
        return Ok(_faqService.GetAll());
    }

    [HttpPost]
    public IActionResult Chat([FromBody] ChatRequest request)
    {
        var response = _chatService.GetResponse(request.Message, request.Category);

        return Ok(new
        {
            response = response
        });
    }
}
