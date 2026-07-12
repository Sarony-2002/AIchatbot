namespace AIChatbot.Models;

public class ChatRequest
{
    public string Message { get; set; } = string.Empty;

    // Optional: the category the user selected in the widget (matches FAQ.Category).
    // Narrows the search so answers are more accurate, mirroring the "choose a topic
    // for more accurate answers" behavior.
    public string? Category { get; set; }
}