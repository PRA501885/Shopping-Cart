// Get references to HTML elements
let label = document.getElementById("label"); // Label to display total amount and cart status
let ShoppingCart = document.getElementById("shopping-cart"); // Container for cart items

// Retrieve the basket data from localStorage or initialize an empty array if none exists
let basket = JSON.parse(localStorage.getItem("data")) || [];

// Function to calculate and update the cart icon with the total number of items
let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

// Initial call to update the cart icon
calculation();

// Function to generate HTML for cart items and update the ShoppingCart container
let generateCartItems = () => {
    if (basket.length !== 0) {
        // If the basket is not empty, create HTML for each item in the cart
        ShoppingCart.innerHTML = basket
            .map((x) => {
                let { id, item } = x;
                let search = shopItemsData.find((y) => y.id === id) || [];
                return `
                    <div class="cart-item">
                        <img width="100" src=${search.img} alt="" />
                        <div class="details">
                            <div class="title-price-x">
                                <h4 class="title-price">
                                    <p>${search.name}</p>
                                    <p class="cart-item-price">$ ${search.price}</p>
                                </h4>
                                <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
                            </div>
                            <div class="buttons">
                                <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                                <div id=${id} class="quantity">${item}</div>
                                <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                            </div>
                            <h3>$ ${item * search.price}</h3>
                        </div>
                    </div>
                `;
            })
            .join("");
    } else {
        // If the basket is empty, display a message and a button to return to the home page
        ShoppingCart.innerHTML = ``;
        label.innerHTML = `
            <h2>Cart is Empty</h2>
            <a href="index.html">
                <button class="HomeBtn">Back to home</button>
            </a>
        `;
    }
};

// Initial call to generate cart items
generateCartItems();

// Function to increment the quantity of an item in the basket
let increment = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);

    if (search === undefined) {
        // If the item is not in the basket, add it with a quantity of 1
        basket.push({
            id: selectedItem.id,
            item: 1,
        });
    } else {
        // If the item is already in the basket, increase its quantity by 1
        search.item += 1;
    }

    generateCartItems();
    update(selectedItem.id);
    localStorage.setItem("data", JSON.stringify(basket));
};

// Function to decrement the quantity of an item in the basket
let decrement = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);

    if (search === undefined) return;
    else if (search.item === 0) return;
    else {
        // Decrease the item's quantity by 1
        search.item -= 1;
    }
    update(selectedItem.id);
    basket = basket.filter((x) => x.item !== 0); // Remove the item if its quantity is 0
    generateCartItems();
    localStorage.setItem("data", JSON.stringify(basket));
};

// Function to update the quantity of an item and recalculate totals
let update = (id) => {
    let search = basket.find((x) => x.id === id);
    document.getElementById(id).innerHTML = search.item;
    calculation();
    TotalAmount();
};

// Function to remove an item from the basket
let removeItem = (id) => {
    let selectedItem = id;
    basket = basket.filter((x) => x.id !== selectedItem.id);
    generateCartItems();
    TotalAmount();
    localStorage.setItem("data", JSON.stringify(basket));
};

// Function to clear all items from the basket
let clearCart = () => {
    basket = [];
    generateCartItems();
    localStorage.setItem("data", JSON.stringify(basket));
};

// Function to calculate and display the total amount in the basket
let TotalAmount = () => {
    if (basket.length !== 0) {
        let amount = basket
            .map((x) => {
                let { item, id } = x;
                let search = shopItemsData.find((y) => y.id === id) || [];
                return item * search.price;
            })
            .reduce((x, y) => x + y, 0);
        label.innerHTML = `
            <h2>Total Bill : $ ${amount}</h2>
            <button class="checkout">Checkout</button>
            <button onclick="clearCart()" class="removeAll">Clear Cart</button>
        `;
    } else return;
};

// Initial call to calculate and display the total amount
TotalAmount();
