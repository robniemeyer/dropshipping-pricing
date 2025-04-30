// ========================
// Core Calculation Methods
// ========================

function getTotalCost(productCost, shippingCost, marketingCost, otherCosts) {
  return productCost + shippingCost + marketingCost + otherCosts;
}

function getSuggestedPrice(baseCost, profitMarginRate) {
  const platformFeeRate = parseFloat(document.getElementById("platformFeeRate").value) / 100 || 0;
  const paymentFeeRate = parseFloat(document.getElementById("paymentFeeRate").value) / 100 || 0;
  const otherFeeRate = parseFloat(document.getElementById("otherFeeRate").value) / 100 || 0;
  const taxRate = parseFloat(document.getElementById("taxRate").value) / 100 || 0;

  const totalFeeRate = platformFeeRate + paymentFeeRate + otherFeeRate + taxRate;
  const revenueFraction = 1 - totalFeeRate;

  if (revenueFraction <= 0) return 0;

  const desiredRevenue = baseCost * (1 + profitMarginRate);
  return desiredRevenue / revenueFraction;
}

function getDiscountedPrice(suggestedPrice, discountRate) {
  return suggestedPrice * (1 - discountRate);
}

function getPlatformFee(price, platformFeeRate) {
  return price * platformFeeRate;
}

function getPaymentFee(price, paymentFeeRate) {
  return price * paymentFeeRate;
}

function getOtherFee(price, otherFeeRate) {
  return price * otherFeeRate;
}

function getTax(price, taxRate) {
  return price * taxRate;
}

function getNetProfit(price, productCost, shippingCost, marketingCost, otherCosts, platformFee, paymentFee, otherFee, tax) {
  return price - (productCost + shippingCost + marketingCost + otherCosts + platformFee + paymentFee + otherFee + tax);
}

function getNetMargin(netProfit, finalPrice) {
  if (finalPrice === 0) return 0;
  return (netProfit / finalPrice) * 100;
}

// ========================
// Local Storage Handlers
// ========================

function saveInputsToStorage() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    localStorage.setItem(input.id, input.value);
  });
}

function loadInputsFromStorage() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    const savedValue = localStorage.getItem(input.id);
    if (savedValue !== null) {
      input.value = savedValue;
    }
  });
}

// ========================
// DOM Update Handler
// ========================

function updateUI() {
  const productCost = parseFloat(document.getElementById("productCost").value) || 0;
  const shippingCost = parseFloat(document.getElementById("shippingCost").value) || 0;
  const marketingCost = parseFloat(document.getElementById("marketingCost").value) || 0;
  const otherCosts = parseFloat(document.getElementById("otherCosts").value) || 0;

  const platformFeeRate = parseFloat(document.getElementById("platformFeeRate").value) / 100 || 0;
  const paymentFeeRate = parseFloat(document.getElementById("paymentFeeRate").value) / 100 || 0;
  const otherFeeRate = parseFloat(document.getElementById("otherFeeRate").value) / 100 || 0;
  const taxRate = parseFloat(document.getElementById("taxRate").value) / 100 || 0;
  const profitMarginRate = parseFloat(document.getElementById("profitMargin").value) / 100 || 0;
  const discountRate = parseFloat(document.getElementById("discountRate").value) / 100 || 0;

  const totalCost = getTotalCost(productCost, shippingCost, marketingCost, otherCosts);
  const suggestedPrice = getSuggestedPrice(totalCost, profitMarginRate);
  const discountedPrice = getDiscountedPrice(suggestedPrice, discountRate);

  const platformFee = getPlatformFee(suggestedPrice, platformFeeRate);
  const paymentFee = getPaymentFee(suggestedPrice, paymentFeeRate);
  const otherFee = getOtherFee(suggestedPrice, otherFeeRate);
  const tax = getTax(suggestedPrice, taxRate);

  const netProfit = getNetProfit(suggestedPrice, productCost, shippingCost, marketingCost, otherCosts, platformFee, paymentFee, otherFee, tax);
  const netMargin = getNetMargin(netProfit, suggestedPrice);

  document.getElementById("suggestedPrice").textContent = suggestedPrice.toFixed(2);
  document.getElementById("discountedPrice").textContent = discountedPrice.toFixed(2);
  document.getElementById("netProfit").textContent = netProfit.toFixed(2);
  document.getElementById("netMargin").textContent = netMargin.toFixed(2);
}

// ========================
// Clear Button Handler
// ========================

function clearAllInputs() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    input.value = "";
    localStorage.removeItem(input.id);
  });
  updateUI();
}

// ========================
// Clipboard Copy Handler
// ========================

function copyPriceValue({ spanId, buttonId }) {
  const value = parseFloat(document.getElementById(spanId).textContent);
  if (isNaN(value)) return;

  navigator.clipboard.writeText(value.toFixed(2));

  const button = document.getElementById(buttonId);
  const icon = button.querySelector(".material-icons");

  if (!icon) return;

  const originalIcon = "content_copy";
  const successIcon = "check";

  icon.textContent = successIcon;

  setTimeout(() => {
    icon.textContent = originalIcon;
  }, 1500);
}

// ========================
// Event Listeners
// ========================

document.addEventListener("DOMContentLoaded", () => {
  loadInputsFromStorage();
  updateUI();

  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      updateUI();
      saveInputsToStorage();
    });
  });

  document.getElementById("clearAll").addEventListener("click", clearAllInputs);

  document.getElementById("copySuggestedPrice").addEventListener("click", () => {
    copyPriceValue({ spanId: "suggestedPrice", buttonId: "copySuggestedPrice" });
  });

  document.getElementById("copyDiscountedPrice").addEventListener("click", () => {
    copyPriceValue({ spanId: "discountedPrice", buttonId: "copyDiscountedPrice" });
  });
});
