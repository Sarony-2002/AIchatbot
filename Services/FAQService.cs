using System.Text.Json;
using AIChatbot.Models;

namespace AIChatbot.Services;

public class FAQService
{
    private readonly List<FAQ> _faqs;

    public FAQService()
    {
        var filePath = Path.Combine(AppContext.BaseDirectory, "questions.json");

        Console.WriteLine($"File Path: {filePath}");

        if (File.Exists(filePath))
        {
            var json = File.ReadAllText(filePath);

            Console.WriteLine("===== JSON CONTENT =====");
            Console.WriteLine(json);

            _faqs = JsonSerializer.Deserialize<List<FAQ>>(
                json,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }
            ) ?? new List<FAQ>();

            Console.WriteLine($"Loaded FAQs: {_faqs.Count}");

            foreach (var faq in _faqs)
            {
                Console.WriteLine($"Question = '{faq.Question}'");
            }
        }
        else
        {
            Console.WriteLine("questions.json NOT FOUND!");

            _faqs = new List<FAQ>();
        }
    }
    

    public string? GetAnswer(string question)
    {
        var faq = _faqs.FirstOrDefault(f =>
            f.Question.Contains(question, StringComparison.OrdinalIgnoreCase) ||
            question.Contains(f.Question, StringComparison.OrdinalIgnoreCase));

        return faq?.Answer;
    }
}