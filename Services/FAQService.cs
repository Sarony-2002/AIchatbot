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
    
    public IReadOnlyList<FAQ> GetAll()
    {
        return _faqs;
    }


    public string? GetAnswer(string question, string? category = null)
    {
        // If the user picked a topic in the widget, search within that category first
        // so the match is more accurate (falls back to searching everything otherwise).
        if (!string.IsNullOrWhiteSpace(category))
        {
            var scoped = _faqs.Where(f =>
                f.Category.Equals(category, StringComparison.OrdinalIgnoreCase));

            var scopedMatch = scoped.FirstOrDefault(f =>
                f.Question.Contains(question, StringComparison.OrdinalIgnoreCase) ||
                question.Contains(f.Question, StringComparison.OrdinalIgnoreCase));

            if (scopedMatch != null)
            {
                return scopedMatch.Answer;
            }
        }

        var faq = _faqs.FirstOrDefault(f =>
            f.Question.Contains(question, StringComparison.OrdinalIgnoreCase) ||
            question.Contains(f.Question, StringComparison.OrdinalIgnoreCase));

        return faq?.Answer;
    }
}
