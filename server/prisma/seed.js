const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const categoriesList = [
  { slug: "cakes", name: "Cakes & Brownies", description: "Belgian chocolate cakes, fruit cakes, celebration cakes and freshly baked brownies", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80", sortOrder: 1 },
  { slug: "pastries", name: "Pastries", description: "Rich layered slice pastries including Nutella, Biscoff, and Dutch cheese pastries", imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80", sortOrder: 2 },
  { slug: "munchies", name: "Munchies & More", description: "Grilled sandwiches, gourmet burgers, 9-inch pizzas, hot Maggi, fries & nachos", imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80", sortOrder: 3 },
  { slug: "desserts", name: "Desserts & Ice Creams", description: "Chocolate ice creams, sizzler brownies, and dessert combos", imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80", sortOrder: 4 },
  { slug: "combos", name: "Popular Combos", description: "Specially curated snack, coffee, shake, and pastry value combos", imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80", sortOrder: 5 },
  { slug: "drinks", name: "Shakes & Mocktails", description: "Creamy thick milkshakes, cold coffee, fruit coolers, and refreshing mojitos", imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80", sortOrder: 6 }
];

const productsList = [
  {
    "id": "p1",
    "name": "Black Forest Cake",
    "slug": "black-forest-cake",
    "category": "cakes",
    "subGroup": null,
    "price": 400,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/2/19/0a9cb712-83f3-42a4-b376-ba7cb30aa56d_6b476082-d620-4376-931d-4204ce230737.jpg_compressed"
    ],
    "description": "Freshly prepared Black Forest Cake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 400
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 740
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 45,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p2",
    "name": "Pineapple Classic Cake",
    "slug": "pineapple-classic-cake",
    "category": "cakes",
    "subGroup": null,
    "price": 400,
    "discountPrice": null,
    "images": [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTri0DfgkiP6JAPigiXf_TB-G_p3neXQTpW43d0jd-Few&s=10"
    ],
    "description": "Freshly prepared Pineapple Classic Cake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 400
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 740
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 46,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p3",
    "name": "Butterscotch Cake",
    "slug": "butterscotch-cake",
    "category": "cakes",
    "subGroup": null,
    "price": 400,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/f9457e8a-b1d2-4862-93a1-0afe836c2d86_cdf78672-db4f-44d0-b857-e20415154974.jpg"
    ],
    "description": "Freshly prepared Butterscotch Cake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 400
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 740
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 47,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p4",
    "name": "Chocolate Truffle",
    "slug": "chocolate-truffle",
    "category": "cakes",
    "subGroup": null,
    "price": 500,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/2/19/5a9be48f-eede-4702-8602-6191828d517d_6c4eab12-5cc5-4d45-8ba8-1edc8608f3ad.jpg_compressed"
    ],
    "description": "Freshly prepared Chocolate Truffle handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 500
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 925
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 48,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p5",
    "name": "Chocolate Fantasy",
    "slug": "chocolate-fantasy",
    "category": "cakes",
    "subGroup": null,
    "price": 500,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/19/b818bab1-269c-4e6a-951b-3d1da1be904a_10781cd6-93ba-4325-8e45-e2582bab722a.JPG"
    ],
    "description": "Freshly prepared Chocolate Fantasy handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 500
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 925
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 49,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p6",
    "name": "White Forest",
    "slug": "white-forest",
    "category": "cakes",
    "subGroup": null,
    "price": 500,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/27/2807693d-e4fd-486d-9481-fbe7e9a4eb6c_94959d84-7e87-4bd5-a49f-105d29c15198.JPG"
    ],
    "description": "Freshly prepared White Forest handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 500
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 925
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 50,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p7",
    "name": "Blueberry Cake",
    "slug": "blueberry-cake",
    "category": "cakes",
    "subGroup": null,
    "price": 500,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/10/49fcd747-458e-465d-bef5-8d07072a714f_39f7488e-2fa2-4e46-9f97-8c2fff5bdb3b.jpeg"
    ],
    "description": "Freshly prepared Blueberry Cake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 500
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 925
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 51,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p8",
    "name": "Mango Cake",
    "slug": "mango-cake",
    "category": "cakes",
    "subGroup": null,
    "price": 500,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/6/1307c608-94a1-437e-8eea-8b8abb59dbae_2f4f850e-686c-45c2-b174-4aa04b7dbd5e.JPG"
    ],
    "description": "Freshly prepared Mango Cake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 500
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 925
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 52,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p9",
    "name": "Caramel Cake",
    "slug": "caramel-cake",
    "category": "cakes",
    "subGroup": null,
    "price": 500,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/2/22/2df3b7da-3d5c-4be7-81a5-0dda9c9dc67e_d26b84ca-f092-49a2-bb7f-2c4ff9e9410e.jpg"
    ],
    "description": "Freshly prepared Caramel Cake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 500
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 925
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 53,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p10",
    "name": "Choco Chips",
    "slug": "choco-chips",
    "category": "cakes",
    "subGroup": null,
    "price": 500,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/9/26/8ff70c11-a9cf-4631-bf32-8f1a15121784_ad7c8451-e010-41ef-9447-a51cfcbe63be.jpg"
    ],
    "description": "Freshly prepared Choco Chips handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 500
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 925
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 54,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p11",
    "name": "Chocolate Overload",
    "slug": "chocolate-overload",
    "category": "cakes",
    "subGroup": null,
    "price": 600,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/23/7bbca1a7-efb1-4c54-aa44-69780e92e3d4_37c452bf-d993-434e-b456-633ca033c920.JPG"
    ],
    "description": "Freshly prepared Chocolate Overload handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 600
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 1110
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 55,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p12",
    "name": "Pista Almond Cake",
    "slug": "pista-almond-cake",
    "category": "cakes",
    "subGroup": null,
    "price": 600,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/622fc0d9-35b7-4be0-b633-793d46c131ca_6bfede23-7a97-47f2-a38d-f8b6fe9aad90.jpg"
    ],
    "description": "Freshly prepared Pista Almond Cake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 600
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 1110
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 56,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p13",
    "name": "Pineapple With Fruit",
    "slug": "pineapple-with-fruit",
    "category": "cakes",
    "subGroup": null,
    "price": 600,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Pineapple With Fruit handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 600
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 1110
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 57,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p14",
    "name": "Oreo Cake",
    "slug": "oreo-cake",
    "category": "cakes",
    "subGroup": null,
    "price": 650,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/id3fbqhguipkefuhclyn"
    ],
    "description": "Freshly prepared Oreo Cake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 650
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 1203
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 58,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p15",
    "name": "Kitkat Cake",
    "slug": "kitkat-cake",
    "category": "cakes",
    "subGroup": null,
    "price": 650,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/cdf235f2a0e1a4039a6a0843db45aa09"
    ],
    "description": "Freshly prepared Kitkat Cake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 650
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 1203
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 59,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p16",
    "name": "Death By Chocolate",
    "slug": "death-by-chocolate",
    "category": "cakes",
    "subGroup": null,
    "price": 650,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/10/660545ad-22ff-495f-a569-07809343eaba_5a732ff9-6c70-41ff-9009-61ac97f54bd7.jpeg"
    ],
    "description": "Freshly prepared Death By Chocolate handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 650
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 1203
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 60,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p17",
    "name": "Fresh Fruit Cake",
    "slug": "fresh-fruit-cake",
    "category": "cakes",
    "subGroup": null,
    "price": 700,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/6/ea5504a2-afc9-47e3-8343-68e1fcf9e50c_7a22c480-1661-4346-b4db-d0e04e8e68d6.JPG"
    ],
    "description": "Freshly prepared Fresh Fruit Cake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 700
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 1295
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 61,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p18",
    "name": "Belgium Chocolate",
    "slug": "belgium-chocolate",
    "category": "cakes",
    "subGroup": null,
    "price": 700,
    "discountPrice": null,
    "images": [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTw91kgNb-9QHfNU_PgZltxsEyAJ3I4Jb5gYto5pkCIg&s"
    ],
    "description": "Freshly prepared Belgium Chocolate handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 700
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 1295
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 62,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p19",
    "name": "Dutch Cake",
    "slug": "dutch-cake",
    "category": "cakes",
    "subGroup": null,
    "price": 700,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/9/29/badbe9c8-3b7b-4e11-9ffc-5d462319f866_df899fe4-c880-45ad-bf14-9ed5c0ab52f3.jpg"
    ],
    "description": "Freshly prepared Dutch Cake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 700
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 1295
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 63,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p20",
    "name": "Mango With Fruit",
    "slug": "mango-with-fruit",
    "category": "cakes",
    "subGroup": null,
    "price": 700,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1551024709-8f23befc6f88?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Mango With Fruit handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 700
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 1295
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 64,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p21",
    "name": "Plain Brownie",
    "slug": "plain-brownie",
    "category": "cakes",
    "subGroup": null,
    "price": 120,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600,h_600,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/11/24/1c081623-7e0f-48c9-9953-cc68e2c36367_633f99a4-bc34-44cc-b660-6267e956ba86.jpg"
    ],
    "description": "Freshly prepared Plain Brownie handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 120
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 222
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 65,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p22",
    "name": "Walnut Brownie With Chocolate",
    "slug": "walnut-brownie-with-chocolate",
    "category": "cakes",
    "subGroup": null,
    "price": 140,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Walnut Brownie With Chocolate handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "0.5 kg (Serves 4-6)",
        "price": 140
      },
      {
        "label": "1.0 kg (Serves 8-12)",
        "price": 259
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 66,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "cakes",
      "fresh"
    ]
  },
  {
    "id": "p23",
    "name": "Mixed Fruits Pastry",
    "slug": "mixed-fruits-pastry",
    "category": "pastries",
    "subGroup": null,
    "price": 140,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/260ff94d-8fb5-4878-b0fe-7ede219a73ed_18f13dec-4e61-4d0a-8584-145078dd9274.jpeg"
    ],
    "description": "Freshly prepared Mixed Fruits Pastry handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 140
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 67,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "pastries",
      "fresh"
    ]
  },
  {
    "id": "p24",
    "name": "Nutella Cheese Pastry",
    "slug": "nutella-cheese-pastry",
    "category": "pastries",
    "subGroup": null,
    "price": 150,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/4/25/e2fc6115-513a-4c2f-9566-431cbe37ef13_9f10a5a9-c27d-45aa-91b9-588df0762604.jpg"
    ],
    "description": "Freshly prepared Nutella Cheese Pastry handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 150
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 68,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "pastries",
      "fresh"
    ]
  },
  {
    "id": "p25",
    "name": "Blueberry Cheese Pastry",
    "slug": "blueberry-cheese-pastry",
    "category": "pastries",
    "subGroup": null,
    "price": 150,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/ada23706-f24f-428b-8fd0-dabd8e24b1ba_bceba5bf-16a9-464b-a4e7-c06912b76687.jpg"
    ],
    "description": "Freshly prepared Blueberry Cheese Pastry handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 150
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 69,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "pastries",
      "fresh"
    ]
  },
  {
    "id": "p26",
    "name": "Dutch Pastry",
    "slug": "dutch-pastry",
    "category": "pastries",
    "subGroup": null,
    "price": 150,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/6/a6b7201f-7ed0-48e3-b3d0-b2263fda08ad_90742205-40a2-4e94-bd95-22cedbb0d053.JPG"
    ],
    "description": "Freshly prepared Dutch Pastry handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 150
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 70,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "pastries",
      "fresh"
    ]
  },
  {
    "id": "p27",
    "name": "Dutch Hazelnut Pastry",
    "slug": "dutch-hazelnut-pastry",
    "category": "pastries",
    "subGroup": null,
    "price": 160,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/10/25/942bdfbd-6954-4a41-b276-39a0ad0b88e4_b745cdb8-86ca-4e02-81f5-48cd60bb80e4.jpg"
    ],
    "description": "Freshly prepared Dutch Hazelnut Pastry handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 160
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 71,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "pastries",
      "fresh"
    ]
  },
  {
    "id": "p28",
    "name": "Dutch Nutella Pastry",
    "slug": "dutch-nutella-pastry",
    "category": "pastries",
    "subGroup": null,
    "price": 160,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/2316751b-6b4d-4b67-aefc-0ecc3a81668b_59794a4c-f581-435b-b143-4024bacfcddd.jpg"
    ],
    "description": "Freshly prepared Dutch Nutella Pastry handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 160
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 72,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "pastries",
      "fresh"
    ]
  },
  {
    "id": "p29",
    "name": "Lotus Biscoff Cheese Pastry",
    "slug": "lotus-biscoff-cheese-pastry",
    "category": "pastries",
    "subGroup": null,
    "price": 170,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/12/4/5f3857f7-bc10-43b5-82de-430fe4ae992a_9474ff23-3f49-495d-acd0-fe8f15cadb96.jpeg"
    ],
    "description": "Freshly prepared Lotus Biscoff Cheese Pastry handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 170
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 73,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "pastries",
      "fresh"
    ]
  },
  {
    "id": "p30",
    "name": "Chocolate Sandwich",
    "slug": "chocolate-sandwich",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 115,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/2/19/0c0e2fb4-d819-48ab-a7bc-6362a236c173_c6c388f1-1f31-4f7b-a04f-f0cef4fefbaa.jpg"
    ],
    "description": "Freshly prepared Chocolate Sandwich handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 115
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 74,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p31",
    "name": "Bombay Grilled Sandwich",
    "slug": "bombay-grilled-sandwich",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/3c624f4a-c4e9-4e3c-b501-87c409cb097d_4c44e54e-81a5-4886-9175-ebfdd6ecd4bf.jpg"
    ],
    "description": "Freshly prepared Bombay Grilled Sandwich handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 75,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p32",
    "name": "Veg Cheese Burger",
    "slug": "veg-cheese-burger",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/5/20/66227ea7-79a9-4578-b482-6fd3f2e8e480_b9aed813-84bf-42e9-a4cd-6bb58de734f6.jpg_compressed"
    ],
    "description": "Freshly prepared Veg Cheese Burger handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 76,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p33",
    "name": "Aloo Tikki Sandwich",
    "slug": "aloo-tikki-sandwich",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 155,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/27/8ed56430-42fd-4877-8e10-ab09b936c0a9_38b8a05c-d2bc-4c78-83de-0126bdde4cad.JPG"
    ],
    "description": "Freshly prepared Aloo Tikki Sandwich handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 155
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 77,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p34",
    "name": "Peri Peri Burger",
    "slug": "peri-peri-burger",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 155,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/18/195617f0-df71-4d48-bd8d-5bc6a2e0a432_abdaa453-42ae-4080-a308-1c3abfc47e04.JPG"
    ],
    "description": "Freshly prepared Peri Peri Burger handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 155
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 78,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p35",
    "name": "Schezwan Burger",
    "slug": "schezwan-burger",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 155,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/6/aa36909b-8b2c-43a2-b0ce-54e9e1dd92c2_c6be3029-916a-4592-9a51-47fafa6f8387.JPG"
    ],
    "description": "Freshly prepared Schezwan Burger handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 155
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 79,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p36",
    "name": "Peri Peri Sandwich",
    "slug": "peri-peri-sandwich",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 155,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/lywqzzltz4o2p1cqdxyt"
    ],
    "description": "Freshly prepared Peri Peri Sandwich handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 155
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 80,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p37",
    "name": "Nutella Sandwich",
    "slug": "nutella-sandwich",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 165,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/260ff94d-8fb5-4878-b0fe-7ede219a73ed_18f13dec-4e61-4d0a-8584-145078dd9274.jpeg"
    ],
    "description": "Freshly prepared Nutella Sandwich handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 165
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 81,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p38",
    "name": "Bombay Grilled Sandwich With Cheese",
    "slug": "bombay-grilled-sandwich-with-cheese",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 165,
    "discountPrice": null,
    "images": [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA08pzV_wO49vZ1wjDz1qp7Oz2Qt9hrP0ZZ_ofBK07Tg&s=10"
    ],
    "description": "Freshly prepared Bombay Grilled Sandwich With Cheese handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 165
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 82,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p39",
    "name": "Paneer Tikka Sandwich",
    "slug": "paneer-tikka-sandwich",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 165,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/9/23/fd99fb74-c52f-4417-84ac-0e25836fa05d_ab6e0062-0f10-42c4-9fa8-7f4d787015d7.jpg"
    ],
    "description": "Freshly prepared Paneer Tikka Sandwich handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 165
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 83,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p40",
    "name": "Tandoori Paneer Sandwich",
    "slug": "tandoori-paneer-sandwich",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 165,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/887e0e31513accce7d88f51fc7b7b0a9"
    ],
    "description": "Freshly prepared Tandoori Paneer Sandwich handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 165
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 84,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p41",
    "name": "Cheese Club Sandwich",
    "slug": "cheese-club-sandwich",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 165,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/11/24/9a097666-0a78-4e80-a9f2-74ededd33c45_33ecf09f-e58e-435c-80c6-95b35204b61a.jpg"
    ],
    "description": "Freshly prepared Cheese Club Sandwich handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 165
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 85,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p42",
    "name": "Makhani Sandwich",
    "slug": "makhani-sandwich",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 155,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/6/11/c9c4f538-3271-4c0f-962b-e39b7da9b80a_7139818c-e7a8-4002-9cec-f615dc342810.jpeg"
    ],
    "description": "Freshly prepared Makhani Sandwich handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 155
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 86,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p43",
    "name": "Chutney Cheese Sandwich",
    "slug": "chutney-cheese-sandwich",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 169,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/4/d66c84a2-e986-49f5-8d0b-9019c67232a1_03381e77-e108-4bf5-b5bd-b3d3d0135e44.jpeg"
    ],
    "description": "Freshly prepared Chutney Cheese Sandwich handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 169
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 87,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p44",
    "name": "Chilli Cheese",
    "slug": "chilli-cheese",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 179,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/21/9fe51bd0-6085-461f-a140-6ccdcaf7af2c_7a371ef1-5267-4e2c-a6ab-717e2a7221b7.JPG"
    ],
    "description": "Freshly prepared Chilli Cheese handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 179
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 88,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p45",
    "name": "Cheese Garlic",
    "slug": "cheese-garlic",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 180,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/16/ef2bc151-be47-4434-9471-aea4430164f8_511ebaef-f0ad-4596-8558-73c2b06e985a.JPG"
    ],
    "description": "Freshly prepared Cheese Garlic handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 180
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 89,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p46",
    "name": "Peri Peri",
    "slug": "peri-peri",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 180,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/6/02541c89-dac3-405d-b4c5-ea00b4e1743f_c10a0b84-43c2-4e4e-99c5-7c823688cef3.JPG"
    ],
    "description": "Freshly prepared Peri Peri handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 180
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 90,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p47",
    "name": "Maharaja Burger",
    "slug": "maharaja-burger",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 219,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/6/21/fc37870f-3725-40d8-b8e0-a831bb545243_9cc4e002-251d-4884-88c7-20c98d1eec36.jpg"
    ],
    "description": "Freshly prepared Maharaja Burger handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 219
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 91,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p48",
    "name": "Punjabi Toast",
    "slug": "punjabi-toast",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 219,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Punjabi Toast handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 219
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 92,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p49",
    "name": "Pico De Gallo",
    "slug": "pico-de-gallo",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 229,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/bbeb26bd-c9ae-4f91-bd2c-f8319d212048_d672b0c2-499f-428a-b8cd-602bff93e5a6.jpg"
    ],
    "description": "Freshly prepared Pico De Gallo handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 229
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 93,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p50",
    "name": "The Hb Special",
    "slug": "the-hb-special",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 245,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared The Hb Special handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 245
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 94,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p51",
    "name": "Nutella Bun Maska",
    "slug": "nutella-bun-maska",
    "category": "munchies",
    "subGroup": "sandwiches",
    "price": 155,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/10/b7e147df-975e-453e-a169-10c06177b862_2e4bd1c3-c4e2-4bc6-bf85-709303f7eaf2.jpeg"
    ],
    "description": "Freshly prepared Nutella Bun Maska handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 155
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 45,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "sandwiches"
    ]
  },
  {
    "id": "p52",
    "name": "Margarita Pizza (9 inch)",
    "slug": "margarita-pizza-9-inch",
    "category": "munchies",
    "subGroup": "pizzas",
    "price": 195,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/6/21/fc37870f-3725-40d8-b8e0-a831bb545243_9cc4e002-251d-4884-88c7-20c98d1eec36.jpg"
    ],
    "description": "Freshly prepared Margarita Pizza (9 inch) handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 195
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 46,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "pizzas"
    ]
  },
  {
    "id": "p53",
    "name": "Peri Peri Pizza (9 inch)",
    "slug": "peri-peri-pizza-9-inch",
    "category": "munchies",
    "subGroup": "pizzas",
    "price": 245,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/7/17/a6c1f256-a2e1-4001-a627-763239e2869b_c5758560-b35d-4ba2-a5ff-9fe5243739e3.jpeg"
    ],
    "description": "Freshly prepared Peri Peri Pizza (9 inch) handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 245
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 47,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "pizzas"
    ]
  },
  {
    "id": "p54",
    "name": "Paneer Tikka Pizza (9 inch)",
    "slug": "paneer-tikka-pizza-9-inch",
    "category": "munchies",
    "subGroup": "pizzas",
    "price": 299,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/9/21/224608bc-b52e-4900-96ef-f2df831ecefb_bce1dd4c-112c-4cba-a31b-76e035bbf27f.jpeg"
    ],
    "description": "Freshly prepared Paneer Tikka Pizza (9 inch) handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 299
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 48,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "pizzas"
    ]
  },
  {
    "id": "p55",
    "name": "Cheese Burst Pizza (9 inch)",
    "slug": "cheese-burst-pizza-9-inch",
    "category": "munchies",
    "subGroup": "pizzas",
    "price": 299,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/15c6c973-7057-4cfe-a538-7d0ccf0c459c_e5b525c1-9a21-4492-91dd-e66baf1b48a9.jpeg"
    ],
    "description": "Freshly prepared Cheese Burst Pizza (9 inch) handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 299
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 49,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "pizzas"
    ]
  },
  {
    "id": "p56",
    "name": "Mexican Pizza",
    "slug": "mexican-pizza",
    "category": "munchies",
    "subGroup": "pizzas",
    "price": 299,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/9bbc2488-2f1a-4fb9-9418-12d11ba73429_bf12711b-bfcf-46e8-8114-ab599e077e07.jpg"
    ],
    "description": "Freshly prepared Mexican Pizza handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 299
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 50,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "pizzas"
    ]
  },
  {
    "id": "p57",
    "name": "Plain Maggi",
    "slug": "plain-maggi",
    "category": "munchies",
    "subGroup": "maggi",
    "price": 75,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/9/28/5dfbf99e-508a-477c-9401-8fbb437a9689_4effdd4f-1644-49b8-aab4-9488236a7e7d.jpeg"
    ],
    "description": "Freshly prepared Plain Maggi handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 75
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 51,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "maggi"
    ]
  },
  {
    "id": "p58",
    "name": "Peri Peri Maggi",
    "slug": "peri-peri-maggi",
    "category": "munchies",
    "subGroup": "maggi",
    "price": 115,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/22/6f3fb0a1-c021-48d3-908c-5868319352f7_fb61b9b3-1b9c-49e2-a646-557de8e31231.JPG"
    ],
    "description": "Freshly prepared Peri Peri Maggi handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 115
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 52,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "maggi"
    ]
  },
  {
    "id": "p59",
    "name": "Masala Maggi",
    "slug": "masala-maggi",
    "category": "munchies",
    "subGroup": "maggi",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/xt6zil21pev9yeychtnz"
    ],
    "description": "Freshly prepared Masala Maggi handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 53,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "maggi"
    ]
  },
  {
    "id": "p60",
    "name": "Schezwan Maggi",
    "slug": "schezwan-maggi",
    "category": "munchies",
    "subGroup": "maggi",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/2/22/f70a7a3c-df48-4422-ad50-8022bbc2c640_17217a9a-ed48-4798-800f-1689fd391fd0.jpg"
    ],
    "description": "Freshly prepared Schezwan Maggi handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 54,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "maggi"
    ]
  },
  {
    "id": "p61",
    "name": "Peri Peri Cheese Maggi",
    "slug": "peri-peri-cheese-maggi",
    "category": "munchies",
    "subGroup": "maggi",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/8/ba174e31-5b1d-4728-848a-964a28dcffcb_4fa7357d-e5b8-4697-a189-e9471e1dfe07.JPG"
    ],
    "description": "Freshly prepared Peri Peri Cheese Maggi handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 55,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "maggi"
    ]
  },
  {
    "id": "p62",
    "name": "Cheese Maggi",
    "slug": "cheese-maggi",
    "category": "munchies",
    "subGroup": "maggi",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/10/29/4f10b906-aa02-4260-8608-51f48f0386df_ff08f7e4-f212-48b1-9597-6ad85ff86dd4.jpg_compressed"
    ],
    "description": "Freshly prepared Cheese Maggi handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 56,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "maggi"
    ]
  },
  {
    "id": "p63",
    "name": "Butter Maggi",
    "slug": "butter-maggi",
    "category": "munchies",
    "subGroup": "maggi",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/10/18/3cb8d493-4bc1-4061-875f-9344ebc4f217_772223a6-91ee-4a71-9b79-5afdb77cca7e.jpg"
    ],
    "description": "Freshly prepared Butter Maggi handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 57,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "maggi"
    ]
  },
  {
    "id": "p64",
    "name": "Cheese Garlic Maggi",
    "slug": "cheese-garlic-maggi",
    "category": "munchies",
    "subGroup": "maggi",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/oi6tkxl05xkhrjrtrbxu"
    ],
    "description": "Freshly prepared Cheese Garlic Maggi handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 58,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "maggi"
    ]
  },
  {
    "id": "p65",
    "name": "Vegetable Maggi",
    "slug": "vegetable-maggi",
    "category": "munchies",
    "subGroup": "maggi",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/w7dqjsands5jbpsckcf4"
    ],
    "description": "Freshly prepared Vegetable Maggi handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 59,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "maggi"
    ]
  },
  {
    "id": "p66",
    "name": "Salted Fries",
    "slug": "salted-fries",
    "category": "munchies",
    "subGroup": "fries",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/9/1/8fb52e59-2f18-4fbf-8506-79f39b4ee0a3_2e8b3c23-649b-4de7-9248-3539eb1c5007.jpg"
    ],
    "description": "Freshly prepared Salted Fries handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 60,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "fries"
    ]
  },
  {
    "id": "p67",
    "name": "Cheese Fries",
    "slug": "cheese-fries",
    "category": "munchies",
    "subGroup": "fries",
    "price": 155,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/12/28/3663bf01-68f8-41f6-ba18-602c54372e3f_d9e3fcad-ce42-4e89-91d7-ac5d4ecb0dde.jpg"
    ],
    "description": "Freshly prepared Cheese Fries handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 155
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 61,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "fries"
    ]
  },
  {
    "id": "p68",
    "name": "Cheese Ball",
    "slug": "cheese-ball",
    "category": "munchies",
    "subGroup": "fries",
    "price": 169,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/9/ca3ec4d5-0cb5-469f-ab6c-51cd64237fc4_af5d7926-92b4-4b99-8cb9-8c63d4f2fc3f.jpg"
    ],
    "description": "Freshly prepared Cheese Ball handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 169
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 62,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "fries"
    ]
  },
  {
    "id": "p69",
    "name": "Peri Peri Fries",
    "slug": "peri-peri-fries",
    "category": "munchies",
    "subGroup": "fries",
    "price": 195,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/10/9/726518c1-fb9f-4c33-b080-3c62422c0d41_b01192f8-11d0-4a84-8b98-5bbcb3fc1d31.jpg"
    ],
    "description": "Freshly prepared Peri Peri Fries handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 195
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 63,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "fries"
    ]
  },
  {
    "id": "p70",
    "name": "Peri Peri Cheese Fries",
    "slug": "peri-peri-cheese-fries",
    "category": "munchies",
    "subGroup": "fries",
    "price": 195,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/9a1c6809fcdfc4d0ccb1534dc224c218"
    ],
    "description": "Freshly prepared Peri Peri Cheese Fries handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 195
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 64,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "fries"
    ]
  },
  {
    "id": "p71",
    "name": "Mexican Baked Fries",
    "slug": "mexican-baked-fries",
    "category": "munchies",
    "subGroup": "fries",
    "price": 245,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/11/10/23017605-ad53-44b7-b3c6-636df8476d3f_29028a72-7abd-45b2-b02f-2c249a169563.jpg"
    ],
    "description": "Freshly prepared Mexican Baked Fries handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 245
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 65,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "fries"
    ]
  },
  {
    "id": "p72",
    "name": "Cheese Nachos",
    "slug": "cheese-nachos",
    "category": "munchies",
    "subGroup": "fries",
    "price": 259,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/12/19/fee93345-ab7b-4d8f-8433-b703ae121ddb_6138cf34-ed81-4ffb-847a-dbf811cce9b0.jpg"
    ],
    "description": "Freshly prepared Cheese Nachos handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 259
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 66,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "fries"
    ]
  },
  {
    "id": "p73",
    "name": "Mexican Nachos",
    "slug": "mexican-nachos",
    "category": "munchies",
    "subGroup": "fries",
    "price": 285,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/23/73a0a8cb-fa79-4a50-95dc-208dd8c2d2d3_3fa1bb68-e774-444e-9f32-0e474eddae52.JPG"
    ],
    "description": "Freshly prepared Mexican Nachos handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 285
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 67,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "fries"
    ]
  },
  {
    "id": "p74",
    "name": "Blueberry Cheese (Snack)",
    "slug": "blueberry-cheese-snack",
    "category": "munchies",
    "subGroup": "fries",
    "price": 165,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Blueberry Cheese (Snack) handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 165
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 68,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "munchies",
      "fries"
    ]
  },
  {
    "id": "p75",
    "name": "Chocolate Ice-Cream",
    "slug": "chocolate-ice-cream",
    "category": "desserts",
    "subGroup": null,
    "price": 89,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/7/7169ef2b-9ce7-4165-b89b-e2d93e014684_cba55d84-354e-4fc6-9601-94c4ad220592.JPG"
    ],
    "description": "Freshly prepared Chocolate Ice-Cream handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 89
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 69,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "desserts",
      "fresh"
    ]
  },
  {
    "id": "p76",
    "name": "Vanilla Ice Cream",
    "slug": "vanilla-ice-cream",
    "category": "desserts",
    "subGroup": null,
    "price": 89,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/7/17992145-17e5-4eab-8e2f-7fdafeaffd11_8459655a-2f6e-4014-ad46-66b3b8c0f7e4.JPG"
    ],
    "description": "Freshly prepared Vanilla Ice Cream handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 89
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 70,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "desserts",
      "fresh"
    ]
  },
  {
    "id": "p77",
    "name": "Belgium Ice-Cream",
    "slug": "belgium-ice-cream",
    "category": "desserts",
    "subGroup": null,
    "price": 115,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1551024709-8f23befc6f89?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Belgium Ice-Cream handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 115
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 71,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "desserts",
      "fresh"
    ]
  },
  {
    "id": "p78",
    "name": "Brownie",
    "slug": "brownie",
    "category": "desserts",
    "subGroup": null,
    "price": 115,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/2/12/e4b30df0-e743-4aae-be0d-8f4db5e20076_3760b423-523b-4d79-a6f0-3f9ac861722f.jpg_compressed"
    ],
    "description": "Freshly prepared Brownie handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 115
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 72,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "desserts",
      "fresh"
    ]
  },
  {
    "id": "p79",
    "name": "Ice Cream Combo",
    "slug": "ice-cream-combo",
    "category": "desserts",
    "subGroup": null,
    "price": 165,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/22/c47cf262-4b20-4a72-b258-64d705f8508f_f6dc02cb-a391-4c7e-8be5-cf1e76a68c4d.JPG"
    ],
    "description": "Freshly prepared Ice Cream Combo handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 165
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 73,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "desserts",
      "fresh"
    ]
  },
  {
    "id": "p80",
    "name": "Nutella Brownie",
    "slug": "nutella-brownie",
    "category": "desserts",
    "subGroup": null,
    "price": 189,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/5/15/ce5f2d83-b2d3-439c-a1f5-1b3f0e683428_9402e233-9119-4909-9bf7-fb82cb3ceb81.jpg"
    ],
    "description": "Freshly prepared Nutella Brownie handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 189
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 74,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "desserts",
      "fresh"
    ]
  },
  {
    "id": "p81",
    "name": "Brownie With Ice Cream",
    "slug": "brownie-with-ice-cream",
    "category": "desserts",
    "subGroup": null,
    "price": 229,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/223393a7-1bc6-4f3d-8a7e-780e3f08ab0a_6aa09c34-3804-4c30-9883-ad123b62037b.jpg"
    ],
    "description": "Freshly prepared Brownie With Ice Cream handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 229
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 75,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "desserts",
      "fresh"
    ]
  },
  {
    "id": "p82",
    "name": "Nutella Brownie Ice Cream",
    "slug": "nutella-brownie-ice-cream",
    "category": "desserts",
    "subGroup": null,
    "price": 245,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1587314168485-3236d6710815?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Nutella Brownie Ice Cream handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 245
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 76,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "desserts",
      "fresh"
    ]
  },
  {
    "id": "p83",
    "name": "Sizzling Brownie",
    "slug": "sizzling-brownie",
    "category": "desserts",
    "subGroup": null,
    "price": 259,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/19/d4da6e4e-afc0-45aa-a705-54e1acd008d4_b699e38c-a7ac-4f0d-ba9c-3eea4a83efa2.JPG"
    ],
    "description": "Freshly prepared Sizzling Brownie handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 259
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 77,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "desserts",
      "fresh"
    ]
  },
  {
    "id": "p84",
    "name": "Chai + Bun Maska",
    "slug": "chai-bun-maska",
    "category": "combos",
    "subGroup": null,
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/7/17/8a43d8e6-4141-4eae-b808-3b77e9194570_61a555c2-6083-4a4f-92f4-06040faac476.jpeg"
    ],
    "description": "Freshly prepared Chai + Bun Maska handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 78,
    "stockStatus": "IN_STOCK",
    "featured": true,
    "tags": [
      "combos",
      "fresh"
    ]
  },
  {
    "id": "p85",
    "name": "Cold Coffee + Bombay Grilled Sandwich",
    "slug": "cold-coffee-bombay-grilled-sandwich",
    "category": "combos",
    "subGroup": null,
    "price": 219,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/11/24/09b1e2d4-5b4c-4239-aa76-ca4b68d7c182_c63926bd-a692-4d0f-9dd4-7b82225c7858.jpg"
    ],
    "description": "Freshly prepared Cold Coffee + Bombay Grilled Sandwich handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 219
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 79,
    "stockStatus": "IN_STOCK",
    "featured": true,
    "tags": [
      "combos",
      "fresh"
    ]
  },
  {
    "id": "p86",
    "name": "Aloo Tikki Sandwich + Mountain Mojito",
    "slug": "aloo-tikki-sandwich-mountain-mojito",
    "category": "combos",
    "subGroup": null,
    "price": 259,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Aloo Tikki Sandwich + Mountain Mojito handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 259
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 80,
    "stockStatus": "IN_STOCK",
    "featured": true,
    "tags": [
      "combos",
      "fresh"
    ]
  },
  {
    "id": "p87",
    "name": "Peri Peri Burger + Peri Peri Fries",
    "slug": "peri-peri-burger-peri-peri-fries",
    "category": "combos",
    "subGroup": null,
    "price": 309,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1550547660-d9450f859350?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Peri Peri Burger + Peri Peri Fries handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 309
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 81,
    "stockStatus": "IN_STOCK",
    "featured": true,
    "tags": [
      "combos",
      "fresh"
    ]
  },
  {
    "id": "p88",
    "name": "Cheese Club Sandwich + Peri Peri Fries",
    "slug": "cheese-club-sandwich-peri-peri-fries",
    "category": "combos",
    "subGroup": null,
    "price": 329,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/11/19/531fb40f-cb48-4fa2-985d-3c37103d1196_13aedf39-8742-47e2-a1b7-e12643e1c5ff.jpg"
    ],
    "description": "Freshly prepared Cheese Club Sandwich + Peri Peri Fries handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 329
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 82,
    "stockStatus": "IN_STOCK",
    "featured": true,
    "tags": [
      "combos",
      "fresh"
    ]
  },
  {
    "id": "p89",
    "name": "Paneer Tikka Pizza (9 Inches) + Iced Latte",
    "slug": "paneer-tikka-pizza-9-inches-iced-latte",
    "category": "combos",
    "subGroup": null,
    "price": 339,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Paneer Tikka Pizza (9 Inches) + Iced Latte handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 339
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 83,
    "stockStatus": "IN_STOCK",
    "featured": true,
    "tags": [
      "combos",
      "fresh"
    ]
  },
  {
    "id": "p90",
    "name": "Jalapeno Nachos + Coke Float",
    "slug": "jalapeno-nachos-coke-float",
    "category": "combos",
    "subGroup": null,
    "price": 349,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Jalapeno Nachos + Coke Float handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 349
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 84,
    "stockStatus": "IN_STOCK",
    "featured": true,
    "tags": [
      "combos",
      "fresh"
    ]
  },
  {
    "id": "p91",
    "name": "Butterscotch Shake + Chocolate Shake",
    "slug": "butterscotch-shake-chocolate-shake",
    "category": "combos",
    "subGroup": null,
    "price": 249,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Butterscotch Shake + Chocolate Shake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 249
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 85,
    "stockStatus": "IN_STOCK",
    "featured": true,
    "tags": [
      "combos",
      "fresh"
    ]
  },
  {
    "id": "p92",
    "name": "Vegetable Maggi + Hide And Seek Shake",
    "slug": "vegetable-maggi-hide-and-seek-shake",
    "category": "combos",
    "subGroup": null,
    "price": 249,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Vegetable Maggi + Hide And Seek Shake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 249
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 86,
    "stockStatus": "IN_STOCK",
    "featured": true,
    "tags": [
      "combos",
      "fresh"
    ]
  },
  {
    "id": "p93",
    "name": "Friendship Day Quick Bite Combo (2x Cheese Club Sandwich + 2x Mountain Mojito + 1x Mixed Fruits Pastry)",
    "slug": "friendship-day-quick-bite-combo-2x-cheese-club-sandwich-2x-mountain-mojito-1x-mixed-fruits-pastry",
    "category": "combos",
    "subGroup": null,
    "price": 728,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Friendship Day Quick Bite Combo (2x Cheese Club Sandwich + 2x Mountain Mojito + 1x Mixed Fruits Pastry) handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 728
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 87,
    "stockStatus": "IN_STOCK",
    "featured": true,
    "tags": [
      "combos",
      "fresh"
    ]
  },
  {
    "id": "p94",
    "name": "Butterscotch Shake",
    "slug": "butterscotch-shake",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/4/15/31881d27-d9a2-4ea2-84ba-52d7011c6e1c_6cca8ec6-1068-4e11-83dd-e54d48e10fa6.jpeg"
    ],
    "description": "Freshly prepared Butterscotch Shake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 88,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p95",
    "name": "Chocolate Shake",
    "slug": "chocolate-shake",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 165,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/10/17/cfc72432-d08d-4993-81ea-6a453560dd53_fcef1e5c-7a55-4a32-8837-4f961b3b25ea.jpeg"
    ],
    "description": "Freshly prepared Chocolate Shake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 165
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 89,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p96",
    "name": "Mango Shake",
    "slug": "mango-shake",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 155,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/4/13/bbbb287d-aff3-4f88-bfbf-2c4556a8a794_aed40fb9-0e80-4ac3-ba11-d7a40e664508.jpg"
    ],
    "description": "Freshly prepared Mango Shake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 155
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 90,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p97",
    "name": "Strawberry Shake",
    "slug": "strawberry-shake",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 155,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/10/23/8083bd6f-eeac-41bf-ba66-9a66a3c780a4_34bacfcb-5791-4996-8ed9-7cd5a9131877.jpg_compressed"
    ],
    "description": "Freshly prepared Strawberry Shake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 155
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 91,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p98",
    "name": "Rose Shake",
    "slug": "rose-shake",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 165,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/cccb3afb-fc64-4caf-af55-5d878e3e04d6_dc83ac1e-65c6-4285-a07c-c0b5ffa50525.jpg"
    ],
    "description": "Freshly prepared Rose Shake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 165
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 92,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p99",
    "name": "Blackcurrant Shake",
    "slug": "blackcurrant-shake",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 165,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/19/35c19e0f-1478-479c-9d5c-3245f6ed8f2e_6d7aa5a7-bfee-43ef-96a6-5f65b3602a82.JPG"
    ],
    "description": "Freshly prepared Blackcurrant Shake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 165
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 93,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p100",
    "name": "Motichoor",
    "slug": "motichoor",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 195,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/13/ee4a8a9a-10a4-4928-b2b4-6342c16cc0c3_d64b4c7f-6d97-45bc-93bf-77868c68fd72.JPG"
    ],
    "description": "Freshly prepared Motichoor handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 195
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 94,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p101",
    "name": "Dry Fruits",
    "slug": "dry-fruits",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 195,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/8e72e689-27df-4057-b6b2-fc7dfb2e7f5d_808fbf00-8167-400f-b4b4-cfa8eb584b96.jpg"
    ],
    "description": "Freshly prepared Dry Fruits handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 195
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 45,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p102",
    "name": "Hide And Seek Shake",
    "slug": "hide-and-seek-shake",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 205,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/98e78823-c500-446a-8c9e-1d9dc94e9dfc_d2c1b86e-ceb1-4bdd-aebe-a452c6b2068f.jpg"
    ],
    "description": "Freshly prepared Hide And Seek Shake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 205
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 46,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p103",
    "name": "Kaju Anjeer",
    "slug": "kaju-anjeer",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 205,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/17/e015a9ae-6004-4761-94c3-f6457ac45a9d_84a98c72-43dd-4beb-9a50-a18dafbd84b3.JPG"
    ],
    "description": "Freshly prepared Kaju Anjeer handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 205
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 47,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p104",
    "name": "Kesar Badam",
    "slug": "kesar-badam",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 205,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/c0fc6688-421f-4bf2-aecc-804f825d2c8c_d763801f-e1e5-463f-9be4-e6c5d30249ba.jpg"
    ],
    "description": "Freshly prepared Kesar Badam handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 205
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 48,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p105",
    "name": "Dark Chocolate",
    "slug": "dark-chocolate",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 205,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/29a57eda-6f0d-47f3-b3bf-c437044ed9d8_59d9e491-407a-4a4b-8ab4-46e8b1790b42.jpg"
    ],
    "description": "Freshly prepared Dark Chocolate handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 205
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 49,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p106",
    "name": "Oreo Mint",
    "slug": "oreo-mint",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 219,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/4/16/fb02f417-eae3-408e-a825-528a5b17ffd2_765489fe-8ff5-4529-a41b-da31e5dd44f0.jpeg"
    ],
    "description": "Freshly prepared Oreo Mint handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 219
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 50,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p107",
    "name": "Kit-Kat",
    "slug": "kit-kat",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 219,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/11/4eb9ffbd-0efa-4f3c-b1a3-99d349a64351_3d35cabd-e496-4b46-969d-43e07a62eb08.jpeg"
    ],
    "description": "Freshly prepared Kit-Kat handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 219
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 51,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p108",
    "name": "Blue Hell",
    "slug": "blue-hell",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 219,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/c8fb25ecd00e844ce754a9ef3e16c9f0"
    ],
    "description": "Freshly prepared Blue Hell handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 219
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 52,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p109",
    "name": "Brownie Shake",
    "slug": "brownie-shake",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 229,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/w4jmdkdxhzvkcvydvvzy"
    ],
    "description": "Freshly prepared Brownie Shake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 229
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 53,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p110",
    "name": "Nutella Shake",
    "slug": "nutella-shake",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 229,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/6/2aae703b-68c3-42bb-8f3e-478ffcc803c5_32474e00-25ef-46f2-ac12-db2a6b2d0834.jpg"
    ],
    "description": "Freshly prepared Nutella Shake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 229
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 54,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p111",
    "name": "Chocolate Orange Shake",
    "slug": "chocolate-orange-shake",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 229,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1572490122747-3968b75cc69e?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Chocolate Orange Shake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 229
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 55,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p112",
    "name": "Lotus Biscoff",
    "slug": "lotus-biscoff",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 245,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/27/1bd006b3-84d1-4fbc-8787-11e2c7f24cfa_3a15384c-2e37-498c-bd35-5091d4bef6de.JPG"
    ],
    "description": "Freshly prepared Lotus Biscoff handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 245
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 56,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p113",
    "name": "Ferrero Rocher",
    "slug": "ferrero-rocher",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 245,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/22/90d2e5ad-9ef3-4073-9c8a-7d60ac1ca581_c75c58fd-7a5f-4c68-b940-458aa7a9ad65.JPG"
    ],
    "description": "Freshly prepared Ferrero Rocher handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 245
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 57,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p114",
    "name": "Belgian Chocolate",
    "slug": "belgian-chocolate",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 259,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/19/01965096-070a-46aa-830e-3140e5a2acf7_753c3ded-f977-4ecc-b9aa-fb89abdc8c44.JPG"
    ],
    "description": "Freshly prepared Belgian Chocolate handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 259
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 58,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p115",
    "name": "Monster Shake",
    "slug": "monster-shake",
    "category": "drinks",
    "subGroup": "milkshakes",
    "price": 359,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/17/ddb9ec36-b6d3-4848-9aa1-438a68fe63aa_c92ccee5-6b4f-41f9-9f91-5267f4c8b325.JPG"
    ],
    "description": "Freshly prepared Monster Shake handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 359
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 59,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "milkshakes"
    ]
  },
  {
    "id": "p116",
    "name": "Virgin Watermelon",
    "slug": "virgin-watermelon",
    "category": "drinks",
    "subGroup": "mocktails",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Virgin Watermelon handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 60,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "mocktails"
    ]
  },
  {
    "id": "p117",
    "name": "Mountain Mojito",
    "slug": "mountain-mojito",
    "category": "drinks",
    "subGroup": "mocktails",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fe?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Mountain Mojito handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 61,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "mocktails"
    ]
  },
  {
    "id": "p118",
    "name": "Rose Mojito",
    "slug": "rose-mojito",
    "category": "drinks",
    "subGroup": "mocktails",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/29/06262d90-46bc-494e-a98f-94ea83a06e49_1be90df0-77b8-4fcc-bef6-0cb404557f4b.JPG"
    ],
    "description": "Freshly prepared Rose Mojito handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 62,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "mocktails"
    ]
  },
  {
    "id": "p119",
    "name": "Twister Mojito",
    "slug": "twister-mojito",
    "category": "drinks",
    "subGroup": "mocktails",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://images.unsplash.com/photo-1536935338788-846bb9981814?w=600&auto=format&fit=crop&q=80"
    ],
    "description": "Freshly prepared Twister Mojito handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 63,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "mocktails"
    ]
  },
  {
    "id": "p120",
    "name": "Lemonade Mojito",
    "slug": "lemonade-mojito",
    "category": "drinks",
    "subGroup": "mocktails",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/icgy1ez4am7omc5stvg2"
    ],
    "description": "Freshly prepared Lemonade Mojito handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 64,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "mocktails"
    ]
  },
  {
    "id": "p121",
    "name": "Strawberry Chamoli",
    "slug": "strawberry-chamoli",
    "category": "drinks",
    "subGroup": "mocktails",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/5059e63f-048b-4fda-9960-6f651a2f91e1_d9d35cb9-6b90-448a-99fd-e906a87b14c1.jpg"
    ],
    "description": "Freshly prepared Strawberry Chamoli handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 65,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "mocktails"
    ]
  },
  {
    "id": "p122",
    "name": "Blue Lagoon",
    "slug": "blue-lagoon",
    "category": "drinks",
    "subGroup": "mocktails",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/ddefb4cb-9279-4949-9ff4-afb10c92940f_5af75f71-c907-4b4e-899b-9b8eb2a8a7ca.jpg"
    ],
    "description": "Freshly prepared Blue Lagoon handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 66,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "mocktails"
    ]
  },
  {
    "id": "p123",
    "name": "Pina Colada",
    "slug": "pina-colada",
    "category": "drinks",
    "subGroup": "mocktails",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/7caac1bd-bdf0-44f0-aa9c-0b1a63e69dfd_86e5c23b-1a34-4c2d-94dc-72e4820781eb.jpg"
    ],
    "description": "Freshly prepared Pina Colada handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 67,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "mocktails"
    ]
  },
  {
    "id": "p124",
    "name": "Vanilla Scoop",
    "slug": "vanilla-scoop",
    "category": "drinks",
    "subGroup": "mocktails",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/74cadd20-8b20-4792-9cfa-41cb179f6a92_fb58d9e2-032e-40ff-b603-c9f82b8ba52e.jpg"
    ],
    "description": "Freshly prepared Vanilla Scoop handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 68,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "mocktails"
    ]
  },
  {
    "id": "p125",
    "name": "Raspberry Scoop",
    "slug": "raspberry-scoop",
    "category": "drinks",
    "subGroup": "mocktails",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/16/21a83d83-d0c9-48f0-8ad9-9b68303cbf1a_4b78cb43-a9d8-4b49-82e4-da9b42ea77a7.JPG"
    ],
    "description": "Freshly prepared Raspberry Scoop handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 69,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "mocktails"
    ]
  },
  {
    "id": "p126",
    "name": "Ruby Duby",
    "slug": "ruby-duby",
    "category": "drinks",
    "subGroup": "mocktails",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/2/12/015399ec-cf07-4c20-820a-65b98ce213e1_5c34896d-41e4-41c0-9139-4bccb29bf5bb.jpg"
    ],
    "description": "Freshly prepared Ruby Duby handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 70,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "mocktails"
    ]
  },
  {
    "id": "p127",
    "name": "Green Apple",
    "slug": "green-apple",
    "category": "drinks",
    "subGroup": "mocktails",
    "price": 129,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/18/f63b0cf5-5765-4109-a49a-2e28e25cfee7_2b714201-9516-4971-95fd-0027f464a77e.JPG"
    ],
    "description": "Freshly prepared Green Apple handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 129
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 71,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "mocktails"
    ]
  },
  {
    "id": "p128",
    "name": "Coke Float",
    "slug": "coke-float",
    "category": "drinks",
    "subGroup": "mocktails",
    "price": 195,
    "discountPrice": null,
    "images": [
      "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/10/30/75148b70-58b5-497b-87de-8480e8b61c83_4e290211-242f-4011-9c3b-1b8e37f0ca12.jpg"
    ],
    "description": "Freshly prepared Coke Float handcrafted at The Hidden Bakers in Akola. Made using premium fresh ingredients.",
    "ingredients": [
      "Fresh Dairy Cream",
      "Selected Spices",
      "Gourmet Ingredients"
    ],
    "sizes": [
      {
        "label": "Standard Portion",
        "price": 195
      }
    ],
    "isEggless": true,
    "rating": 4.8,
    "reviewsCount": 72,
    "stockStatus": "IN_STOCK",
    "featured": false,
    "tags": [
      "drinks",
      "mocktails"
    ]
  }
];

