import { db } from "./db";
import { 
  users, categories, kitchens, recipes, 
  type InsertUser, type InsertCategory, type InsertKitchen, type InsertRecipe
} from "@shared/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await db.delete(recipes);
  await db.delete(categories);
  await db.delete(kitchens);
  await db.delete(users);

  console.log("👤 Creating users...");
  // Create users
  const adminUser = await db.insert(users).values({
    username: "admin",
    password: "password123",
    email: "admin@dailymeal.com",
    name: "Admin User",
    bio: "Site administrator",
    role: "admin",
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
  } as InsertUser).returning();

  const chefRaniaUser = await db.insert(users).values({
    username: "chefrania",
    password: "chef123",
    email: "chef@dailymeal.com",
    name: "Chef Rania",
    bio: "AI-powered chef assistant",
    role: "admin",
    avatar_url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c"
  } as InsertUser).returning();

  const demoUser = await db.insert(users).values({
    username: "demo",
    password: "demo123",
    email: "demo@dailymeal.com",
    name: "Demo User",
    bio: "Regular user for demo purposes",
    role: "user",
    avatar_url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d"
  } as InsertUser).returning();

  console.log("🍴 Creating meal categories...");
  // Create meal categories
  const categories_data = [
    { name: "Breakfast", description: "Start your day right", image_url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666" },
    { name: "Lunch", description: "Midday meals", image_url: "https://images.unsplash.com/photo-1547496502-affa22d38842" },
    { name: "Dinner", description: "Evening feasts", image_url: "https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d" },
    { name: "Desserts", description: "Sweet treats", image_url: "https://images.unsplash.com/photo-1488477304112-4944851de03d" },
    { name: "Salads", description: "Fresh and healthy", image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" },
    { name: "Pasta", description: "Italian comfort", image_url: "https://images.unsplash.com/photo-1567608285969-48e4bbe0d399" },
    { name: "Vegetarian", description: "Meat-free options", image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999" },
    { name: "Soups", description: "Warm and comforting", image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd" },
    { name: "Grilled", description: "Charred perfection", image_url: "https://images.unsplash.com/photo-1558030006-450675393462" },
    { name: "Seafood", description: "Treasures from the ocean", image_url: "https://images.unsplash.com/photo-1579164401270-2c67013e7ad8" },
    { name: "Appetizers", description: "Start your meal right", image_url: "https://images.unsplash.com/photo-1541529086526-db283c563270" },
    { name: "Quick & Easy", description: "For busy weeknights", image_url: "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9" },
    { name: "Baking", description: "Oven-made delights", image_url: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d" },
    { name: "Healthy", description: "Nutritious and delicious", image_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061" },
    { name: "Slow Cooker", description: "Set it and forget it", image_url: "https://images.unsplash.com/photo-1620486443824-1983359e68d3" },
    { name: "Snacks", description: "Bite-sized treats", image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b" }
  ];

  const categoriesMap = new Map();
  
  for (const category of categories_data) {
    const [createdCategory] = await db.insert(categories).values({
      name: category.name,
      description: category.description,
      image_url: category.image_url,
      recipe_count: 0
    } as InsertCategory).returning();
    
    categoriesMap.set(category.name, createdCategory);
  }

  console.log("🌎 Creating cuisine categories...");
  // Create cuisine categories
  const kitchens_data = [
    { name: "Italian", description: "Mediterranean classics", image_url: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b" },
    { name: "Thai", description: "Aromatic and spicy", image_url: "https://images.unsplash.com/photo-1559314809-0d155014e29e" },
    { name: "Mexican", description: "Bold and vibrant", image_url: "https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0" },
    { name: "Indian", description: "Rich and flavorful", image_url: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40" },
    { name: "American", description: "Comfort classics", image_url: "https://images.unsplash.com/photo-1550317138-10000687a72b" },
    { name: "Chinese", description: "Ancient culinary traditions", image_url: "https://images.unsplash.com/photo-1563245372-f21724e3856d" },
    { name: "Japanese", description: "Precise and artistic", image_url: "https://images.unsplash.com/photo-1553621042-f6e147245754" },
    { name: "Mediterranean", description: "Coastal flavors", image_url: "https://images.unsplash.com/photo-1544025162-d76694265947" },
    { name: "French", description: "Sophisticated techniques", image_url: "https://images.unsplash.com/photo-1551218808-94e220e084d2" },
    { name: "Middle Eastern", description: "Ancient spice routes", image_url: "https://images.unsplash.com/photo-1554998171-89445e31c52b" },
    { name: "Greek", description: "Olive oil and herbs", image_url: "https://images.unsplash.com/photo-1559742811-822873691df8" },
    { name: "Spanish", description: "Tapas and paella", image_url: "https://images.unsplash.com/photo-1515443961218-a51367888e4b" },
    { name: "Korean", description: "Bold and fermented", image_url: "https://images.unsplash.com/photo-1532347231146-80afc9e3df2b" },
    { name: "Vietnamese", description: "Fresh and balanced", image_url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43" },
    { name: "Caribbean", description: "Tropical fusion", image_url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf" },
    { name: "Brazilian", description: "South American flair", image_url: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0" }
  ];

  const kitchensMap = new Map();
  
  for (const kitchen of kitchens_data) {
    const [createdKitchen] = await db.insert(kitchens).values({
      name: kitchen.name,
      description: kitchen.description,
      image_url: kitchen.image_url
    } as InsertKitchen).returning();
    
    kitchensMap.set(kitchen.name, createdKitchen);
  }

  console.log("🍽️ Creating recipes...");
  // Create recipes
  const recipes_data = [
    // BREAKFAST RECIPES
    {
      title: "Fluffy Pancakes with Maple Syrup",
      description: "Light and fluffy pancakes served with butter and real maple syrup. A classic breakfast treat!",
      ingredients: JSON.stringify([
        "2 cups all-purpose flour",
        "2 tablespoons sugar",
        "2 teaspoons baking powder",
        "1 teaspoon baking soda",
        "1/2 teaspoon salt",
        "2 cups buttermilk",
        "2 large eggs",
        "1/4 cup unsalted butter, melted",
        "Maple syrup for serving",
        "Fresh berries (optional)"
      ]),
      steps: JSON.stringify([
        "Whisk together dry ingredients in a large bowl.",
        "In another bowl, whisk together buttermilk, eggs, and melted butter.",
        "Pour wet ingredients into dry ingredients and mix until just combined (lumps are okay).",
        "Let batter rest for 10 minutes.",
        "Heat a non-stick pan or griddle over medium heat and lightly coat with butter.",
        "Pour 1/4 cup batter for each pancake and cook until bubbles form on surface.",
        "Flip and cook until golden brown.",
        "Serve warm with maple syrup and berries if desired."
      ]),
      image_url: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
      prep_time: 10,
      cook_time: 15,
      servings: 4,
      calories: 320,
      difficulty: "Easy",
      category_id: categoriesMap.get("Breakfast").id,
      kitchen_id: kitchensMap.get("American").id,
      author_id: chefRaniaUser[0].id,
      status: "approved",
      favorites_count: 24
    },
    {
      title: "Avocado Toast with Poached Eggs",
      description: "Creamy avocado on toasted artisan bread topped with perfectly poached eggs and a sprinkle of chili flakes.",
      ingredients: JSON.stringify([
        "2 slices artisan bread (sourdough or whole grain)",
        "1 ripe avocado",
        "2 large eggs",
        "1 tablespoon white vinegar",
        "1/2 lemon, juiced",
        "Red pepper flakes",
        "Salt and pepper to taste",
        "Fresh herbs (chives, cilantro, or parsley)",
        "Extra virgin olive oil for drizzling"
      ]),
      steps: JSON.stringify([
        "Toast bread until golden and crisp.",
        "Mash avocado with lemon juice, salt, and pepper.",
        "Bring water to a gentle simmer in a pot, add vinegar.",
        "Crack each egg into a small bowl then gently slide into the simmering water.",
        "Poach eggs for 3-4 minutes for runny yolks.",
        "Spread mashed avocado on toast slices.",
        "Top each toast with a poached egg, sprinkle with red pepper flakes.",
        "Garnish with fresh herbs and drizzle with olive oil."
      ]),
      image_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8",
      prep_time: 10,
      cook_time: 5,
      servings: 1,
      calories: 380,
      difficulty: "Easy",
      category_id: categoriesMap.get("Breakfast").id,
      kitchen_id: kitchensMap.get("American").id,
      author_id: adminUser[0].id,
      status: "approved",
      favorites_count: 31
    },
    // LUNCH RECIPES
    {
      title: "Mediterranean Chickpea Salad",
      description: "A refreshing and protein-packed salad with chickpeas, cucumbers, tomatoes, and feta cheese in a lemon-herb dressing.",
      ingredients: JSON.stringify([
        "2 cans (15 oz each) chickpeas, drained and rinsed",
        "1 English cucumber, diced",
        "1 pint cherry tomatoes, halved",
        "1/2 red onion, finely diced",
        "1/2 cup Kalamata olives, pitted and halved",
        "1/2 cup feta cheese, crumbled",
        "1/4 cup fresh parsley, chopped",
        "1/4 cup fresh mint, chopped",
        "3 tablespoons extra virgin olive oil",
        "2 tablespoons lemon juice",
        "1 teaspoon dried oregano",
        "Salt and pepper to taste"
      ]),
      steps: JSON.stringify([
        "Combine chickpeas, cucumber, tomatoes, red onion, and olives in a large bowl.",
        "In a small bowl, whisk together olive oil, lemon juice, oregano, salt, and pepper.",
        "Pour dressing over the salad and toss to combine.",
        "Gently fold in feta cheese and fresh herbs.",
        "Refrigerate for at least 30 minutes before serving to allow flavors to meld.",
        "Serve chilled as a main dish or side salad."
      ]),
      image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      prep_time: 15,
      cook_time: 0,
      servings: 4,
      calories: 310,
      difficulty: "Easy",
      category_id: categoriesMap.get("Lunch").id,
      kitchen_id: kitchensMap.get("Mediterranean").id,
      author_id: chefRaniaUser[0].id,
      status: "approved",
      favorites_count: 18
    },
    {
      title: "Korean Beef Bulgogi Bowl",
      description: "Sweet and savory marinated beef served over rice with pickled vegetables and a sunny-side-up egg.",
      ingredients: JSON.stringify([
        "1 lb ribeye or sirloin steak, thinly sliced",
        "3 tablespoons soy sauce",
        "2 tablespoons brown sugar",
        "1 tablespoon sesame oil",
        "1 tablespoon rice vinegar",
        "3 cloves garlic, minced",
        "1 inch ginger, grated",
        "1 Asian pear, grated (or apple)",
        "2 green onions, sliced",
        "1 tablespoon vegetable oil",
        "2 cups cooked white rice",
        "4 eggs",
        "1 cup quick-pickled vegetables (carrots, cucumbers, radishes)",
        "Sesame seeds and sliced green onions for garnish"
      ]),
      steps: JSON.stringify([
        "Combine soy sauce, brown sugar, sesame oil, rice vinegar, garlic, ginger, and grated pear in a bowl.",
        "Add sliced beef to marinade and let sit for at least 30 minutes (or overnight in refrigerator).",
        "Heat vegetable oil in a large skillet over high heat.",
        "Cook marinated beef in batches, about 2-3 minutes until caramelized.",
        "In another pan, fry eggs sunny-side up.",
        "Assemble bowls with rice, beef, pickled vegetables, and top with fried egg.",
        "Garnish with sesame seeds and green onions."
      ]),
      image_url: "https://images.unsplash.com/photo-1590301157890-4810ed352733",
      prep_time: 40,
      cook_time: 10,
      servings: 4,
      calories: 520,
      difficulty: "Intermediate",
      category_id: categoriesMap.get("Lunch").id,
      kitchen_id: kitchensMap.get("Korean").id,
      author_id: adminUser[0].id,
      status: "approved",
      favorites_count: 27
    },
    // DINNER RECIPES
    {
      title: "Lemon Herb Roasted Chicken",
      description: "A perfect weeknight dinner that's both impressive and easy to make. This aromatic roasted chicken is infused with lemon, garlic, and fresh herbs.",
      ingredients: JSON.stringify([
        "1 whole chicken (about 4-5 pounds)",
        "2 lemons, 1 sliced and 1 juiced",
        "4 cloves garlic, minced",
        "2 tablespoons olive oil",
        "1 tablespoon fresh rosemary, chopped",
        "1 tablespoon fresh thyme, chopped",
        "1 teaspoon salt",
        "1/2 teaspoon black pepper"
      ]),
      steps: JSON.stringify([
        "Preheat oven to 425°F (220°C).",
        "Remove giblets from chicken cavity and pat dry with paper towels.",
        "In a small bowl, mix olive oil, lemon juice, garlic, herbs, salt, and pepper.",
        "Rub mixture all over the chicken and under the skin.",
        "Place lemon slices inside the cavity and tie legs together with kitchen twine.",
        "Roast for 1 hour and 15 minutes or until juices run clear.",
        "Let rest for 10 minutes before carving."
      ]),
      image_url: "https://images.unsplash.com/photo-1518492104633-130d0cc84637",
      prep_time: 15,
      cook_time: 75,
      servings: 4,
      calories: 480,
      difficulty: "Intermediate",
      category_id: categoriesMap.get("Dinner").id,
      kitchen_id: kitchensMap.get("Mediterranean").id,
      author_id: chefRaniaUser[0].id,
      status: "approved",
      favorites_count: 42
    },
    {
      title: "Classic Margherita Pizza",
      description: "A simple yet delicious traditional pizza with fresh mozzarella, tomatoes, and basil on a perfect crust.",
      ingredients: JSON.stringify([
        "1 pizza dough",
        "3 tablespoons olive oil",
        "2 cloves garlic, minced",
        "8 oz fresh mozzarella, sliced",
        "2 large tomatoes, sliced",
        "Fresh basil leaves",
        "Salt and pepper to taste"
      ]),
      steps: JSON.stringify([
        "Preheat oven to 475°F (245°C) with a pizza stone if available.",
        "Roll out dough on floured surface to desired thickness.",
        "Mix olive oil with minced garlic and brush over dough.",
        "Arrange mozzarella and tomato slices evenly.",
        "Bake for 10-12 minutes until crust is golden.",
        "Top with fresh basil leaves, salt, and pepper before serving."
      ]),
      image_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
      prep_time: 20,
      cook_time: 12,
      servings: 4,
      calories: 350,
      difficulty: "Easy",
      category_id: categoriesMap.get("Dinner").id,
      kitchen_id: kitchensMap.get("Italian").id,
      author_id: adminUser[0].id,
      status: "approved",
      favorites_count: 38
    },
    // DESSERT RECIPES
    {
      title: "Triple Chocolate Brownies",
      description: "Fudgy, decadent brownies with three types of chocolate for the ultimate chocolate lover's dessert.",
      ingredients: JSON.stringify([
        "1 cup unsalted butter",
        "8 oz dark chocolate, chopped",
        "1 1/2 cups granulated sugar",
        "4 large eggs",
        "1 tablespoon vanilla extract",
        "1 cup all-purpose flour",
        "1/2 cup unsweetened cocoa powder",
        "1/2 teaspoon salt",
        "1 cup semisweet chocolate chips",
        "1/2 cup white chocolate chips"
      ]),
      steps: JSON.stringify([
        "Preheat oven to 350°F (175°C) and line a 9x13 inch baking pan with parchment paper.",
        "Melt butter and dark chocolate together in a double boiler or microwave in 30-second intervals.",
        "Whisk sugar into the melted chocolate mixture until well combined.",
        "Add eggs one at a time, then stir in vanilla extract.",
        "Fold in flour, cocoa powder, and salt until just combined.",
        "Stir in semisweet and white chocolate chips.",
        "Pour batter into prepared pan and spread evenly.",
        "Bake for 25-30 minutes until a toothpick comes out with a few moist crumbs.",
        "Allow to cool completely before cutting into squares."
      ]),
      image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
      prep_time: 15,
      cook_time: 30,
      servings: 16,
      calories: 320,
      difficulty: "Easy",
      category_id: categoriesMap.get("Desserts").id,
      kitchen_id: kitchensMap.get("American").id,
      author_id: chefRaniaUser[0].id,
      status: "approved",
      favorites_count: 56
    },
    {
      title: "Creamy Tiramisu",
      description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream, dusted with cocoa powder.",
      ingredients: JSON.stringify([
        "6 egg yolks",
        "3/4 cup white sugar",
        "2/3 cup milk",
        "1 1/4 cups heavy cream",
        "1 teaspoon vanilla extract",
        "1 pound (16 oz) mascarpone cheese",
        "1/2 cup strong brewed coffee, room temperature",
        "1/4 cup rum or coffee liqueur",
        "24 ladyfinger cookies",
        "2 tablespoons unsweetened cocoa powder",
        "1 oz dark chocolate, grated"
      ]),
      steps: JSON.stringify([
        "In a medium saucepan, whisk together egg yolks and sugar until well blended.",
        "Whisk in milk and cook over medium heat, stirring constantly, until mixture boils.",
        "Boil gently for 1 minute, remove from heat and allow to cool slightly.",
        "Cover tightly and chill in refrigerator for 1 hour.",
        "In a medium bowl, beat cream with vanilla until stiff peaks form.",
        "Whisk mascarpone into yolk mixture until smooth.",
        "Gently fold in whipped cream into mascarpone mixture.",
        "Combine coffee and rum in a shallow dish.",
        "Briefly dip each ladyfinger in coffee mixture and arrange in the bottom of a 9x13 inch dish.",
        "Spread half of the mascarpone mixture over the ladyfingers.",
        "Repeat layers, ending with mascarpone mixture.",
        "Dust with cocoa powder and refrigerate for at least 4 hours or overnight.",
        "Garnish with grated chocolate before serving."
      ]),
      image_url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9",
      prep_time: 40,
      cook_time: 10,
      servings: 12,
      calories: 420,
      difficulty: "Intermediate",
      category_id: categoriesMap.get("Desserts").id,
      kitchen_id: kitchensMap.get("Italian").id,
      author_id: adminUser[0].id,
      status: "approved",
      favorites_count: 47
    },
    // PASTA RECIPES
    {
      title: "Creamy Mushroom Risotto",
      description: "Rich and creamy risotto with sautéed mushrooms, white wine, and fresh herbs topped with parmesan.",
      ingredients: JSON.stringify([
        "1 1/2 cups arborio rice",
        "8 oz mushrooms, sliced",
        "1 onion, finely diced",
        "2 cloves garlic, minced",
        "1/2 cup white wine",
        "4 cups vegetable broth, heated",
        "1/2 cup grated parmesan",
        "2 tbsp butter",
        "2 tbsp olive oil",
        "Fresh thyme leaves",
        "Salt and pepper to taste"
      ]),
      steps: JSON.stringify([
        "In a large pan, heat olive oil and 1 tbsp butter, then sauté mushrooms until golden. Set aside.",
        "In the same pan, sauté onion until translucent, then add garlic and cook for 1 minute.",
        "Add rice and stir for 2 minutes until translucent at edges.",
        "Pour in wine and stir until absorbed.",
        "Add hot broth 1/2 cup at a time, stirring until absorbed before adding more.",
        "When rice is creamy and al dente (about 20 minutes), stir in mushrooms, remaining butter, and parmesan.",
        "Season with salt, pepper, and garnish with thyme."
      ]),
      image_url: "https://images.unsplash.com/photo-1476124369491-e7addf5db371",
      prep_time: 10,
      cook_time: 30,
      servings: 4,
      calories: 420,
      difficulty: "Intermediate",
      category_id: categoriesMap.get("Pasta").id,
      kitchen_id: kitchensMap.get("Italian").id,
      author_id: chefRaniaUser[0].id,
      status: "approved",
      favorites_count: 33
    },
    {
      title: "Spaghetti Carbonara",
      description: "Classic Roman pasta dish with crispy pancetta, eggs, Pecorino Romano cheese, and freshly ground black pepper.",
      ingredients: JSON.stringify([
        "1 pound (450g) spaghetti",
        "8 oz pancetta or guanciale, diced",
        "4 large eggs",
        "1 cup Pecorino Romano cheese, freshly grated",
        "Freshly ground black pepper",
        "Salt for pasta water",
        "Extra grated cheese and black pepper for serving"
      ]),
      steps: JSON.stringify([
        "Bring a large pot of salted water to boil and cook spaghetti according to package directions until al dente.",
        "While pasta cooks, crisp pancetta in a large skillet over medium heat until golden, about 7 minutes.",
        "In a bowl, whisk eggs and grated cheese together with plenty of black pepper.",
        "Reserve 1/2 cup pasta cooking water, then drain pasta.",
        "Working quickly, add hot pasta to skillet with pancetta, removing from heat.",
        "Pour egg mixture over pasta and toss rapidly to create a creamy sauce (the heat will cook the eggs).",
        "Add pasta water as needed to achieve desired consistency.",
        "Serve immediately with extra cheese and black pepper."
      ]),
      image_url: "https://images.unsplash.com/photo-1600803907087-f56d462fd26b",
      prep_time: 10,
      cook_time: 15,
      servings: 4,
      calories: 580,
      difficulty: "Intermediate",
      category_id: categoriesMap.get("Pasta").id,
      kitchen_id: kitchensMap.get("Italian").id,
      author_id: adminUser[0].id,
      status: "approved",
      favorites_count: 45
    },
    // VEGETARIAN RECIPES
    {
      title: "Vegetable Pad Thai",
      description: "Classic Thai noodle dish loaded with colorful vegetables in a sweet and tangy sauce, topped with crushed peanuts.",
      ingredients: JSON.stringify([
        "8 oz rice noodles",
        "3 tablespoons vegetable oil",
        "3 cloves garlic, minced",
        "2 large eggs, beaten",
        "1 cup firm tofu, cubed",
        "1 cup bean sprouts",
        "1 red bell pepper, thinly sliced",
        "2 carrots, julienned",
        "4 green onions, chopped",
        "1/4 cup roasted peanuts, chopped",
        "1/4 cup fresh cilantro, chopped",
        "Lime wedges for serving",
        "For the sauce:",
        "3 tablespoons brown sugar",
        "3 tablespoons soy sauce or tamari",
        "2 tablespoons rice vinegar",
        "1 tablespoon lime juice",
        "2 teaspoons sriracha (adjust to taste)",
        "1 tablespoon peanut butter (optional)"
      ]),
      steps: JSON.stringify([
        "Soak rice noodles in hot water according to package directions until al dente, then drain and rinse with cold water.",
        "Mix all sauce ingredients in a small bowl until well combined.",
        "Heat 1 tablespoon oil in a large wok or skillet over medium-high heat.",
        "Add beaten eggs and scramble until just set, then remove and set aside.",
        "Add remaining oil to the wok. Add garlic and tofu, cook for 2 minutes until garlic is fragrant.",
        "Add bell pepper and carrots, stir-fry for 2-3 minutes until slightly softened.",
        "Add drained noodles and sauce to the wok, tossing to combine. Cook for 2-3 minutes until noodles absorb sauce.",
        "Add bean sprouts, green onions, and scrambled egg, toss to combine.",
        "Serve hot, topped with chopped peanuts, cilantro, and lime wedges."
      ]),
      image_url: "https://images.unsplash.com/photo-1637806931098-af1dbcdcaee3",
      prep_time: 20,
      cook_time: 15,
      servings: 4,
      calories: 380,
      difficulty: "Intermediate",
      category_id: categoriesMap.get("Vegetarian").id,
      kitchen_id: kitchensMap.get("Thai").id,
      author_id: chefRaniaUser[0].id,
      status: "approved",
      favorites_count: 29
    },
    {
      title: "Cauliflower Tikka Masala",
      description: "Vegetarian twist on the classic Indian curry with roasted cauliflower in a rich, aromatic tomato-based sauce.",
      ingredients: JSON.stringify([
        "1 large head cauliflower, cut into florets",
        "2 tablespoons olive oil",
        "1 large onion, diced",
        "4 cloves garlic, minced",
        "1 tablespoon ginger, grated",
        "2 teaspoons garam masala",
        "2 teaspoons ground cumin",
        "2 teaspoons ground coriander",
        "1 teaspoon turmeric",
        "1/2 teaspoon cayenne pepper (adjust to taste)",
        "1 can (14 oz) diced tomatoes",
        "1 can (14 oz) coconut milk",
        "1/2 cup plain yogurt",
        "1/4 cup fresh cilantro, chopped",
        "Salt to taste",
        "Cooked basmati rice for serving",
        "Naan bread for serving"
      ]),
      steps: JSON.stringify([
        "Preheat oven to 425°F (220°C).",
        "Toss cauliflower florets with 1 tablespoon olive oil and a pinch of salt. Spread on baking sheet.",
        "Roast cauliflower for 20-25 minutes until golden and tender.",
        "Meanwhile, heat remaining oil in a large pot over medium heat.",
        "Sauté onion until translucent, about 5 minutes.",
        "Add garlic and ginger, cook for 1 minute until fragrant.",
        "Add all spices and cook for 30 seconds, stirring constantly.",
        "Add diced tomatoes and simmer for 5 minutes.",
        "Add coconut milk and simmer for 10 minutes until slightly thickened.",
        "Gently stir in roasted cauliflower and simmer for 5 minutes.",
        "Remove from heat and stir in yogurt.",
        "Serve over basmati rice, garnished with cilantro and with naan bread on the side."
      ]),
      image_url: "https://images.unsplash.com/photo-1631292784640-2b24be784d1c",
      prep_time: 15,
      cook_time: 40,
      servings: 4,
      calories: 320,
      difficulty: "Intermediate",
      category_id: categoriesMap.get("Vegetarian").id,
      kitchen_id: kitchensMap.get("Indian").id,
      author_id: adminUser[0].id,
      status: "approved",
      favorites_count: 26
    },
    // ASIAN CUISINE
    {
      title: "Thai Green Curry",
      description: "Aromatic green curry with coconut milk, vegetables, and your choice of protein. Perfect with jasmine rice.",
      ingredients: JSON.stringify([
        "2 tbsp green curry paste",
        "1 can (14 oz) coconut milk",
        "1 lb chicken, tofu, or shrimp",
        "1 bell pepper, sliced",
        "1 zucchini, sliced",
        "1 cup snap peas",
        "1 tbsp fish sauce (or soy sauce)",
        "1 tbsp brown sugar",
        "Fresh basil leaves",
        "Lime wedges for serving",
        "Jasmine rice for serving"
      ]),
      steps: JSON.stringify([
        "In a large pot, heat 2 tbsp of coconut milk and curry paste, stirring until fragrant.",
        "Add protein and cook until nearly done.",
        "Pour in remaining coconut milk, fish sauce, and sugar. Bring to simmer.",
        "Add vegetables and cook until tender-crisp, about 5 minutes.",
        "Stir in basil leaves just before serving.",
        "Serve with jasmine rice and lime wedges."
      ]),
      image_url: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd",
      prep_time: 15,
      cook_time: 20,
      servings: 4,
      calories: 380,
      difficulty: "Easy",
      category_id: categoriesMap.get("Dinner").id,
      kitchen_id: kitchensMap.get("Thai").id,
      author_id: chefRaniaUser[0].id,
      status: "approved",
      favorites_count: 35
    },
    {
      title: "Japanese Miso Ramen",
      description: "Comforting Japanese noodle soup with a savory miso broth, tender slices of pork, soft-boiled eggs, and vegetables.",
      ingredients: JSON.stringify([
        "8 cups chicken or dashi stock",
        "1/4 cup white miso paste",
        "2 tablespoons soy sauce",
        "1 tablespoon mirin",
        "1 tablespoon sesame oil",
        "3 cloves garlic, minced",
        "1 tablespoon ginger, grated",
        "1 lb pork belly or shoulder, thinly sliced",
        "4 packages ramen noodles (discard seasoning packets)",
        "4 soft-boiled eggs, halved",
        "2 cups baby spinach or bok choy",
        "4 green onions, thinly sliced",
        "1 cup bean sprouts",
        "Nori sheets, cut into strips",
        "Toasted sesame seeds"
      ]),
      steps: JSON.stringify([
        "In a large pot, bring stock to a simmer.",
        "In a small bowl, whisk miso paste with a ladle of hot stock until smooth, then return to pot.",
        "Add soy sauce, mirin, sesame oil, garlic, and ginger to the broth.",
        "In a separate pan, cook sliced pork until browned and cooked through.",
        "Cook ramen noodles according to package directions, then drain.",
        "Divide noodles among 4 large bowls.",
        "Ladle hot broth over noodles.",
        "Top each bowl with sliced pork, half an egg, spinach or bok choy, bean sprouts, green onions, nori, and sesame seeds.",
        "Serve immediately."
      ]),
      image_url: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1",
      prep_time: 20,
      cook_time: 30,
      servings: 4,
      calories: 550,
      difficulty: "Intermediate",
      category_id: categoriesMap.get("Soups").id,
      kitchen_id: kitchensMap.get("Japanese").id,
      author_id: adminUser[0].id,
      status: "approved",
      favorites_count: 41
    },
    // Add more recipes as needed
  ];

  for (const recipe of recipes_data) {
    await db.insert(recipes).values({
      ...recipe,
      created_at: new Date(),
      updated_at: new Date()
    } as InsertRecipe);
    
    // Update category recipe count
    const category = await db.select().from(categories).where(eq(categories.id, recipe.category_id));
    if (category.length > 0) {
      await db.update(categories)
        .set({ recipe_count: (category[0].recipe_count || 0) + 1 })
        .where(eq(categories.id, recipe.category_id));
    }
  }

  console.log("✅ Database seed completed successfully!");
}

main().catch(e => {
  console.error("❌ Error seeding database:", e);
  process.exit(1);
});