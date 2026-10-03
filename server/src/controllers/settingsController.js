const prisma = require("../config/db");

const safeFloat = (val, fallback = 0) => {
  if (val === undefined || val === null || val === "") return fallback;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? fallback : parsed;
};

const getSettings = async (req, res) => {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: "default" }
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { id: "default" }
      });
    }

    return res.json(settings);
  } catch (error) {
    console.error("[getSettings Error]:", error);
    return res.status(500).json({ message: "Error fetching store settings.", error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const {
      storeName,
      tagline,
      address,
      phone,
      whatsappNumber,
      email,
      openingHours,
      openingTime,
      closingTime,
      isStoreOpenManualOverride,
      storeClosedNotice,
      deliveryFee,
      freeDeliveryThreshold,
      minOrderAmount,
      maxDeliveryDistanceKm,
      baseIncludedKm,
      extraKmFee,
      deliveryEnabled,
      pickupEnabled,
      zomatoUrl,
      swiggyUrl,
      logoUrl
    } = req.body;

    let manualOverride = undefined;
    if (isStoreOpenManualOverride !== undefined) {
      if (
        isStoreOpenManualOverride === null ||
        isStoreOpenManualOverride === "null" ||
        isStoreOpenManualOverride === "" ||
        isStoreOpenManualOverride === "auto"
      ) {
        manualOverride = null;
      } else if (
        isStoreOpenManualOverride === true ||
        isStoreOpenManualOverride === "true" ||
        isStoreOpenManualOverride === "force_open"
      ) {
        manualOverride = true;
      } else if (
        isStoreOpenManualOverride === false ||
        isStoreOpenManualOverride === "false" ||
        isStoreOpenManualOverride === "force_closed"
      ) {
        manualOverride = false;
      }
    }

    const updateData = {};
    if (storeName !== undefined) updateData.storeName = String(storeName);
    if (tagline !== undefined) updateData.tagline = String(tagline);
    if (address !== undefined) updateData.address = String(address);
    if (phone !== undefined) updateData.phone = String(phone);
    if (whatsappNumber !== undefined) updateData.whatsappNumber = String(whatsappNumber);
    if (email !== undefined) updateData.email = String(email);
    if (openingHours !== undefined) updateData.openingHours = String(openingHours);
    if (openingTime !== undefined) updateData.openingTime = String(openingTime);
    if (closingTime !== undefined) updateData.closingTime = String(closingTime);
    if (isStoreOpenManualOverride !== undefined) updateData.isStoreOpenManualOverride = manualOverride;
    if (storeClosedNotice !== undefined) updateData.storeClosedNotice = String(storeClosedNotice);

    if (deliveryFee !== undefined) updateData.deliveryFee = safeFloat(deliveryFee, 40);
    if (freeDeliveryThreshold !== undefined) updateData.freeDeliveryThreshold = safeFloat(freeDeliveryThreshold, 500);
    if (minOrderAmount !== undefined) updateData.minOrderAmount = safeFloat(minOrderAmount, 100);
    if (maxDeliveryDistanceKm !== undefined) updateData.maxDeliveryDistanceKm = safeFloat(maxDeliveryDistanceKm, 30);
    if (baseIncludedKm !== undefined) updateData.baseIncludedKm = safeFloat(baseIncludedKm, 5);
    if (extraKmFee !== undefined) updateData.extraKmFee = safeFloat(extraKmFee, 10);

    if (deliveryEnabled !== undefined) updateData.deliveryEnabled = Boolean(deliveryEnabled);
    if (pickupEnabled !== undefined) updateData.pickupEnabled = Boolean(pickupEnabled);
    if (zomatoUrl !== undefined) updateData.zomatoUrl = zomatoUrl ? String(zomatoUrl) : null;
    if (swiggyUrl !== undefined) updateData.swiggyUrl = swiggyUrl ? String(swiggyUrl) : null;
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl ? String(logoUrl) : null;

    const settings = await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: updateData,
      create: {
        id: "default",
        ...updateData
      }
    });

    return res.json(settings);
  } catch (error) {
    console.error("[updateSettings Error]:", error);
    return res.status(500).json({ message: "Error updating store settings.", error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
