// Get references to HTML elements
let shop = document.getElementById("shop"); // Container for displaying shop items
let basket = JSON.parse(localStorage.getItem("data")) || []; // Retrieve the basket data from localStorage or initialize an empty array

// Function to generate the shop items and display them in the shop container
let generateShop = () => {
  shop.innerHTML = shopItemsData
    .map((x) => {
      let { id, name, price, desc, img } = x; // Destructure item properties
      let search = basket.find((x) => x.id === id) || []; // Find if the item is already in the basket
      return `
    <div id=product-id-${id} class="item">
        <img width="220" src=${img} alt="" onclick="showProductDetails('${id}')"> <!-- Show product details when clicked -->
        <div class="details">
          <h3>${name}</h3>
          <p>${desc}</p>
          <div class="price-quantity">
            <h2>$ ${price} </h2>
            <div class="buttons">
              <i onclick="decrement('${id}')" class="bi bi-dash-lg"></i> <!-- Decrement quantity -->
              <div id=${id} class="quantity">
              ${search.item === undefined ? 0 : search.item} <!-- Display current quantity -->
              </div>
              <i onclick="increment('${id}')" class="bi bi-plus-lg"></i> <!-- Increment quantity -->
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
};

// Call the generateShop function to display the shop items
generateShop();

// Function to increment the quantity of an item in the basket
let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem);

  if (search === undefined) {
    basket.push({
      id: selectedItem,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  update(selectedItem); // Update the quantity displayed
  localStorage.setItem("data", JSON.stringify(basket)); // Save the updated basket to localStorage
};

// Function to decrement the quantity of an item in the basket
let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem);

  if (search === undefined) return; // Item not found
  else if (search.item === 0) return; // Prevent decrementing below 0
  else {
    search.item -= 1;
  }
  update(selectedItem); // Update the quantity displayed
  basket = basket.filter((x) => x.item !== 0); // Remove items with quantity 0 from the basket
  localStorage.setItem("data", JSON.stringify(basket)); // Save the updated basket to localStorage
};

// Function to update the quantity displayed for an item and recalculate the cart total
let update = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item; // Update the quantity display
  calculation(); // Update the total number of items in the cart
};

// Function to calculate and update the total number of items in the cart
let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0); // Sum up quantities
};

// Initial call to update the cart icon
calculation();

// Function to display the product details in a modal
let showProductDetails = (id) => {
  let selectedItem = shopItemsData.find((x) => x.id === id); // Find the selected item
  let modal = document.getElementById("productModal"); // Get modal element
  let modalContent = document.getElementById("modalDetails"); // Get modal content element
  
  modalContent.innerHTML = `
    <img width="220" src=${selectedItem.img} alt="">
    <h3>${selectedItem.name}</h3>
    <p>${selectedItem.desc}</p>
    <h2>$ ${selectedItem.price} </h2>
  `;
  modal.style.display = "block"; // Show the modal
};

// Function to close the modal
let closeModal = () => {
  let modal = document.getElementById("productModal");
  modal.style.display = "none"; // Hide the modal
};

// Attach the close modal function to the close button
document.getElementsByClassName("close")[0].onclick = closeModal;

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
  let modal = document.getElementById("productModal");
  if (event.target === modal) {
    closeModal();
  }
};
