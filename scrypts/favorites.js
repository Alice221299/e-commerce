///Get and print favorites
const url = "https://products-server-production.up.railway.app/"

let favorites = []

const getFavorites = async (url) => {
    try {
        const endpoint = "favorites";
        const resp = await fetch (`${url}${endpoint}`);
        const response = await resp.json();

        return response;
    }
    catch (error) {
        console.log(error);
        return [];
    }
}

let favoriteContainer = document.getElementById ('container');

const printFavorites = (array, container) => {
    container.innerHTML = ""
    array.forEach(item => {
        container.innerHTML += `
        <div class="product">
        <figure class="product-picture">
            <img src="${item.image}" alt="${item.name}">
            <div class="product-action">
                <figure class="remove" data-id="${item.id}">
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
            <span class="add" add_id="${item.id}" id="button-add">+</span>
        </button>
    </div>  `  })}

    document.addEventListener("DOMContentLoaded", async () => {
        favorites = await getFavorites(url);
        printFavorites (favorites, favoriteContainer);
    })

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


///Delete from favorites

document.addEventListener ("click", (e)=> {
    if (e.target.classList.contains("remove")){
        let id = e.target.getAttribute("data-id");
        handleDelete(id)
    }
});


const handleDelete = async (id) => {
    const endpoint = "favorites"
    const response = await fetch(`${url}${endpoint}/${id}`, {
        method: 'DELETE',
    });
    if (response.status === 200) {
        showNotification("Product deleted");
    }
    else {
        alert('There was an error')
    }
    
    favorites = await getFavorites(url)
    printFavorites (favorites, favoriteContainer)
}

//Send to cart

const productUrl = "https://products-server-production.up.railway.app/products";

document.addEventListener ("click", (e)=> {
    if (e.target.classList.contains("add")){
        let id = e.target.getAttribute("add_id");
        handleSaveCart(id)
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