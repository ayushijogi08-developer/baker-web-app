/**
 * Formats portion / serving size labels intelligently based on category and product details.
 * Ensures non-cake items (Ice Creams, Brownies, Combos, Beverages/Mojitos, Fast Food)
 * never display incorrect weight labels like "0.5 kg".
 */
export const formatPortionLabel = (
  label: string,
  categoryNameOrSlug?: string,
  productName?: string
): string => {
  const cleanLabel = (label || "").trim();
  const lowerLabel = cleanLabel.toLowerCase();
  const lowerCat = (categoryNameOrSlug || "").toLowerCase();
  const lowerName = (productName || "").toLowerCase();

  // Check if label is a generic default or an improper cake fallback on a non-cake item
  const isGeneric =
    !cleanLabel ||
    lowerLabel === "standard" ||
    lowerLabel === "standard portion" ||
    lowerLabel.includes("0.5 kg (serves 4-6)") ||
    lowerLabel === "0.5 kg" ||
    lowerLabel === "1.0 kg";

  // 1. Shakes, Beverages, Mojitos, Coolers, Coffee & Tea
  if (
    lowerCat.includes("shake") ||
    lowerCat.includes("mocktail") ||
    lowerCat.includes("drink") ||
    lowerCat.includes("beverage") ||
    lowerCat.includes("coffee") ||
    lowerCat.includes("tea") ||
    lowerCat.includes("mojito") ||
    lowerCat.includes("cooler") ||
    lowerName.includes("shake") ||
    lowerName.includes("mojito") ||
    lowerName.includes("cooler") ||
    lowerName.includes("coffee") ||
    lowerName.includes("tea") ||
    lowerName.includes("juice") ||
    lowerName.includes("soda")
  ) {
    if (isGeneric) return "Regular";
    if (!isNaN(Number(cleanLabel))) return `${cleanLabel} ml`;
    return cleanLabel;
  }

  // 2. Ice Creams, Sundaes & Sizzler Desserts
  if (
    lowerCat.includes("dessert") ||
    lowerCat.includes("ice cream") ||
    lowerCat.includes("sundae") ||
    lowerName.includes("ice cream") ||
    lowerName.includes("sundae") ||
    lowerName.includes("scoop") ||
    lowerName.includes("kulfi")
  ) {
    if (isGeneric) return "1 Scoop";
    if (!isNaN(Number(cleanLabel))) return `${cleanLabel} Scoop${Number(cleanLabel) > 1 ? "s" : ""}`;
    return cleanLabel;
  }

  // 3. Combos & Value Sets
  if (
    lowerCat.includes("combo") ||
    lowerName.includes("combo") ||
    lowerName.includes("pack of") ||
    lowerName.includes("family set")
  ) {
    if (isGeneric) return "Combo Set";
    return cleanLabel;
  }

  // 4. Snacks, Fast Food, Fries, Pizzas, Burgers, Sandwiches, Maggi & Nachos
  if (
    lowerCat.includes("snack") ||
    lowerCat.includes("fry") ||
    lowerCat.includes("fries") ||
    lowerCat.includes("munchie") ||
    lowerCat.includes("savory") ||
    lowerCat.includes("pizza") ||
    lowerCat.includes("burger") ||
    lowerName.includes("fries") ||
    lowerName.includes("pizza") ||
    lowerName.includes("burger") ||
    lowerName.includes("sandwich") ||
    lowerName.includes("maggi") ||
    lowerName.includes("nachos") ||
    lowerName.includes("garlic bread")
  ) {
    if (isGeneric) return "Regular";
    if (!isNaN(Number(cleanLabel))) return `${cleanLabel} Portion`;
    return cleanLabel;
  }

  // 5. Brownies, Slices, Puffs & Pastries
  if (
    lowerCat.includes("pastr") ||
    lowerCat.includes("puff") ||
    lowerName.includes("brownie") ||
    lowerName.includes("pastry") ||
    lowerName.includes("slice") ||
    lowerName.includes("tart")
  ) {
    if (isGeneric) return lowerName.includes("brownie") ? "1 Pc" : "1 Slice";
    if (!isNaN(Number(cleanLabel))) return `${cleanLabel} Pc`;
    return cleanLabel;
  }

  // 6. Cakes (Whole Celebration Cakes)
  if (lowerCat.includes("cake") || lowerName.includes("cake")) {
    if (!cleanLabel || lowerLabel === "standard" || lowerLabel === "standard portion") {
      return "0.5 kg";
    }
    if (!isNaN(Number(cleanLabel))) return `${cleanLabel} kg`;
    return cleanLabel;
  }

  // If label already contains explicit unit/portion words (e.g., "Regular", "Large", "250ml", "1 Slice", "0.5 kg")
  if (
    lowerLabel.includes("kg") ||
    lowerLabel.includes("g") ||
    lowerLabel.includes("ml") ||
    lowerLabel.includes("ltr") ||
    lowerLabel.includes("slice") ||
    lowerLabel.includes("piece") ||
    lowerLabel.includes("pc") ||
    lowerLabel.includes("plate") ||
    lowerLabel.includes("scoop") ||
    lowerLabel.includes("pack") ||
    lowerLabel.includes("regular") ||
    lowerLabel.includes("large") ||
    lowerLabel.includes("medium") ||
    lowerLabel.includes("glass") ||
    lowerLabel.includes("portion") ||
    lowerLabel.includes("combo")
  ) {
    return cleanLabel;
  }

  // General Fallback
  if (!cleanLabel || lowerLabel === "standard" || lowerLabel === "standard portion") return "Regular";
  if (!isNaN(Number(cleanLabel))) return `${cleanLabel} Portion`;
  return cleanLabel;
};
