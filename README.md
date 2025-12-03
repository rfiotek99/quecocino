# 🍳 ¿Qué Cocino?

Una aplicación web que te sugiere recetas basadas en los ingredientes que tenés disponibles.

## Características

- ✅ Agregá ingredientes que tenés en tu heladera
- ✅ Búsqueda inteligente de recetas por ingredientes
- ✅ Muestra porcentaje de "match" con tus ingredientes
- ✅ Detalle de recetas con instrucciones paso a paso
- ✅ Interfaz moderna y responsive

## Requisitos

- Node.js 18+
- Cuenta en Spoonacular (gratis)

## Instalación

1. Cloná el repositorio e instalá dependencias:

```bash
cd recetas-app
npm install
```

2. Creá tu archivo de variables de entorno:

```bash
cp .env.local.example .env.local
```

3. Obtené tu API key:
   - Andá a https://spoonacular.com/food-api
   - Registrate gratis (150 requests/día)
   - Copiá tu API key
   - Pegala en `.env.local`

4. Ejecutá el servidor de desarrollo:

```bash
npm run dev
```

5. Abrí http://localhost:3000

## Estructura del proyecto

```
recetas-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── recipes/
│   │   │       ├── search/route.js    # Endpoint búsqueda
│   │   │       └── [id]/route.js      # Endpoint detalle
│   │   ├── globals.css                # Estilos globales
│   │   ├── layout.js                  # Layout principal
│   │   └── page.js                    # Página home
│   ├── components/
│   │   ├── IngredientInput.js         # Input de ingredientes
│   │   ├── RecipeCard.js              # Tarjeta de receta
│   │   └── RecipeModal.js             # Modal con detalles
│   └── lib/
│       └── spoonacular.js             # Cliente API
├── .env.local.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

## API de Spoonacular

Usamos los siguientes endpoints:

- `findByIngredients` - Buscar recetas por ingredientes
- `recipes/{id}/information` - Obtener detalles de una receta

El tier gratuito incluye:
- 150 requests por día
- Acceso a todas las recetas
- Sin tarjeta de crédito

## Próximas funcionalidades

- [ ] Filtros por tipo de comida
- [ ] Filtros por tiempo de preparación
- [ ] Guardar recetas favoritas
- [ ] Historial de búsquedas
- [ ] Modo offline con recetas guardadas
- [ ] Traducción automática de recetas

## Tech Stack

- **Framework**: Next.js 14+
- **Estilos**: Tailwind CSS
- **API**: Spoonacular
- **Lenguaje**: JavaScript

---

Hecho con ❤️ para mamá
