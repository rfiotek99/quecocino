import { NextResponse } from 'next/server';
import { searchByIngredients, searchRecipesComplex } from '@/lib/spoonacular';
import { translateRecipe, translateRecipeComplex } from '@/lib/translate';

// Mapa de ingredientes comunes español -> inglés
const ingredientMap = {
  'pollo': 'chicken',
  'carne': 'beef',
  'cerdo': 'pork',
  'pescado': 'fish',
  'arroz': 'rice',
  'pasta': 'pasta',
  'fideos': 'noodles',
  'tomate': 'tomato',
  'tomates': 'tomatoes',
  'cebolla': 'onion',
  'cebollas': 'onions',
  'ajo': 'garlic',
  'huevo': 'egg',
  'huevos': 'eggs',
  'queso': 'cheese',
  'papa': 'potato',
  'papas': 'potatoes',
  'patata': 'potato',
  'patatas': 'potatoes',
  'zanahoria': 'carrot',
  'zanahorias': 'carrots',
  'lechuga': 'lettuce',
  'espinaca': 'spinach',
  'brocoli': 'broccoli',
  'brócoli': 'broccoli',
  'pimiento': 'pepper',
  'pimientos': 'peppers',
  'champiñon': 'mushroom',
  'champiñones': 'mushrooms',
  'hongos': 'mushrooms',
  'leche': 'milk',
  'crema': 'cream',
  'manteca': 'butter',
  'mantequilla': 'butter',
  'aceite': 'oil',
  'sal': 'salt',
  'pimienta': 'pepper',
  'azucar': 'sugar',
  'azúcar': 'sugar',
  'harina': 'flour',
  'pan': 'bread',
  'limon': 'lemon',
  'limón': 'lemon',
  'naranja': 'orange',
  'manzana': 'apple',
  'banana': 'banana',
  'frutilla': 'strawberry',
  'frutillas': 'strawberries',
  'atun': 'tuna',
  'atún': 'tuna',
  'salmon': 'salmon',
  'salmón': 'salmon',
  'camarones': 'shrimp',
  'jamon': 'ham',
  'jamón': 'ham',
  'tocino': 'bacon',
  'salchicha': 'sausage',
  'salchichas': 'sausages',
  'lentejas': 'lentils',
  'garbanzos': 'chickpeas',
  'porotos': 'beans',
  'frijoles': 'beans',
  'choclo': 'corn',
  'maiz': 'corn',
  'maíz': 'corn',
  'calabaza': 'pumpkin',
  'zapallo': 'squash',
  'berenjena': 'eggplant',
  'pepino': 'cucumber',
  'apio': 'celery',
  'perejil': 'parsley',
  'cilantro': 'cilantro',
  'albahaca': 'basil',
  'oregano': 'oregano',
  'orégano': 'oregano',
  'romero': 'rosemary',
  'tomillo': 'thyme',
  'curry': 'curry',
  'comino': 'cumin',
  'palta': 'avocado',
  'aguacate': 'avocado',
  'mayonesa': 'mayonnaise',
  'mostaza': 'mustard',
  'ketchup': 'ketchup',
  'salsa': 'sauce',
  'vinagre': 'vinegar',
  'miel': 'honey',
  'chocolate': 'chocolate',
  'vainilla': 'vanilla',
  'canela': 'cinnamon',
  'nuez': 'walnut',
  'nueces': 'walnuts',
  'almendra': 'almond',
  'almendras': 'almonds',
  'mani': 'peanut',
  'maní': 'peanut'
};

function translateIngredientToEnglish(ingredient) {
  const lower = ingredient.toLowerCase().trim();
  return ingredientMap[lower] || ingredient;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ingredients = searchParams.get('ingredients');
  const maxReadyTime = searchParams.get('maxReadyTime');
  const type = searchParams.get('type');
  const diet = searchParams.get('diet');
  
  if (!ingredients) {
    return NextResponse.json(
      { error: 'Se requieren ingredientes' },
      { status: 400 }
    );
  }

  try {
    const ingredientsList = ingredients
      .split(',')
      .map(i => translateIngredientToEnglish(i.trim()))
      .filter(Boolean);
    
    console.log('Buscando con ingredientes:', ingredientsList);
    
    const hasFilters = maxReadyTime || type || diet;
    
    let recipes;
    
    if (hasFilters) {
      // Usar búsqueda compleja con filtros
      recipes = await searchRecipesComplex(ingredientsList, {
        maxReadyTime: maxReadyTime ? Number(maxReadyTime) : null,
        type: type || null,
        diet: diet || null
      });
      
      // Traducir resultados
      const translatedRecipes = await Promise.all(
        recipes.map(recipe => translateRecipeComplex(recipe))
      );
      
      return NextResponse.json(translatedRecipes);
    } else {
      // Usar búsqueda simple por ingredientes
      recipes = await searchByIngredients(ingredientsList);
      
      const translatedRecipes = await Promise.all(
        recipes.map(recipe => translateRecipe(recipe))
      );
      
      return NextResponse.json(translatedRecipes);
    }
  } catch (error) {
    console.error('Error buscando recetas:', error);
    return NextResponse.json(
      { error: 'Error al buscar recetas' },
      { status: 500 }
    );
  }
}
