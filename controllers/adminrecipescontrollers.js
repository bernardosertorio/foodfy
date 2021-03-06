const fs = require('fs')
const data = require('../data.json')


exports.list = function(req, res) {

  return res.render("adminrecipes/list", {recipes: data.recipes})
  
}

exports.create = function(req, res) {

  return res.render("adminrecipes/create")
  
}

exports.post = function(req, res) {

  const keys = Object.keys(req.body)

  for ( key of keys ) {

    if (req.body[key] == "") {

      return res.send('Please, fill all fields!')
    }
  
  } 


  let id = 1
  const lastRecipe = data.recipes[data.recipes.length - 1]

  if (lastRecipe) {
    id = lastRecipe.id + 1
  }

  let { ingredients, preparation_steps } = req.body


  ingredients = req.body.ingredients.filter(el => { return el != ""})
  preparation_steps = req.body.preparation_steps.filter(el => { return el != ""})


  data.recipes.push({
    id,
    ...req.body,
    ingredients,
    preparation_steps
  }) 


  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){

    if (err) return res.send("Write file error!")

    return res.redirect("/adminrecipes")
  })
}

exports.show = function(req, res) {

  const { id } = req.params

  const foundRecipe = data.recipes.find(function(recipe) {

    return recipe.id == id
   
  })

  if (!foundRecipe) return res.send('Recipe not found!')

  const recipe = {
    ...foundRecipe
  }

  return res.render("adminrecipes/show", { recipe })

}

exports.edit = function(req, res) {

  const { id } = req.params

  const foundRecipe = data.recipes.find(function(recipe) {

    return recipe.id == id
    
  })

  if (!foundRecipe) return res.send('Recipe not found!')

  const recipe = {
    ...foundRecipe
  }

   return res.render('adminrecipes/edit', { recipe })
}

exports.put = function(req, res) {

  const { id } = req.body
  let index = 0

  const foundRecipe = data.recipes.find(function(recipe, foundIndex) {
    
    if (recipe.id == id) {
      index = foundIndex
      return true
    }
  })

  if ( !foundRecipe ) return res.send("Recipe not found!")


  let { ingredients, preparation_steps } = req.body


  ingredients = req.body.ingredients.filter(el => { return el != ""})
  preparation_steps = req.body.preparation_steps.filter(el => { return el != ""})


  
  const recipe = {
    ...foundRecipe, 
    ...req.body,
    id: Number(req.body.id),
    ingredients,
    preparation_steps
  }

  data.recipes[index] = recipe


  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write erro!")

    return res.redirect(`/adminrecipes/${id}`)
  })
  
}

exports.delete = function(req, res) {

  const { id } = req.body

  const filteredRecipes = data.recipes.filter(function(recipe) {
    
    return id != recipe.id
  })

  data.recipes = filteredRecipes

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send("Write file error!")

    return res.redirect("/adminrecipes")
  })

}


