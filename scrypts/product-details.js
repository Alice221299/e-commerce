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

///Get and print the product

const URL_API = "https://products-server-production.up.railway.app/";
const endPoint = "products";


const getProduct = async(id) => {
    try {
        const url = `${URL_API}${endPoint}/${id}`;
        const resp = await fetch(url);
        const response = await resp.json();
        return response
        
    } catch (error) {
        console.log(error);
        return {};
    }
}

let productCont = document.querySelector(".product")

const printProduct = (item, container) => {
    container.innerHTML = `
    <figure class="product-picture">
            <img src="${item.image}" alt="${item.name}">
            <div class="product-action">
                <figure class="go_back">
                    <img src="../icons/close.svg" alt="Icon for close">
                </figure>
            </div>
        </figure>
        <p>${item.category}</p>
        <h3>${item.name}</h3>
        <p>${item.amount}</p>
        <div class="prices">
            <span>$${item.price}</span>
            <p>${item.old_price}</p>
        </div>
        <button>
            Add
            <span class="add" id="button-add">+</span>
        </button>
    `
}

const idProduct = JSON.parse(sessionStorage.getItem("itemDetails"));

document.addEventListener("DOMContentLoaded", async () => {
    const item = await getProduct(idProduct);
    printProduct(item, productCont)
});


document.addEventListener ("click", (event) => {
    if (event.target.classList.contains("go_back")) {
        location.href = "../html/index.html"}})

/////Send to cart

const productUrl = "https://products-server-production.up.railway.app/products";

document.addEventListener ("click", (e)=> {
    if (e.target.classList.contains("add")){;
        handleSaveCart(idProduct)
    }
});

const handleSaveCart = async (id) => {
    const response = await fetch(`${productUrl}/${id}`);
    const product = await response.json();
    const resp = await saveToCart(product);
    if (resp.status === 201) {
        showNotification("Product saved to cart");
    }
    else {
        alert("There was an error")
    }
}

const saveToCart = async (product) => {
    try {const end = "inCart"
        const response = await fetch(`${URL_API}${end}`, {
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