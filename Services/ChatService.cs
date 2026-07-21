using System;
using System.IO;
using System.Threading.Tasks; 
using Google.GenAI;
using Google.GenAI.Types;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace AIChatbot.Services;

public class ChatService
{
    private readonly FAQService _faqService;
    private readonly string _apiKey;

    public ChatService(FAQService faqService, IConfiguration configuration)
    {
        _faqService = faqService;
        _apiKey = configuration["Gemini:ApiKey"] ?? throw new ArgumentNullException("Gemini API Key configuration is missing.");
    }

    // Task<string> and async allows smooth, non-blocking network requests
    public async Task<string> GetResponseAsync(string message, string? category = null)
    {
        // 1. Check your local JSON FAQs first
        var answer = _faqService.GetAnswer(message, category);
        if (answer != null)
        {
            return answer;
        }

        // 2. Fallback to Gemini if the message isn't a default question
        try
        {
            var client = new Client(apiKey: _apiKey);

            // Using 'await' with the updated "gemini-3.5-flash" model 
            var response = await client.Models.GenerateContentAsync(
                model: "gemini-3.5-flash", 
                contents: message,
                config: new GenerateContentConfig()
                {
                    SystemInstruction = new Content 
                    { 
                        Parts = new List<Part> 
                        { 
                            new Part { Text = "أنت مساعد ذكي ومؤدب لمنصة تصنيع هندسي متقدم. يجب أن تجيب دائماً باللغة العربية الفصحى المبسطة والحديثة. تجنب تماماً استخدام الكلمات والمصطلحات التي تنتمي لثقافات أو لهجات عربية أخرى (مثل تجنب قول 'يا فندم'). اجعل أسلوبك مهنياً، خليجياً في روح الترحيب، واضحاً، ومختصراً للغاية." } 
                        } 
                    }
                }
            );

            return response.Text ?? "لم أتمكن من معالجة الرد حالياً، يرجى المحاولة مرة أخرى.";
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Gemini Integration Error: {ex.Message}");
            return "أواجه صعوبة في الاتصال بالخادم الذكي حالياً. يرجى إعادة محاولة سؤالي بعد قليل!";
        }
    }
}