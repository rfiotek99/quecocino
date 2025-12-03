const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

export async function searchByIngredients(ingredients, options = {}) {
  const {
    number = 12,
    ranking = 1,
    ignorePantry = true
  } = options;

  const ingredientsList = ingredients.join(',');
  
  const url = `${BASE_URL}/recipes/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${encodeURIComponent(ingredientsList)}&number=${number}&ranking=${ranking}&ignorePantry=${ignorePantry}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

export async function searchRecipesComplex(ingredients, filters = {}) {
  const {
    maxReadyTime,
    type,
    diet,
    number = 12
  } = filters;

  const params = new URLSearchParams({
    apiKey: SPOONACULAR_API_KEY,
    includeIngredients: ingredients.join(','),
    number: number.toString(),
    addRecipeInformation: 'true',
    fillIngredients: 'true',
    sort: 'max-used-ingredients'
  });

  if (maxReadyTime) {
    params.append('maxReadyTime', maxReadyTime.toString());
  }
  if (type) {
    params.append('type', type);
  }
  if (diet) {
    params.append('diet', diet);
  }

  const url = `${BASE_URL}/recipes/complexSearch?${params.toString()}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.results;
}

export async function getRecipeDetails(recipeId) {
  const url = `${BASE_URL}/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=false`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

export async function getRecipeInstructions(recipeId) {
  const url = `${BASE_URL}/recipes/${recipeId}/analyzedInstructions?apiKey=${SPOONACULAR_API_KEY}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

// Función para autocompletar ingredientes
export async function autocompleteIngredient(query) {
  const url = `${BASE_URL}/food/ingredients/autocomplete?apiKey=${SPOONACULAR_API_KEY}&query=${encodeURIComponent(query)}&number=5`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}
