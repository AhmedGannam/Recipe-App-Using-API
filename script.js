const searchBox = document.querySelector(".searchBox")
const searchBtn = document.querySelector(".searchBtn")
const recipeContainer = document.querySelector(".recipe-container")
const recipeDetailsContent = document.querySelector(".recipe-details-content")
const recipeCloseBtn = document.querySelector(".recipe-close-btn")

// function to get recipes
//search input is replaced by query
const fetchRecipes = async(query) => {
    recipeContainer.innerHTML="<h2>Fetching Recipes ......</h2>";
   try {

    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const response = await data.json();

    //console.log(response);
    // the key name is `meal` as we got from running console.log

    recipeContainer.innerHTML=""
    response.meals.forEach(meal => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");
        recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strMeal} Dish</span></p>
            <p><span>Belong to:${meal.strMeal}</span></p>
        `
        const button = document.createElement("button")
        button.textContent= "View Recipe";
        recipeDiv.appendChild(button);

        //adding event listener to button
        button.addEventListener("click",()=> {
            openRecipePopup(meal);
        })
        recipeContainer.appendChild(recipeDiv);
    });
} 
catch (error) {
    recipeContainer.innerHTML=`<h2>No such recipes found ...</h2>`;
    }
}

// function to fetch ingredients and measurements
const fetchingredients = (meal) => {
    let ingredientsList = "";
    for(let i=1;i<=20;i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`
        }
        else{
            break;
        }
    }
    return ingredientsList;
}

const openRecipePopup=(meal) => {
    recipeDetailsContent.innerHTML=`
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchingredients(meal)}</ul>
    <div class="recipeInstructions">
        <h3>Instruction:</h3>
        <p>${meal.strInstruction}</p>
    </div>
`
    
    recipeDetailsContent.parentElement.style.display= "block";
};

recipeCloseBtn.addEventListener("click",()=> {
    recipeDetailsContent.parentElement.style.display ="none";
})
searchBtn.addEventListener("click",(e)=> {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if(!searchInput){
        recipeContainer.innerHTML=`<h2>Type the meal in the search box</h2>`;
        return;
        }
    fetchRecipes(searchInput);
});