export const categories = [
  {
    id: "all",
    name: "All Items",
    slug: "all",
    description: "Browse our complete artisanal bakery collection",
    icon: "Utensils",
    badge: "Full Menu"
  },
  {
    id: "cakes",
    name: "Cakes & Brownies",
    slug: "cakes",
    description: "Belgian chocolate cakes, fruit cakes, celebration cakes and freshly baked brownies",
    icon: "Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    itemCount: 22
  },
  {
    id: "pastries",
    name: "Pastries",
    slug: "pastries",
    description: "Rich layered slice pastries including Nutella, Biscoff, and Dutch cheese pastries",
    icon: "PieChart",
    image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80",
    itemCount: 7
  },
  {
    id: "munchies",
    name: "Munchies & More",
    slug: "munchies",
    description: "Grilled sandwiches, gourmet burgers, 9-inch pizzas, hot Maggi, fries & nachos",
    icon: "Pizza",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    itemCount: 45,
    subGroups: [
      { id: "all-munchies", label: "All Munchies", slug: "all-munchies" },
      { id: "sandwiches", label: "Sandwiches & Burgers", slug: "sandwiches" },
      { id: "pizzas", label: "Pizzas (9 Inch)", slug: "pizzas" },
      { id: "maggi", label: "Hot Maggi", slug: "maggi" },
      { id: "fries", label: "Fries & Quick Bites", slug: "fries" }
    ]
  },
  {
    id: "desserts",
    name: "Desserts & Ice Creams",
    slug: "desserts",
    description: "Chocolate ice creams, sizzler brownies, and dessert combos",
    icon: "Candy",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
    itemCount: 9
  },
  {
    id: "combos",
    name: "Popular Combos",
    slug: "combos",
    description: "Specially curated snack, coffee, shake, and pastry value combos",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    itemCount: 10
  },
  {
    id: "drinks",
    name: "Shakes & Mocktails",
    slug: "drinks",
    description: "Creamy thick milkshakes, cold coffee, fruit coolers, and refreshing mojitos",
    icon: "Coffee",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    itemCount: 35,
    subGroups: [
      { id: "all-drinks", label: "All Drinks", slug: "all-drinks" },
      { id: "milkshakes", label: "Thick Milkshakes", slug: "milkshakes" },
      { id: "mocktails", label: "Mocktails & Coolers", slug: "mocktails" }
    ]
  }
];
