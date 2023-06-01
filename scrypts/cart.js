///Get and print products in the cart
const url = "https://products-server-production.up.railway.app/"

let inCart = []

const getCart = async (url) => {
    try {
        const endpoint = "inCart";
        const resp = await fetch (`${url}${endpoint}`);
        const response = await resp.json();

        return response;
    }
    catch (error) {
        console.log(error);
        return [];
    }
}

let cartContainer = document.getElementById ('cart-container');

const printCart = (array, container) => {
    container.innerHTML = ""
    array.forEach(item => {
        
        let discount = (item.old_price - item.price).toFixed(2);
        container.innerHTML += `
        <div class="cart-item">
                <figure class="cart-item-picture">
                    <img src="${item.image}" alt="${item.name}">
                </figure>
                <div class="item-about">
                    <h3>${item.name}</h3>
                    <p>Sold by: <span>${item.company}</span></p>
                    <p>Quantity: <span>${item.amount}</span></p>
                </div>
                <div class="item-prices">
                    <p class="title">Price</p>
                    <p data-price="${item.price}">$${item.price} <span class="crossed">${item.old_price}</span></p>
                    <p class="save">You save: <span>$${discount}</span></p>
                </div>
                <div class="item-quantity">
                    <p class="title">Quantity</p>
                    <div class="counter">
                        <span class="action" id="less">-</span>
                        <p>1</p>
                        <span class="action" id="more">+</span>
                    </div>
                </div>
                <div class="item-total">
                    <p class="title">Total</p>
                    <span>$${item.price}</span>
                </div>
                <div class="item-actions">
                    <p class="title">Action</p>
                    <p class="for-later" item_id="${item.id}"id="save">Save for later</p>
                    <p class="remove" data-id="${item.id}" id="remove">Remove</p>
                </div>
            </div>  `  })}

///Counter and subtotal
    const updatePrice = (quantity, price, totalElement) => {
    const totalPrice = quantity * price;
    totalElement.textContent = `$${totalPrice.toFixed(2)}`;
  };


document.addEventListener("DOMContentLoaded", async () => {
    inCart = await getCart(url);
    printCart(inCart, cartContainer);

    
    const cartItems = document.querySelectorAll(".cart-item");
    cartItems.forEach((cartItem) => {
      const counter = cartItem.querySelector(".counter");
      const lessBtn = counter.querySelector("#less");
      const moreBtn = counter.querySelector("#more");
      const quantityDisplay = counter.querySelector("p");
      const itemTotal = cartItem.querySelector(".item-total span");
      const itemPrice = parseFloat(itemTotal.textContent.slice(1));
      const itemProductPrice = parseInt(itemTotal.getAttribute("data-price"))
      lessBtn.addEventListener("click", () => {
        let quantity = parseInt(quantityDisplay.textContent);
        if (quantity > 1) {
          quantity -= 1;
          quantityDisplay.textContent = quantity;
          itemTotal.textContent = itemProductPrice * quantity;
          updatePrice(quantity, itemPrice, itemTotal);
          calculateSubtotal();
        }
      });
  
      moreBtn.addEventListener("click", () => {
        let quantity = parseInt(quantityDisplay.textContent);
        quantity += 1;
        quantityDisplay.textContent = quantity;
        itemTotal.textContent = itemProductPrice * quantity;
        updatePrice(quantity, itemPrice, itemTotal);
        calculateSubtotal();
      });
    });
  });

  const calculateSubtotal = () => {
    const itemTotalElements = document.querySelectorAll(".item-total span");
    let subtotal = 0;
    itemTotalElements.forEach((element) => {
      const price = parseFloat(element.textContent.slice(1));
      subtotal += price;
    });
  
    const shipping = 5; 
  
    const subtotalElement = document.querySelector(".subtotal");
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  
    const totalElement = document.querySelector(".card-value-total");
    const total = subtotal + shipping;
    const totalEnd = total.toFixed(2)
    totalElement.textContent = `$${totalEnd}`;
    sessionStorage.setItem("total", JSON.stringify(totalEnd));
    sessionStorage.setItem("date", JSON.stringify(new Date().toISOString().split('T')[0]))
    let productsInfo = [];
      inCart.forEach((item, index) => {
        const quantity = Number(itemTotalElements[index].textContent.slice(1))/Number(item.price)
        let product = {
            name: item.name,
            amount: quantity
             
        } 
        console.log(quantity);
        productsInfo.push(product)})
    sessionStorage.setItem("products", JSON.stringify(productsInfo))

  };



///Buttons redirection

let sendToFav = document.getElementById ("toFavorites");

sendToFav.addEventListener ("click", () => {
    location.href = "../html/favorites.html"
})

let sendToCart = document.getElementById ("toCart");

sendToCart.addEventListener ("click", () => {
    location.href = "../html/cart.html"
})

let sendToAdmin = document.getElementById ("toAdmin");

sendToAdmin.addEventListener ("click", () => {
    location.href = "../html/admin-enter.html"
})

let sendForward = document.getElementById ("proceed");

sendForward.addEventListener ("click", () => {
    location.href = "../html/form-buy.html"
})

let sendBack = document.getElementById ("return");

sendBack.addEventListener ("click", () => {
    location.href = "../html/index.html"
})

///Button delete

document.addEventListener ("click", (e)=> {
    if (e.target.classList.contains("remove")){
        let id = e.target.getAttribute("data-id");
        handleDelete(id)
    }
});


const handleDelete = async (id) => {
    const endpoint = "inCart"
    const response = await fetch(`${url}${endpoint}/${id}`, {
        method: 'DELETE',
    });
    if (response.status === 200) {
        showNotification("Product deleted");
    }
    else {
        alert('An error ocured')
    }
    inCart = await getCart(url)
    printCart (inCart, cartContainer)
}

///Button save for later

const productUrl = "https://products-server-production.up.railway.app/products";


document.addEventListener ("click", (e)=> {
    if (e.target.classList.contains("for-later")){
        let id = e.target.getAttribute("item_id");
        handleSaveFav(id)
        handleDelete(id)
    }
});

const handleSaveFav = async (id) => {
    const response = await fetch(`${productUrl}/${id}`);
    const product = await response.json();
    const resp = await saveToFav(product);
    if (resp.status === 201) {
        showNotification("Product saved to favorites");
    }
    else {
        alert("There was an error")
    }
}

const saveToFav = async (product) => {
    try {const end = "favorites";
        const response = await fetch(`${url}${end}`, {
        method: 'POST', 
        body: JSON.stringify(product),
        headers: {
            "Content-type": "application/json"
        }
    })
    return response;}
    
    catch (error) {
        console.log(error);
        return error;
    }
}

// notification mensaje
function showNotification(message) {
    const notification = document.querySelector(".notification");
    notification.textContent = message;
    notification.classList.add("show");
  
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }