export const settings = {
  storeName: "The Hidden Bakers",
  tagline: "Artisanal Baking & Gourmet Confectionery in Akola",
  address: "Infront of LRT College, Necklace Road, New Radhakisan Plots, Akola, Maharashtra 444001",
  shortAddress: "Necklace Road, Akola",
  phone: "097650 13112",
  phoneRaw: "+919765013112",
  whatsAppNumber: "919765013112",
  email: "hello@thehiddenbakers.com",
  googleMapsUrl: "https://maps.google.com/?q=Infront+of+LRT+College,+Necklace+Road,+Akola,+Maharashtra+444001",
  
  openingHours: {
    weekdays: "9:00 AM - 10:00 PM",
    weekends: "9:00 AM - 10:30 PM",
    days: "Monday – Sunday"
  },

  deliveryFee: 0,
  freeDeliveryThreshold: 500,
  minOrderAmount: 100,
  deliveryEnabled: false,
  pickupEnabled: true,
  zomatoUrl: "https://www.zomato.com/akola/the-hidden-bakers-new-radhakisan-plots",
  swiggyUrl: "https://www.swiggy.com/city/akola/the-hidden-bakers-new-radhakisan-plots",

  announcement: {
    enabled: true,
    text: "✨ Fresh Belgian Chocolate Cakes & Gourmet Bakes available for online order & store pickup!",
    link: "/menu"
  },

  socialLinks: {
    instagram: "https://instagram.com/thehiddenbakers",
    facebook: "https://facebook.com/thehiddenbakers",
    whatsapp: "https://wa.me/919765013112"
  },

  paymentInfo: {
    acceptedMethods: [
      { id: "online", name: "Pay Online (Razorpay / Cards / NetBanking / UPI)", icon: "CreditCard" },
      { id: "upi_delivery", name: "Pay via UPI (GPay / PhonePe / Paytm) on Pickup", icon: "QrCode" },
      { id: "store", name: "Cash / Card at Bakery Store Counter", icon: "Store" }
    ],
    note: "Select your preferred payment method during checkout."
  }
};
