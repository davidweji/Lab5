import express from "express";
import serverless from "serverless-http";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const api = express();
const router = express.Router();
const API_KEY = process.env.RECIPE_API_KEY;

const PORT = 3000;
api.listen(PORT, () => {
    console.log(`Server is Running on: http://localhost:${PORT}`);
})

router.get("/recipes", async (req, res) => {
const {diet, intolerances, includeIngredients, excludeIngredients } = req.query;
if(!diet && !intolerances && !includeIngredients && !excludeIngredients) {
    return res.status(400).json({ error: "Input is required."});
}

const urlElements = new URLSearchParams({apiKey: API_KEY});
if(diet) {urlElements.append("diet", diet);}
if(intolerances) {urlElements.append("intolerances",intolerances);}
if(includeIngredients) {urlElements.append("includeIngredients",includeIngredients);}
if(excludeIngredients) {urlElements.append("excludeIngredients",excludeIngredients);}

try {
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${urlElements.toString()}`);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        return res.status(404).json({ error: "Recipe's not found." });
    }

    res.json({
        recipes: data.results.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            image: recipe.image
        })),
        totalResults: data.totalResults
    });

} catch (error) {
    res.status(500).json({ error: "Server error" });
}
});

api.use("/api/", router);
export const handler = serverless(api);