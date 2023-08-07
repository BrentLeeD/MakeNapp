document.addEventListener("DOMContentLoaded", function () {
  const chocolateInput = document.getElementById("chocolateInput");
  const sesameInput = document.getElementById("sesameInput");
  const plainInput = document.getElementById("plainInput");
  const streuselInput = document.getElementById("streuselInput");
  const weekSelect = document.getElementById("weekSelect");
  const addToBasketBtn = document.getElementById("addToBasketBtn");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const basketContents = document.getElementById("basketContents");
  const totalCost = document.getElementById("totalCost");

  // Challah prices in ZAR
  const chocolatePrice = 40;
  const sesamePrice = 35;
  const plainPrice = 35;
  const streuselPrice = 40;

  // Week 1 to Week 6 prices
  const weekPrices = {
    week2: 0,
    week3: 0,
    week4: 0,
    week5: 0,
    week6: 0,
  };

  // Store selected flavors and quantities
  let selectedFlavors = {};

  addToBasketBtn.addEventListener("click", function () {
    const selectedWeek = weekSelect.value;
    const chocolateQuantity = parseInt(chocolateInput.value);
    const sesameQuantity = parseInt(sesameInput.value);
    const plainQuantity = parseInt(plainInput.value);
    const streuselQuantity = parseInt(streuselInput.value);

    const orderItems = [];
    if (chocolateQuantity > 0) {
      orderItems.push(`${chocolateQuantity} x Chocolate`);
    }
    if (sesameQuantity > 0) {
      orderItems.push(`${sesameQuantity} x Sesame`);
    }
    if (plainQuantity > 0) {
      orderItems.push(`${plainQuantity} x Plain`);
    }
    if (streuselQuantity > 0) {
      orderItems.push(`${streuselQuantity} x Streusel`);
    }

    const orderSummary = orderItems.join(", ");

    if (orderSummary) {
      const basketItem = document.createElement("p");
      basketItem.textContent = `${getWeekDate(selectedWeek)}: ${orderSummary}`;
      basketContents.appendChild(basketItem);

      // Store selected flavors and quantities in the global variable
      selectedFlavors[selectedWeek] = {
        chocolate: chocolateQuantity,
        sesame: sesameQuantity,
        plain: plainQuantity,
        streusel: streuselQuantity,
      };

      // Update weekPrices object
      weekPrices[selectedWeek] =
        chocolateQuantity * chocolatePrice +
        sesameQuantity * sesamePrice +
        plainQuantity * plainPrice +
        streuselQuantity * streuselPrice;

      updateSubtotal();
    }

    // Reset form quantities
    chocolateInput.value = "0";
    sesameInput.value = "0";
    plainInput.value = "0";
    streuselInput.value = "0";
  });

  clearCartBtn.addEventListener("click", function () {
    const confirmation = confirm("Are you sure you want to clear the cart?");
    if (confirmation) {
      basketContents.innerHTML = "";
      for (const week in weekPrices) {
        weekPrices[week] = 0;
      }
      // Clear the selectedFlavors object
      selectedFlavors = {};
      updateSubtotal();
    }
  });

  checkoutBtn.addEventListener("click", function () {
    const confirmation = confirm(
      "That's a yummy order! We just need to confirm your details before you complete the order (payment will take place on a secure website)."
    );
    if (confirmation) {
      const parentName = prompt("Please enter your full name and contact details:");
      const phoneNumber = prompt("your child's name and class:");

      if (parentName && phoneNumber) {
        const orderDetails = `
          Parent's Name: ${parentName}
          Phone Number: ${phoneNumber}
        
          Order Details:
          ${getOrderSummary()}
        `;
        alert(orderDetails);
        
        const totalAmount = calculateTotalAmount();
const orderData = {
          Parent: parentName,
	  Child: phoneNumber,
          'Order Breakdown': orderDetails,
          Cost: `${totalAmount} ZAR`,
        };
        const apiKey = 'UmaiF3c39grmhByWn4MPZVYfklm90CFWPZxRx8cfi3MZrYXEt98tK4Tp7wo';
        const sheetId = '1A2c5YPjGiMzbTco8MsCbNCHDimWycyrq1iVd1Pulyjg';
        const apiUrl = `https://api.sheetson.com/v2/sheets/CHALLAH`;

        fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'X-Spreadsheet-Id': sheetId,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        })
                const checkoutUrl = `https://pos.snapscan.io/qr/Bu-elYzb?id=challah_${parentName}&amount=${totalAmount}00`;
        window.open(checkoutUrl, "_blank");
        // Clear the form and the selected flavors and quantities after checkout
        clearForm();
      } else {
        alert("Please fill out all the required information.");
      }
    }
  });

  function getOrderSummary() {
    const orderSummary = [];
    for (const week in weekPrices) {
      if (weekPrices[week] > 0) {
        orderSummary.push(`${getWeekDate(week)}:\n${getOrderItems(week)}\nTotal Cost: R${weekPrices[week]}`);
      }
    }
    return orderSummary.join("\n\n");
  }

  function getOrderItems(week) {
    const orderItems = [];
    const flavors = selectedFlavors[week];

    if (flavors.chocolate > 0) {
      orderItems.push(`${flavors.chocolate} x Chocolate`);
    }
    if (flavors.sesame > 0) {
      orderItems.push(`${flavors.sesame} x Sesame`);
    }
    if (flavors.plain > 0) {
      orderItems.push(`${flavors.plain} x Plain`);
    }
    if (flavors.streusel > 0) {
      orderItems.push(`${flavors.streusel} x Streusel`);
    }

    return orderItems.join("\n");
  }

  function calculateTotalAmount() {
    let overallTotal = 0;
    for (const week in weekPrices) {
      overallTotal += weekPrices[week];
    }
    return overallTotal;
  }

  function getWeekDate(week) {
    switch (week) {
      case "week2":
        return "10 August";
      case "week3":
        return "17 August";
      case "week4":
        return "24 August";
      case "week5":
        return "31 August";
      case "week6":
        return "7 September";
      default:
        return "Whole Term";
    }
  }

  function updateSubtotal() {
    let overallTotal = 0;
    for (const week in weekPrices) {
      overallTotal += weekPrices[week];
    }

    totalCost.textContent = `Total Cost: ${overallTotal} ZAR`;
  }

  function clearForm() {
    chocolateInput.value = "0";
    sesameInput.value = "0";
    plainInput.value = "0";
    streuselInput.value = "0";

    // Clear the selectedFlavors object
    selectedFlavors = {};

    // Clear the basketContents
    basketContents.innerHTML = "";

    // Reset weekPrices
    for (const week in weekPrices) {
      weekPrices[week] = 0;
    }

    // Update the total cost
    updateSubtotal();
  }
});
