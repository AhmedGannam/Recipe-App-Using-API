// DOM Elements
const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");
const suggestionsContainer = document.querySelector(".suggestions-container");

// Utility Functions
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

// Recipe Data Functions
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();

        recipeContainer.innerHTML = "";
        if (!data.meals) {
            recipeContainer.innerHTML = "<h2>No recipes found...</h2>";
            return;
        }

        data.meals.forEach(meal => {
            const recipeDiv = document.createElement("div");
            recipeDiv.classList.add("recipe");
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea} Dish</span></p>
                <p><span>Category: ${meal.strCategory}</span></p>
            `;
            
            const viewButton = document.createElement("button");
            viewButton.textContent = "View Recipe";
            viewButton.addEventListener("click", () => openRecipePopup(meal));
            recipeDiv.appendChild(viewButton);
            
            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        recipeContainer.innerHTML = "<h2>Error fetching recipes...</h2>";
    }
};

const fetchIngredients = (meal) => {
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (!ingredient) break;
        ingredients += `<li>${meal[`strMeasure${i}`]} ${ingredient}</li>`;
    }
    return ingredients;
};

const openRecipePopup = (meal) => {
    const formattedInstructions = meal.strInstructions.replace(/\r\n/g, "<br>");
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p>${formattedInstructions}</p>
        </div>
    `;
    recipeDetailsContent.parentElement.style.display = "block";
};

// Search Suggestions Functions
const fetchSuggestions = async (query) => {
    if (!query) {
        suggestionsContainer.style.display = "none";
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        
        suggestionsContainer.innerHTML = "";
        if (!data.meals) {
            suggestionsContainer.style.display = "none";
            return;
        }

        data.meals.forEach(meal => {
            const suggestion = document.createElement("div");
            suggestion.className = "suggestion-item";
            suggestion.textContent = meal.strMeal;
            suggestion.addEventListener("click", () => {
                searchBox.value = meal.strMeal;
                suggestionsContainer.style.display = "none";
                fetchRecipes(meal.strMeal);
            });
            suggestionsContainer.appendChild(suggestion);
        });
        suggestionsContainer.style.display = "block";
    } catch (error) {
        console.error("Suggestions error:", error);
    }
};

// Event Handlers
const handleDocumentClick = (e) => {
    if (!e.target.closest(".searchBox") && !e.target.closest(".suggestions-container")) {
        suggestionsContainer.style.display = "none";
    }
};

const handleSearch = (e) => {
    e.preventDefault();
    suggestionsContainer.style.display = "none";
    const query = searchBox.value.trim();
    
    if (!query) {
        recipeContainer.innerHTML = "<h2>Type the meal in the search box</h2>";
        return;
    }
    fetchRecipes(query);
};

// Event Listeners
searchBox.addEventListener("input", debounce((e) => fetchSuggestions(e.target.value), 300));
searchBtn.addEventListener("click", handleSearch);
recipeCloseBtn.addEventListener("click", () => {
    recipeDetailsContent.parentElement.style.display = "none";
});
document.addEventListener("click", handleDocumentClick);
