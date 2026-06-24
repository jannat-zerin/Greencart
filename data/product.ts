export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  healthiness: number;
  priceHonestyRating: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Organic Apples",
    price: 254,
    image: "/images/organic-apple.png",
    category: "Fruits",
    description: "Crisp and juicy organic apples, perfect for snacking or baking. Grown without pesticides for the purest taste.",
    healthiness: 90,
    priceHonestyRating: 4
  },
  {
    id: 2,
    name: "Fresh Bananas",
    price: 20,
    image: "/images/fresh-bananas.png",
    category: "Fruits",
    description: "Sweet and ripe bananas, rich in potassium and perfect for smoothies or as a quick energy boost.",
    healthiness: 90,
    priceHonestyRating: 4
  },
  {
    id: 3,
    name: "Spinach",
    price: 339,
    image: "/images/spinach.png",
    category: "Vegetables",
    description: "Fresh organic spinach leaves, packed with vitamins and minerals. Great for salads or cooking.",
    healthiness: 90,
    priceHonestyRating: 3
  },
  {
    id: 4,
    name: "Whole Wheat Bread",
    price: 381,
    image: "/images/whole-wheat-bread.png",
    category: "Bakery",
    description: "Nutritious whole wheat bread made with organic grains. Perfect for sandwiches or toast.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 5,
    name: "Almond Milk",
    price: 279,
    image: "/images/almond-milk.png",
    category: "Dairy",
    description: "Creamy almond milk made from organic almonds. A delicious dairy-free alternative for your morning coffee.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 6,
    name: "Organic Honey",
    price: 679,
    image: "/images/organic-honey.png",
    category: "Pantry",
    description: "Pure organic honey from local beekeepers. Natural sweetener with a rich, golden flavor.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 7,
    name: "Strawberries",
    price: 424,
    image: "/images/strawberries.png",
    category: "Fruits",
    description: "Sweet and vibrant organic strawberries. Perfect for desserts, smoothies, or eating fresh.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 8,
    name: "Avocados",
    price: 211,
    image: "/images/avocados.png",
    category: "Fruits",
    description: "Ripe and creamy avocados, rich in healthy fats. Ideal for salads, toast, or guacamole.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 9,
    name: "Blueberries",
    price: 509,
    image: "/images/blue-berries.png",
    category: "Fruits",
    description: "Plump and juicy blueberries packed with antioxidants. Great for baking, cereals, or snacking.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 10,
    name: "Oranges",
    price: 296,
    image: "/images/oranges.png",
    category: "Fruits",
    description: "Sweet and tangy oranges bursting with vitamin C. Perfect for fresh juice or a healthy snack.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 11,
    name: "Grapes",
    price: 364,
    image: "/images/grapes.png",
    category: "Fruits",
    description: "Seedless red grapes, sweet and refreshing. A perfect on-the-go snack for all ages.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 12,
    name: "Mangoes",
    price: 339,
    image: "/images/mangoes.png",
    category: "Fruits",
    description: "Ripe and juicy mangoes with a tropical sweetness. Ideal for smoothies, salads, or eating fresh.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 13,
    name: "Lemons",
    price: 169,
    image: "/images/lemons.png",
    category: "Fruits",
    description: "Zesty organic lemons, perfect for cooking, baking, and refreshing lemonade.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 14,
    name: "Broccoli",
    price: 254,
    image: "/images/broccoli.png",
    category: "Vegetables",
    description: "Fresh green broccoli florets and stalks. Rich in fiber, vitamins, and perfect for steaming or roasting.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 15,
    name: "Carrots",
    price: 169,
    image: "/images/carrots.png",
    category: "Vegetables",
    description: "Sweet and crunchy organic carrots. Great raw as a snack or roasted as a side dish.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 16,
    name: "Tomatoes",
    price: 296,
    image: "/images/tomates.png",
    category: "Vegetables",
    description: "Vine-ripened organic tomatoes, juicy and flavorful. Essential for salads, sauces, and sandwiches.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 17,
    name: "Bell Peppers",
    price: 211,
    image: "/images/bell-pappers.png",
    category: "Vegetables",
    description: "Colorful organic bell peppers. Crunchy and sweet, perfect for stir-fries, salads, or stuffing.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 18,
    name: "Cucumbers",
    price: 152,
    image: "/images/cucumbers.png",
    category: "Vegetables",
    description: "Cool and crisp organic cucumbers. Refreshing in salads, sandwiches, or infused water.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 19,
    name: "Kale",
    price: 339,
    image: "/images/kale.png",
    category: "Vegetables",
    description: "Nutrient-dense organic kale leaves. Perfect for smoothies, salads, or baked into crispy chips.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 20,
    name: "Sweet Potatoes",
    price: 194,
    image: "/images/sweet-potatoes.png",
    category: "Vegetables",
    description: "Rich and flavorful organic sweet potatoes. Excellent baked, mashed, or roasted.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 21,
    name: "Cauliflower",
    price: 296,
    image: "/images/cauliflower.png",
    category: "Vegetables",
    description: "Fresh white cauliflower heads. Versatile for roasting, ricing, or making low-carb pizza crusts.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 22,
    name: "Sourdough Bread",
    price: 509,
    image: "/images/whole-wheat-bread.png",
    category: "Bakery",
    description: "Artisan sourdough bread with a crispy crust and tangy flavor. Made with organic flour.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 23,
    name: "Croissants",
    price: 424,
    image: "/images/bagels.png",
    category: "Bakery",
    description: "Buttery and flaky croissants, baked fresh daily. Perfect for breakfast or a light snack.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 24,
    name: "Bagels",
    price: 339,
    image: "/images/bagels.png",
    category: "Bakery",
    description: "Chewy and golden bagels available in plain, sesame, and everything varieties.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 25,
    name: "Banana Bread",
    price: 551,
    image: "/images/banana-bread.png",
    category: "Bakery",
    description: "Moist and tender banana bread made with ripe organic bananas and whole wheat flour.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 26,
    name: "Cheddar Cheese",
    price: 509,
    image: "/images/cheddar-cheese.png",
    category: "Dairy",
    description: "Aged organic cheddar cheese with a sharp and creamy flavor. Perfect for sandwiches or cheese boards.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 27,
    name: "Greek Yogurt",
    price: 381,
    image: "/images/greek-yogurt.png",
    category: "Dairy",
    description: "Thick and creamy organic Greek yogurt. High in protein and perfect for breakfast or smoothies.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 28,
    name: "Whole Milk",
    price: 322,
    image: "/images/whole-milk.png",
    category: "Dairy",
    description: "Fresh organic whole milk from grass-fed cows. Rich, creamy, and full of natural goodness.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 29,
    name: "Butter",
    price: 364,
    image: "/images/butter.png",
    category: "Dairy",
    description: "Creamy organic butter made from pasture-raised cows. Ideal for baking and cooking.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 30,
    name: "Mozzarella",
    price: 424,
    image: "/images/mozzarella.png",
    category: "Dairy",
    description: "Fresh organic mozzarella balls in brine. Soft, milky, and perfect for caprese salads or pizza.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 31,
    name: "Organic Eggs",
    price: 466,
    image: "/images/organic-eggs.png",
    category: "Dairy",
    description: "Farm-fresh organic eggs from free-range hens. Rich golden yolks packed with flavor.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 32,
    name: "Brown Rice",
    price: 339,
    image: "/images/brown-rice.png",
    category: "Pantry",
    description: "Whole grain organic brown rice. Nutty flavor and chewy texture, perfect as a healthy staple.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 33,
    name: "Quinoa",
    price: 509,
    image: "/images/quinoa.png",
    category: "Pantry",
    description: "Organic tri-color quinoa. A complete protein and a versatile base for salads and bowls.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 34,
    name: "Olive Oil",
    price: 849,
    image: "/images/olive-oil.png",
    category: "Pantry",
    description: "Extra virgin olive oil, cold-pressed from organic olives. Rich, fruity, and perfect for dressing and cooking.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 35,
    name: "Pasta",
    price: 154,
    image: "/images/pasta.png",
    category: "Pantry",
    description: "Organic durum wheat penne pasta. Holds sauce perfectly for a satisfying meal.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 36,
    name: "Peanut Butter",
    price: 424,
    image: "/images/peanut-butter.png",
    category: "Pantry",
    description: "Creamy organic peanut butter made from dry-roasted peanuts. No added sugar or oil.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 37,
    name: "Granola",
    price: 551,
    image: "/images/granola.png",
    category: "Pantry",
    description: "Crunchy organic granola with oats, nuts, and dried fruits. Perfect with yogurt or milk.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 38,
    name: "Coconut Water",
    price: 254,
    image: "/images/coconut-water.png",
    category: "Beverages",
    description: "Refreshing organic coconut water, naturally rich in electrolytes. Perfect post-workout hydration.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 39,
    name: "Green Tea",
    price: 424,
    image: "/images/green-tea.png",
    category: "Beverages",
    description: "Premium organic Japanese green tea. Smooth, soothing, and packed with antioxidants.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 40,
    name: "Orange Juice",
    price: 180,
    image: "/images/organic-juice.png",
    category: "Beverages",
    description: "Freshly squeezed organic orange juice. Pure, not from concentrate, with no added sugar.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 41,
    name: "Cold Brew Coffee",
    price: 120,
    image: "/images/cold-brew-coffee.png",
    category: "Beverages",
    description: "Smooth organic cold brew coffee. Slow-steeped for 20 hours for a rich, low-acid flavor.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 42,
    name: "Almonds",
    price: 679,
    image: "/images/almonds.png",
    category: "Snacks",
    description: "Raw organic almonds. Crunchy, satisfying, and packed with healthy fats and vitamin E.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 43,
    name: "Dark Chocolate",
    price: 424,
    image: "/images/dark-chocolate.png",
    category: "Snacks",
    description: "Organic dark chocolate with 72% cacao. Rich, intense, and ethically sourced.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 44,
    name: "Trail Mix",
    price: 594,
    image: "/images/trail-mix.png",
    category: "Snacks",
    description: "Organic trail mix with nuts, seeds, and dried fruits. The perfect energy-boosting snack.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 45,
    name: "Rice Cakes",
    price: 296,
    image: "/images/rice-cakes.png",
    category: "Snacks",
    description: "Light and crispy organic brown rice cakes. A guilt-free base for your favorite toppings.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 46,
    name: "Basil",
    price: 211,
    image: "/images/basil.png",
    category: "Herbs",
    description: "Fresh organic basil leaves. Aromatic and essential for pesto, salads, and Italian dishes.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 47,
    name: "Mint",
    price: 211,
    image: "/images/mint.png",
    category: "Herbs",
    description: "Fresh organic mint leaves. Perfect for teas, cocktails, salads, and garnishes.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 48,
    name: "Cilantro",
    price: 169,
    image: "/images/cilantro.png",
    category: "Herbs",
    description: "Fresh organic cilantro. Bright and citrusy, essential for salsas, curries, and Asian dishes.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 49,
    name: "Salmon Fillet",
    price: 1104,
    image: "/images/salmon-fillet.png",
    category: "Meat & Seafood",
    description: "Fresh Atlantic salmon fillet, rich in omega-3 fatty acids. Perfect for grilling or baking.",
    healthiness: 95,
    priceHonestyRating: 5
  },
  {
    id: 50,
    name: "Chicken Breast",
    price: 849,
    image: "/images/chicken-breast.png",
    category: "Meat & Seafood",
    description: "Organic free-range chicken breasts. Lean, tender, and perfect for a healthy protein-rich meal.",
    healthiness: 95,
    priceHonestyRating: 5
  }
];