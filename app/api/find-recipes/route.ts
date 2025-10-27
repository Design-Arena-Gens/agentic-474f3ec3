import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { ingredients, dietary, cuisine } = body;

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'No ingredients provided' },
        { status: 400 }
      );
    }

    // Build the prompt
    let prompt = `You are an expert chef and nutritionist. Based on the following ingredients: ${ingredients.join(', ')}, suggest 3 delicious recipes.`;

    if (dietary) {
      prompt += ` The recipes should be ${dietary}.`;
    }

    if (cuisine) {
      prompt += ` Focus on ${cuisine} cuisine.`;
    }

    prompt += `

For each recipe, provide:
1. Recipe name
2. Brief description (1-2 sentences)
3. Cook time
4. Number of servings
5. Difficulty level (Easy/Medium/Hard)
6. Complete list of ingredients with measurements
7. Step-by-step cooking instructions
8. Nutritional information per serving (calories, protein, carbs, fat)

Format your response as a JSON array with the following structure:
[
  {
    "name": "Recipe Name",
    "description": "Brief description",
    "cookTime": "30 minutes",
    "servings": "4 servings",
    "difficulty": "Easy",
    "ingredients": ["ingredient 1 with measurement", "ingredient 2 with measurement"],
    "instructions": ["step 1", "step 2"],
    "nutrition": {
      "calories": "350 kcal",
      "protein": "25g",
      "carbs": "40g",
      "fat": "12g"
    }
  }
]

Prioritize recipes that maximize the use of the provided ingredients. Be creative but practical.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert chef who creates detailed, practical recipes. Always respond with valid JSON only, no additional text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content || '[]';

    // Parse the JSON response
    let recipes;
    try {
      // Try to extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      recipes = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse recipes JSON:', parseError);
      recipes = [];
    }

    return NextResponse.json({ recipes });
  } catch (error: any) {
    console.error('Error finding recipes:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to find recipes' },
      { status: 500 }
    );
  }
}
