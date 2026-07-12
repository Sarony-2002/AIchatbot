using AIChatbot.Services;

namespace AIChatbot.Services;

public class ChatService
{
    private readonly FAQService _faqService;

    public ChatService(FAQService faqService)
    {
        _faqService = faqService;
    }

    public string GetResponse(string message, string? category = null)
    {
        var answer = _faqService.GetAnswer(message, category);

        if (answer != null)
        {
            return answer;
        }

        return "I couldn't find an answer.";
    }
}