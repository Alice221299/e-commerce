///Variables + capture inputs
const url = "https://products-server-production.up.railway.app/"

let productsContainer = document.getElementById ('products-info');
const form = document.querySelector(".product-form")
const productUrl = "https://products-server-production.up.railway.app/products"
const inputName = document.querySelector ("#name");
const inputImage = document.querySelector ("#image");
const inputCategory = document.querySelector ("#category");
const inputVolume = document.querySelector ("#volume");
const inputCompany = document.querySelector ("#company");
const inputPrice = document.querySelector ("#price");
const inputOld = document.querySelector ("#old_price");

///Get products from server and print
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

const printAll = (array, container) => {
    container.innerHTML = '';
    array.forEach(item => {
        let discount = (item.old_price - item.price).toFixed(2);
        container.innerHTML += `
        <div class="cart-item">
                <figure class="cart-item-picture">
                    <img src="${item.image}" alt="${item.name}">
                </figure>
                <div>
                <h3>${item.name}</h3>
                <p class="title">Category: ${item.category}</p>
                </div>
                <div class="item-about">
                    <p>Sold by: <span>${item.company}</span></p>
                    <p>Quantity: <span>${item.amount}</span></p>
                </div>
                <div class="item-prices">
                    <p class="title">Price</p>
                    <p>$${item.price}</p>
                    <p class="save">Discount: <span>$${discount}</span></p>
                </div>
                <div class="item-actions">
                    <p class="title">Action</p>
                    <p id="save" class="edit" data-id="${item.id}">Edit</p>
                    <p id="remove" class="remove" data-id="${item.id}">Delete</p>
                </div>
            </div>  `  })}

document.addEventListener("DOMContentLoaded", async () => {
    products = await getProducts(url);
    printAll (products, productsContainer);
    getElements ();
})

///Function for submit

let isEdit = false;
let idProductEdit;

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputName.value || !inputImage.value || !inputCategory.value || !inputVolume.value || !inputCompany.value || !inputPrice.value || !inputOld.value) {
        alert("Some inputs are empty");
        return;
    }
    const newProduct = {
        name: inputName.value,
        image: inputImage.value,
        category: inputCategory.value,
        amount: inputVolume.value,
        company: inputCompany.value,
        price: inputPrice.value,
        old_price: inputOld.value,
    }

    if (isEdit) {
        const response = await updateProduct(newProduct);
        if(response.status === 200) {
            showNotification("Product updated");
        }
        else {
            alert('There was an error')
        }
    }
    else {
        const response = await saveProduct (newProduct);
    if (response.status === 201) {
        showNotification("Product saved");
    }
    else {
        alert("There was an error")
    }
    }
   
    form.reset();

    products = await getProducts(url)
    printAll (products, productsContainer);
}

const updateProduct = async(product) => {
    try {
        const response = await fetch(`${productUrl}/${idProductEdit}`, {
            method: 'PATCH',
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


const saveProduct = async (product) => {
    isEdit = false;
    try {const response = await fetch(productUrl, {
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

const handleDelete = async (id) => {
    const response = await fetch(`${productUrl}/${id}`, {
        method: 'DELETE',
    });
    if (response.status === 200) {
        showNotification("Product deleted")
    }
    else {
        alert('There was an error')
    }
    products = await getProducts(url)
    printAll (products, productsContainer);
}

const handleEdit = async (id) => {
    isEdit = true;
    idProductEdit = id;
    const response = await fetch(`${productUrl}/${id}`);
    const product = await response.json();
    inputName.value = product.name;
    inputImage.value = product.image;
    inputCategory.value = product.category;
    inputVolume.value = product.amount;
    inputCompany.value = product.company;
    inputPrice.value = product.price;
    inputOld.value = product.old_price;
}

const getElements = () => {
    const deleteEl = document.querySelectorAll('.remove');

    const editEl = document.querySelectorAll('.edit');
    deleteEl.forEach(el => {
        const id = el.getAttribute('data-id')
        el.addEventListener('click', () => {
            handleDelete(id)
        })
    })

    editEl.forEach(el => {
        const id = el.getAttribute('data-id')
        el.addEventListener('click', () => {
            handleEdit(id)
        })
    })
}


form.addEventListener("submit", async (e) => {
    handleSubmit(e)
    products = await getProducts(url)
    printAll (products, productsContainer);
});




///Load purchases 
let purchasesContainer = document.getElementById ('purchases');

let bought = []

const getPurchases = async (url) => {
    try {
        const endpoint = "bought";
        const resp = await fetch (`${url}${endpoint}`);
        const response = await resp.json();

        return response;
    }
    catch (error) {
        console.log(error);
        return [];
    }
}

const printPurchases = (array, container) => {
    container.innerHTML = '';
    array.forEach(item => {
        productNames = item.purchasedProducts.map(item => `${item.name} - ${item.amount}`);
        container.innerHTML += `
        <div class="cart-item purchase-item">
            <div class="purchase-info">
                <h3>Client information</h3>
                <p>Name: ${item.clientName}</p>
                <p>Direction: ${item.clientDirection}</p>
                <p>Phone: ${item.clientPhone}</p>
            </div>
            <div class="purchase-info">
                <h3>Purchase information</h3>
                <p>Total: $${item.totalOfPurchase}</p>
                <p>Date: ${item.dateOfPurchase}</p>
                <p>Product names: ${productNames}</p>
            </div>
            </div>  `  })}

document.addEventListener("DOMContentLoaded", async () => {
    bought = await getPurchases(url);
    printPurchases (bought, purchasesContainer);
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