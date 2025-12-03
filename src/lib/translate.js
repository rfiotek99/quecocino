import { translate } from '@vitalets/google-translate-api';

// Cache para evitar traducir lo mismo múltiples veces
const cache = new Map();

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function translateText(text, targetLang = 'es', retries = 2) {
  if (!text || typeof text !== 'string') return text;
  
  // Si el texto ya parece estar en español, no traducir
  const spanishIndicators = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'];
  const hasSpanishChars = spanishIndicators.some(char => text.toLowerCase().includes(char));
  if (hasSpanishChars && text.length < 50) {
    return text;
  }
  
  const cacheKey = `${text.substring(0, 100)}_${targetLang}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await translate(text, { to: targetLang });
      cache.set(cacheKey, result.text);
      return result.text;
    } catch (error) {
      console.error(`Error traduciendo (intento ${attempt + 1}):`, error.message);
      if (attempt < retries) {
        await sleep(500 * (attempt + 1)); // Esperar más cada intento
      }
    }
  }
  
  return text; // Devolver original si falla
}

export async function translateRecipe(recipe) {
  try {
    const translatedTitle = await translateText(recipe.title);
    
    const translatedUsedIngredients = await Promise.all(
      (recipe.usedIngredients || []).map(async (ing) => ({
        ...ing,
        name: await translateText(ing.name),
        original: await translateText(ing.original)
      }))
    );

    const translatedMissedIngredients = await Promise.all(
      (recipe.missedIngredients || []).map(async (ing) => ({
        ...ing,
        name: await translateText(ing.name),
        original: await translateText(ing.original)
      }))
    );

    return {
      ...recipe,
      title: translatedTitle,
      usedIngredients: translatedUsedIngredients,
      missedIngredients: translatedMissedIngredients
    };
  } catch (error) {
    console.error('Error traduciendo receta:', error);
    return recipe;
  }
}

export async function translateRecipeComplex(recipe) {
  try {
    const translatedTitle = await translateText(recipe.title);
    
    let translatedUsedIngredients = [];
    if (recipe.usedIngredients) {
      translatedUsedIngredients = await Promise.all(
        recipe.usedIngredients.map(async (ing) => ({
          ...ing,
          name: await translateText(ing.name),
          original: await translateText(ing.original)
        }))
      );
    }

    let translatedMissedIngredients = [];
    if (recipe.missedIngredients) {
      translatedMissedIngredients = await Promise.all(
        recipe.missedIngredients.map(async (ing) => ({
          ...ing,
          name: await translateText(ing.name),
          original: await translateText(ing.original)
        }))
      );
    }

    let translatedSummary = recipe.summary;
    if (recipe.summary) {
      const cleanSummary = recipe.summary.replace(/<[^>]*>/g, '').substring(0, 200);
      translatedSummary = await translateText(cleanSummary);
    }

    return {
      ...recipe,
      title: translatedTitle,
      summary: translatedSummary,
      usedIngredients: translatedUsedIngredients,
      missedIngredients: translatedMissedIngredients
    };
  } catch (error) {
    console.error('Error traduciendo receta:', error);
    return recipe;
  }
}

export async function translateRecipeDetails(details) {
  try {
    const translatedTitle = await translateText(details.title);
    
    const translatedIngredients = await Promise.all(
      (details.extendedIngredients || []).map(async (ing) => ({
        ...ing,
        original: await translateText(ing.original),
        name: await translateText(ing.name)
      }))
    );

    let translatedInstructions = details.instructions;
    if (details.instructions) {
      // Limpiar HTML y traducir
      const cleanInstructions = details.instructions.replace(/<[^>]*>/g, ' ').trim();
      translatedInstructions = await translateText(cleanInstructions);
    }

    let translatedAnalyzedInstructions = details.analyzedInstructions;
    if (details.analyzedInstructions?.[0]?.steps) {
      // Traducir cada paso individualmente con delay para evitar rate limiting
      const translatedSteps = [];
      for (const step of details.analyzedInstructions[0].steps) {
        const translatedStep = await translateText(step.step);
        translatedSteps.push({
          ...step,
          step: translatedStep
        });
        // Pequeño delay para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      translatedAnalyzedInstructions = [{
        ...details.analyzedInstructions[0],
        steps: translatedSteps
      }];
    }

    return {
      ...details,
      title: translatedTitle,
      extendedIngredients: translatedIngredients,
      instructions: translatedInstructions,
      analyzedInstructions: translatedAnalyzedInstructions
    };
  } catch (error) {
    console.error('Error traduciendo detalles:', error);
    return details;
  }
}
