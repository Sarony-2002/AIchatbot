using AIChatbot.Services;
using Microsoft.AspNetCore.Mvc;

namespace AIChatbot.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly FAQService _faqService;

    public ChatController(FAQService faqService)
    {
        _faqService = faqService;
    }

    [HttpGet]
    public IActionResult Test(string question)
    {
        var answer = _faqService.GetAnswer(question);

        if (answer == null)
        {
            return NotFound("Question not found.");
        }

        return Ok(answer);
    }
}