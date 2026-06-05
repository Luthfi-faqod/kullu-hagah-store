// ============================================================
// KULLU HAGAH STORE - Product Data
// ============================================================

// Fallback data if Firestore is empty
const FALLBACK_STORE_DATA = {
  categories: [
    {
      id: "pulsa",
      name: "Pulsa",
      icon: "📱",
      subcategories: [
        {
          id: "we",
          name: "WE",
          products: [
            { id: "we1", pulsa: "15", data: "0.6 GB", egp: 30, idr: 11000 },
            { id: "we2", pulsa: "29", data: "1.3 GB", egp: 50, idr: 18000 },
            { id: "we3", pulsa: "58", data: "3.2 GB", egp: 92, idr: 33000 },
            { id: "we4", pulsa: "105", data: "6.2 GB", egp: 165, idr: 59000 },
            { id: "we5", pulsa: "150", data: "10 GB", egp: 237, idr: 84000 },
            { id: "we6", pulsa: "300", data: "23.5 GB", egp: 472, idr: 167000 },
            { id: "we7", pulsa: "675", data: "50 GB", egp: 1042, idr: 370000 },
          ]
        },
        {
          id: "orange",
          name: "Orange",
          products: [
            { id: "or1", pulsa: "23", data: "0.75 GB", egp: 43, idr: 15000 },
            { id: "or2", pulsa: "37", data: "1.4 GB", egp: 65, idr: 22000 },
            { id: "or3", pulsa: "58", data: "2.5 GB", egp: 95, idr: 32000 },
            { id: "or4", pulsa: "92", data: "4.25 GB", egp: 149, idr: 51000 },
            { id: "or5", pulsa: "120", data: "6 GB", egp: 193, idr: 67000 },
            { id: "or6", pulsa: "180", data: "10 GB", egp: 284, idr: 101000 },
            { id: "or7", pulsa: "300", data: "18 GB", egp: 472, idr: 165000 },
            { id: "or8", pulsa: "450", data: "29 GB", egp: 694, idr: 246000 },
            { id: "or9", pulsa: "600", data: "45 GB", egp: 927, idr: 329000 },
          ]
        },
        {
          id: "vodafone",
          name: "Vodafone",
          products: [
            { id: "vf1", pulsa: "32", data: "1.4 GB", egp: 54, idr: 19000 },
            { id: "vf2", pulsa: "60", data: "3 GB", egp: 95, idr: 34000 },
            { id: "vf3", pulsa: "85", data: "4.75 GB", egp: 134, idr: 48000 },
            { id: "vf4", pulsa: "105", data: "6 GB", egp: 165, idr: 58000 },
            { id: "vf5", pulsa: "155", data: "10 GB", egp: 244, idr: 87000 },
            { id: "vf6", pulsa: "260", data: "18 GB", egp: 409, idr: 145000 },
            { id: "vf7", pulsa: "520", data: "45 GB", egp: 802, idr: 285000 },
          ]
        },
        {
          id: "etisalat",
          name: "Etisalat",
          products: [
            { id: "et1", pulsa: "46", data: "1.25 GB", egp: 78, idr: 27000 },
            { id: "et2", pulsa: "58", data: "2.1 GB", egp: 95, idr: 32000 },
            { id: "et3", pulsa: "80", data: "3.25 GB", egp: 131, idr: 45000 },
            { id: "et4", pulsa: "105", data: "4.75 GB", egp: 169, idr: 58000 },
            { id: "et5", pulsa: "132", data: "6.75 GB", egp: 212, idr: 74000 },
            { id: "et6", pulsa: "165", data: "8.75 GB", egp: 260, idr: 92000 },
            { id: "et7", pulsa: "205", data: "11.5 GB", egp: 322, idr: 114000 },
            { id: "et8", pulsa: "270", data: "15 GB", egp: 425, idr: 151000 },
            { id: "et9", pulsa: "345", data: "20 GB", egp: 542, idr: 192000 },
            { id: "et10", pulsa: "415", data: "25 GB", egg: 640, idr: 227000 },
            { id: "et11", pulsa: "480", data: "30 GB", egp: 741, idr: 263000 },
            { id: "et12", pulsa: "600", data: "50 GB", egp: 927, idr: 329000 },
          ]
        },
        {
          id: "wifi-portable",
          name: "Wifi Portable",
          products: [
            { id: "wp1", pulsa: "15", data: "0.6 GB", egp: 30, idr: 11000 },
            { id: "wp2", pulsa: "29", data: "1.3 GB", egp: 50, idr: 18000 },
            { id: "wp3", pulsa: "58", data: "3.2 GB", egp: 92, idr: 33000 },
            { id: "wp4", pulsa: "105", data: "6.2 GB", egp: 165, idr: 59000 },
            { id: "wp5", pulsa: "150", data: "10 GB", egp: 237, idr: 84000 },
            { id: "wp6", pulsa: "300", data: "23.5 GB", egp: 472, idr: 167000 },
            { id: "wp7", pulsa: "675", data: "50 GB", egp: 1042, idr: 370000 },
          ]
        },
        {
          id: "wifi-ardhi",
          name: "Wifi Ardhi",
          products: [
            { id: "wa1", pulsa: "15", data: "0.6 GB (Tajdid)", egp: 30, idr: 11000 },
            { id: "wa2", pulsa: "29", data: "1.3 GB (Idhofi)", egp: 50, idr: 18000 },
            { id: "wa3", pulsa: "58", data: "3.2 GB (Tajdid)", egp: 92, idr: 33000 },
            { id: "wa4", pulsa: "105", data: "6.2 GB (Idhofi)", egp: 165, idr: 59000 },
            { id: la5", pulsa: "150", data: "10 GB (Tajdid)", egp: 237, idr: 84000 },
            { id: "wa6", pulsa: "300", data: "23.5 GB (Idhofi)", egp: 472, idr: 167000 },
            { id: "wa7", pulsa: "675", data: "50 GB (Tajdid)", egp: 1042, idr: 370000 },
          ]
        }
      ]
    },
    {
      id: "makanan",
      name: "Makanan",
      icon: "🍱",
      subcategories: []
    }
  ]
};

// global variable to hold data fetched from firestore
let STORE_DATA = { categories: [] };

async function getStoreData() {
  try {
    const doc = await db.collection('config').doc('store_data').get();
    if (doc.exists) {
      STORE_DATA = doc.data();
      return STORE_DATA;
    } else {
      console.log("Firestore document not found, using fallback data.");
      STORE_DATA = FALLBACK_STORE_DATA;
      await setStoreData(FALLBACK_STORE_DATA);
      return STORE_DATA;
    }
  } catch (e) {
    console.error("Error fetching store data:", e);
    STORE_DATA = FALLBACK_STORE_DATA;
    return STORE_DATA;
  }
}

async function setStoreData(data) {
  try {
    await db.collection('config').doc('store_data').set(data);
  } catch (e) {
    console.error("Error saving store data:", e);
  }
}

// ============================================================
// STORE STATE - Cart, Settings
// ============================================================
let cart = JSON.parse(localStorage.getItem('khs_cart') || '[]');
let settings = JSON.parse(localStorage.getItem('khs_settings') || JSON.stringify({
  darkMode: false,
  autoConvert: { egpToIdr: false, idrToEgp: false },
  rate: { egpToIdr: 355, idrToEgp: 0.0028 }
}));

function saveCart() {
  localStorage.setItem('khs_cart', JSON.stringify(cart));
}

function saveSettings() {
  localStorage.setItem('khs_settings', JSON.stringify(settings));
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
}

function formatIDR(val) {
  if (val >= 1000) return (val / 1000) + 'K';
  return val;
}

function getPrice(product) {
  // Returns { egp, idr } possibly auto-converted
  let egp = product.egp;
  let idr = product.idr;
  if (settings.autoConvert.egpToIdr) {
    idr = Math.round(egp * settings.rate.egpToIdr);
  }
  if (settings.autoConvert.idrToEgp) {
    egp = Math.round(idr / settings.rate.egpToIdr);
  }
  return { egp, idr };
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
}
