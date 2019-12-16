import { postRecipe } from './services/recipe-api.js';
const recipeInputForm = document.getElementById('recipe-input-form');

recipeInputForm.addEventListener('submit', event => {
  event.preventDefault();
  const recipeInputData = new FormData(recipeInputForm);
  const name = recipeInputData.get('name');

  const directions = [recipeInputData.get('directions')];
  const recipeData = {
    name,
    directions
  };
  postRecipe(recipeData);

});

