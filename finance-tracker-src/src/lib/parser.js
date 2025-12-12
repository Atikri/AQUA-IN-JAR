
export const parseTransactionInput = (input) => {
    // Try to match: [Description] [Amount] [Category?]
    // Supports Chinese characters in description and category
    // Examples: "Lunch 15 Food", "Taxi 30", "午饭 30", "30 午饭"

    if (!input || !input.trim()) return null;

    const trimmed = input.trim();

    // Strategy: Find the number first.
    // We look for a number that stands alone or is surrounded by spaces/text
    const numberRegex = /(\d+(\.\d{1,2})?)/;
    const match = trimmed.match(numberRegex);

    if (!match) return null;

    const amountStr = match[0];
    const amount = parseFloat(amountStr);

    // Split the string by the number found
    const parts = trimmed.split(amountStr).map(p => p.trim()).filter(p => p.length > 0);

    let description = "Unknown";
    let category = "General";

    // Logic to determine Description vs Category based on parts
    if (parts.length === 0) {
        // Only number provided?
        description = "Quick Note";
    } else if (parts.length === 1) {
        // "Lunch" 15 OR 15 "Lunch" -> Both imply Description = Lunch, Category = General (default)
        // OR we could try to guess common categories if we had a list.
        // simpler: If it matches a known category, use it, else description.
        // For now: assume it's description.
        description = parts[0];
    } else if (parts.length >= 2) {
        // "Lunch" 15 "Food" -> Desc: Lunch, Cat: Food
        // 15 "Lunch" "Food" -> Desc: Lunch, Cat: Food (order is ambiguous, usually biggest text is desc?)
        // Let's assume: The longer string is Description, shorter is Category? Or First is Desc?
        // Convention: [Desc] [Amount] [Category]
        // If order was [Amount] [Desc] [Category] -> parts[0] is desc, parts[1] is cat.

        // Simplistic approach: First part found is desc, second is category
        description = parts[0];
        category = parts[1];
    }

    return {
        description,
        amount,
        category,
        date: new Date(),
        type: 'expense', // Default to expense for quick capture
        isRegret: false
    };
};
