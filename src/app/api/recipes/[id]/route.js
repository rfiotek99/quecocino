import { NextResponse } from 'next/server';
import { getRecipeDetails } from '@/lib/spoonacular';
import { translateRecipeDetails } from '@/lib/translate';

export async function GET(request, { params }) {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json(
      { error: 'Se requiere ID de receta' },
      { status: 400 }
    );
  }

  try {
    const recipe = await getRecipeDetails(id);
    
    // Traducir detalles al español
    const translatedRecipe = await translateRecipeDetails(recipe);
    
    return NextResponse.json(translatedRecipe);
  } catch (error) {
    console.error('Error obteniendo receta:', error);
    return NextResponse.json(
      { error: 'Error al obtener la receta' },
      { status: 500 }
    );
  }
}