async function main() {
  console.log("🌱 Seeding database...");

  const adminPasswordHash = await bcrypt.hash("123456", 10);
  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: { passwordHash: adminPasswordHash, role: "ADMIN" },
    create: {
      name: "Admin User",
      email: "admin@gmail.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN"
    }
  });
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "The Hidden Bakers",
      tagline: "Artisanal Baking & Gourmet Confectionery in Akola",
      address: "Infront of LRT College, Necklace Road, New Radhakisan Plots, Akola, Maharashtra 444001",
      phone: "097650 13112",
      whatsappNumber: "919765013112",
      email: "hello@thehiddenbakers.com",
      openingHours: "Monday – Sunday: 9:00 AM - 10:00 PM",
      deliveryFee: 40,
      freeDeliveryThreshold: 500,
      minOrderAmount: 100,
      deliveryEnabled: true,
      pickupEnabled: true
    }
  });

  const categoryMap = {};
  for (const cat of categoriesList) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, imageUrl: cat.imageUrl },
      create: cat
    });
    categoryMap[cat.slug] = createdCat.id;
  }

  for (const prod of productsList) {
    const catId = categoryMap[prod.category];
    if (!catId) continue;

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        price: prod.price,
        description: prod.description,
        featured: prod.featured || false,
        categoryId: catId,
        images: {
          deleteMany: {},
          create: [{ url: prod.images[0], sortOrder: 0 }]
        }
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        categoryId: catId,
        description: prod.description,
        ingredients: "Fresh dairy cream, flour, cocoa powder, sugar & artisanal toppings",
        price: prod.price,
        images: {
          create: [{ url: prod.images[0], sortOrder: 0 }]
        },
        isEggless: true,
        featured: prod.featured || false,
        stockStatus: "IN_STOCK"
      }
    });
  }

  console.log("✅ Seed completed successfully!");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
