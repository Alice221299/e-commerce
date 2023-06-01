///Get values from inputs
const url = "https://products-server-production.up.railway.app/"

const form = document.querySelector(".form__container")

form.addEventListener("submit", (e) => {
    handleSubmit(e)
});

const inputName = document.querySelector ("#nombre");
const inputDirection = document.querySelector ("#direccion");
const inputPhone = document.querySelector ("#telefono");
const totalPrice = JSON.parse(sessionStorage.getItem("total"));
const date = JSON.parse(sessionStorage.getItem("date"));
const boughtPr = JSON.parse(sessionStorage.getItem("products"));

///Send new object to array of bought

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputName.value || !inputDirection.value || !inputPhone.value ) {
        alert("Some inputs are empty");
        return;
    }
    const newPurchase = {
        clientName: inputName.value,
        clientDirection: inputDirection.value,
        clientPhone: inputPhone.value,
        totalOfPurchase: totalPrice,
        dateOfPurchase: date,
        purchasedProducts: boughtPr
    }

    const response = await savePurchase (newPurchase);
    if (response.status === 201) {
        showNotification("Purchase saved");
    }
    else {
        alert("There was an error")
    }
    clearCart()
    location = "../html/thank-you.html"
    }
   
    form.reset();

    const savePurchase = async (purchase) => {
        try {
            const endpoint = 'bought'
            const response = await fetch(`${url}${endpoint}`, {
            method: 'POST', 
            body: JSON.stringify(purchase),
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

const handleDelete = async (id) => {
    const endpoint = "inCart"
    const response = await fetch(`${url}${endpoint}/${id}`, {
        method: 'DELETE',
    });
    if (response.status === 200) {
        console.log("Product deleted");
    }
    else {
        console.log("Error");
    }
}
const clearCart = async () =>{
    inCart = await getCart(url)
        const ids = inCart.map ((item) => item.id);
        ids.forEach((id) => handleDelete(id))
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