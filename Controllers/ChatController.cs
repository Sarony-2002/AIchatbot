using AIChatbot.Models;
using AIChatbot.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks; // Make sure this is here

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
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        // Added 'async Task<IActionResult>' above and 'await' here to process the request smoothly
        var response = await _chatService.GetResponseAsync(request.Message, request.Category);

        return Ok(new
        {
            response = response
        });
    }
}