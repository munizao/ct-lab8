async function postRecipe(recipeData) {
  console.log(recipeData);
  return fetch('https://recipe-ctlab.herokuapp.com/api/v1/recipes', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipeData)
  });
}

export { postRecipe };
