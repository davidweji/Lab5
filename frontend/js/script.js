async function getRecipe() {
    const urlElements = new URLSearchParams();

    const diet = document.getElementById("diet");
    const intolerances = document.getElementById("intolerances");
    const includeIngredients = document.getElementById("includeIngredients");
    const excludeIngredients = document.getElementById("excludeIngredients");

    if(diet) {urlElements.append("diet",diet.value);}
    if(intolerances) {urlElements.append("intolerances",intolerances.value);}
    if(includeIngredients) {urlElements.append("includeIngredients",includeIngredients.value);}
    if(excludeIngredients) {urlElements.append("excludeIngredients",excludeIngredients.value);}


    if(!urlElements.toString()) {
        alert("Please enter at least 1 parameter.");
        return;
    }

    const response = await fetch(`/api/recipes?${urlElements.toString()}}`);
    const data = await response.json();

    const resultsDiv = document.getElementById("result");
    resultsDiv.innerHTML = "";
    if (data.error) {
        resultsDiv.innerHTML = `<p>${data.error}</p>`;
    } else {
        data.recipes.array.forEach(recipe => {
            resultsDiv.innerHTML += `<div class="recipe">
                                     <h2>${recipe.title}</h2>
                                     <img src="${recipe.image}" alt="${recipe.title}">
                                     </div>`; 
        });
    }
}