///Get and print products
const url = "https://products-server-production.up.railway.app/"

let products = []

const getProducts = async (url) => {
    try {
        const endpoint = "products";
        const resp = await fetch (`${url}${endpoint}`);
        const response = await resp.json();

        return response;
    }
    catch (error) {
        console.log(error);
        return [];
    }
}

let cardContainer = document.querySelector ('.table-cards');

const printProducts = (array, container) => {
    container.innerHTML = ""
    array.forEach(item => {

    const card = document.createElement('div');

    card.classList.add ('card');

    card.innerHTML = `
        <figure class="card-picture">
            <img src="${item.image}" alt="${item.name}">
            <div class="card-actions">
                <figure name=${item.id} class="go-details" id="details">
                    <img src="../icons/see.svg" alt="Icon for see the details">
                </figure>
                <figure>
                    <img src="../icons/reuse.svg" alt="Icon for reuse">
                </figure>
                <figure item_id=${item.id} class="to-favorites" id="favorites">
                    <img src="../icons/favorites.svg" alt="Icon for add to favorites">
                </figure>
            </div>
        </figure>
        <h3>${item.name}</h3>
        <div class="prices">
            <span>$${item.price}</span>
            <p>${item.old_price}</p>
        </div>
        <div class="status">
            <span class="raiting"></span>
            <p>In stock</p>
        </div>
        <button>
            Add
            <span add_id="${item.id}" class="add" id="button-add">+</span>
        </button>
    `
    container.appendChild(card)
})
}

let random = [];

function randProd(arr) {

    for (let i = 0; i < 6; i++) {
        let rand = arr[Math.floor(Math.random() * 40)];
        random.push(rand);
    }
    return random;
}

document.addEventListener("DOMContentLoaded", async () => {
    products = await getProducts(url);
    randProd(products);
    printProducts (random, cardContainer);
    updateEmptyCartMessage()
})

///Buttons redirectioning

let sendToFav = document.getElementById ("toFavorites");

sendToFav.addEventListener ("click", () => {
    location.href = "../html/favorites.html"
})

let sendToAdmin = document.getElementById ("toAdmin");

sendToAdmin.addEventListener ("click", () => {
    location.href = "../html/admin-enter.html"
})


document.addEventListener ("click", (event) => {
    if (event.target.classList.contains("go-details")) {
        let id = event.target.getAttribute("name");
        sessionStorage.setItem("itemDetails", JSON.stringify(id));
        location.href = "../html/product-details.html"
    }

})



let sendToCart = document.getElementById ("openCart");

sendToCart.addEventListener ("click", () => {
    location.href = "../html/cart.html"
})

let sendToForm = document.getElementById ("openForm");

sendToForm.addEventListener ("click", () => {
    location.href = "../html/form-buy.html"
})

/////Send to favorites

const productUrl = "https://products-server-production.up.railway.app/products";


document.addEventListener ("click", (e)=> {
    if (e.target.classList.contains("to-favorites")){
        let id = e.target.getAttribute("item_id");
        handleSaveFav(id)
    }
});

const handleSaveFav = async (id) => {
    const response = await fetch(`${productUrl}/${id}`);
    const product = await response.json();
    const resp = await saveToFav(product);
    if (resp.status === 201) {
        showNotification("Product added to favorites")
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

/////Send to cart

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
        showNotification("Product added to cart")
        updateEmptyCartMessage()
    }
    else {
        showNotification("Product already in cart")
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
    return response;
}
    
    catch (error) {
        console.log(error);
        return error;
    }
}

///See small cart

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

let cartContainer = document.querySelector ('.small-cart-container');

const printInCart = (array, container) => {
    container.innerHTML = ''
    array.forEach(item => {
    container.innerHTML += `
    <div class="product-in-cart">
        <figure class="cart-picture img">
            <img src="${item.image}" alt="${item.name}">
        </figure>
        <div class="info">
            <h3>${item.name}</h3>
            <p>1 x $${item.price}</p>
        </div>
        <span class="remove" data-id="${item.id}" id="delete">x</span>
    </div>
    `
})
}

let seeCart = document.querySelector(".cart");
let openCart = document.querySelector(".see-cart")

seeCart.addEventListener("click", async () => {
    openCart.classList.toggle('inactive');
    inCart = await getCart(url);
    printInCart (inCart, cartContainer)
    calculateTotal()
    updateEmptyCartMessage()
})

const updateEmptyCartMessage = async () => {
    const emptyCartMessage = document.getElementById("cart__notification");
  
    try {
      const inCart = await getCart(url);
  
      if (inCart.length === 0) {
        emptyCartMessage.style.display = "none";
      } else {
        emptyCartMessage.style.display = "block";
        emptyCartMessage.textContent = `${inCart.length}`;
      }
    } catch (error) {
      console.log(error);
    }
  };

///Delete from small cart


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
        showNotification('Product deleted')
        updateEmptyCartMessage()
        calculateTotal()
    }
    else {
        alert('There was an error')
    }
    
    inCart = await getCart(url)
    printInCart (inCart, cartContainer)
    calculateTotal()
}


//total small cart.
const calculateTotal = () => {
    
    let total = 0;
    inCart.forEach((element) => {
      const price = parseFloat(element.price);
      total += price;
      console.log(total);
    });
    const totalvalue = document.querySelector(".total h3");
    totalvalue.textContent = `$${total.toFixed(2)}`;
  };

///See categories mobile

let seeCategories = document.querySelector(".button-mobile-category");
let openList = document.querySelector(".mobile-categories")

seeCategories.addEventListener("click", () => {
    openList.classList.toggle('closed');
})




const filterCat = document.querySelectorAll('.list-category');

const filterByCat = (list, category) => {
    const found = list.filter(item => item.category === category)
    return found
}

filterCat.forEach((cat) => {
    cat.addEventListener('click', () => {
        const categoryPr = cat.id;
        const filter = filterByCat(products, categoryPr);
        printProducts (filter, cardContainer)
    })
})

// notification mensaje
function showNotification(message) {
    const notification = document.querySelector(".notification");
    notification.textContent = message;
    notification.classList.add("show");
  
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000); 
  }