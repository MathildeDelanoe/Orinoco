let prices = [];
let emptyFormParts = [false, false, false, false, false];

//Fonction pour afficher le panier
function showBasket()
{
    let container = document.getElementsByClassName("container-fluid");

    let objectsFromBasket = JSON.parse(localStorage.getItem("object"));
    // if ((objectsFromBasket == null) || ((objectsFromBasket != null) && (objectsFromBasket.length === 0)))
    if ((objectsFromBasket == null) || (objectsFromBasket.length === 0))
    {
        let emptyBasket = document.createElement("h2");
        emptyBasket.innerHTML = "Votre panier est vide";
        container[0].appendChild(emptyBasket); // Afficher le message de panier vide dans le premier container de la page
        container[1].setAttribute("style", "display:none"); // Le deuxieme container de la page contient le formulaire qui n'est pas affiché dans ce cas
        emptyBasket.classList.add("font-weight-bold","text-center",'mt-5');
    }
    else
    {
        // Dans ce cas, le tableau d'objets n'est pas vide dans le localStorage
        for (let product of objectsFromBasket)
        {
            let row = document.createElement("div");
            row.classList.add("row","border-bottom","border-secondary","align-items-center","px-2");
            let firstColumn = document.createElement("div");
            firstColumn.classList.add("col","text-center");

            let productLink = document.createElement("a");
            productLink.setAttribute("href", "produit.html?id=" + product.id);
            let image = document.createElement("img");
            image.setAttribute("src", product.image);
            image.setAttribute("alt", "Picture of " + product.name);
            container[0].appendChild(row);
            row.appendChild(firstColumn);
            productLink.appendChild(image);
            firstColumn.appendChild(productLink);

            let secondColumn = document.createElement("div");
            secondColumn.classList.add("col","position-relative");
            let name = document.createElement("h3");
            name.innerHTML = product.name;
            name.classList.add("font-weight-bold");
            name.setAttribute("style", "font-size:1.2em");
            let selection = document.createElement("p");
            selection.innerHTML = "Couleur : " + product.selection;
            let quantity = document.createElement("input");
            quantity.setAttribute("type", "number");
            quantity.setAttribute("min", "1");
            quantity.setAttribute("value", product.quantity);
            quantity.setAttribute("style", "width:5em");
            let price = document.createElement("p");
            price.classList.add("price", "text-right","font-weight-bold");
            let productPrice = (product.quantity * product.price);
            price.innerHTML = priceToEuros(productPrice);
            prices.push(productPrice);
            let deleteCross = document.createElement("i");
            deleteCross.classList.add("fa","fa-times","position-absolute");
            deleteCross.setAttribute("style", "top:5px; right:0px;cursor:pointer");
            deleteCross.setAttribute("title","Supprimer l'article");
            row.appendChild(secondColumn);
            secondColumn.appendChild(name);
            secondColumn.appendChild(selection);
            secondColumn.appendChild(quantity);
            secondColumn.appendChild(price);
            secondColumn.appendChild(deleteCross);
        }

        let total = document.createElement("div");
        total.classList.add("row");
        let firstColumn = document.createElement("div");
        firstColumn.classList.add("col","col-8");
        let secondColumn = document.createElement("div");
        secondColumn.classList.add("col","col-4");

        container[0].appendChild(total);
        total.appendChild(firstColumn);
        total.appendChild(secondColumn);

        let lineTotal = document.createElement("p");
        lineTotal.innerHTML = "Prix total de la commande : " ;
        lineTotal.classList.add("font-weight-bold");
        lineTotal.setAttribute("style", "font-size:1.1em");
        let totalPrice = document.createElement("p");
        totalPrice.innerHTML = priceToEuros(calculateTotalAmount(prices));
        totalPrice.classList.add("totalPrice", "font-weight-bold","text-right");
        totalPrice.setAttribute("style", "font-size:1.1em");

        firstColumn.appendChild(lineTotal);
        secondColumn.appendChild(totalPrice);
    }
}

// Fonction qui met a jour la quantite du produit dans le panier (localStorage)
function updateBasketWithQuantity(indexObject, newQuantity)
{
    let objectsFromBasket = JSON.parse(localStorage.getItem("object"));
    if (objectsFromBasket != null)
    {
        objectsFromBasket[indexObject].quantity = newQuantity;
        localStorage.setItem("object", JSON.stringify(objectsFromBasket));
        printBasketInfo();
    }
}

function isValidData(data, errorMessage, index)
{
    return new Promise(function(resolve, reject)
    {
        if(data.checkValidity())
        {
            let divError = document.getElementById("errorMessage" + index.toString());
            if (divError != null)
            {
                let input = document.querySelectorAll("#formulaire input");
                input[index].setAttribute("style", "box-shadow:none");
                let tdLastChild = document.querySelectorAll("td:last-child");
                tdLastChild[index].removeChild(divError);
            }
            resolve(true);
        }
        else
        {
            // Ici la donnée n'est pas valide mais a pu être éditée au moins une fois ou 0
            if (emptyFormParts[index])
            {
                // Ici la donnée a été éditée au moins une fois
                let tdLastChild = document.querySelectorAll("td:last-child");
                let input = document.querySelectorAll("#formulaire input");
                input[index].setAttribute("style", "box-shadow:0 0 5px red");
                let divError = document.getElementById("errorMessage" + index.toString());
                if (divError === null) // Aucun message n'a déjà été créé
                {
                    let divError = document.createElement("div");
                    divError.setAttribute("id", "errorMessage" + index.toString());
                    let styleString = "position: absolute; color: red; bottom: 0px; left: 0px;";
                    divError.setAttribute("style", styleString);
                    divError.innerHTML = errorMessage;
                    tdLastChild[index].appendChild(divError);
                }
            }
            reject(errorMessage);
        }
    });
}

function activateSubmitButton(formInputs)
{
    Promise.all([isValidData(formInputs[0], "Prénom incorrect", 0),
                 isValidData(formInputs[1], "Nom incorrect", 1),
                 isValidData(formInputs[2], "Adresse incorrecte", 2),
                 isValidData(formInputs[3], "Ville incorrecte", 3),
                 isValidData(formInputs[4], "Email incorrect", 4)])
    .then(function()
        {
            submitButton.disabled = false;
        })
    .catch(function(error)
        {
            submitButton.disabled = true;
        });
}

// Appel de la fonction qui place un cercle au dessus du panier avec le nombre d'éléments a l'ouverture de la page
printBasketInfo();

// Appel la fonction qui affiche le panier
showBasket();

// Gestion de la quantité de produits et mise à jour du prix
let quantityButtons = document.querySelectorAll("#panier_recap input");
for (let index = 0; index < quantityButtons.length; index++)
{
    quantityButtons[index].addEventListener("change", function(event)
    {
        let objectsFromBasket = JSON.parse(localStorage.getItem("object"));
        let object = objectsFromBasket[index];
        // Changement du prix du produit
        let currentPrice = document.querySelectorAll("p.price");
        let newPrice = (object.price * event.target.value);
        currentPrice[index].innerHTML = priceToEuros(newPrice);
        // Changement du prix total de la commande
        prices[index] = newPrice;
        let totalPrice = document.getElementsByClassName("totalPrice");
        totalPrice[0].innerHTML = priceToEuros(calculateTotalAmount(prices));
        // Mise à jour de la quantité dans le local storage
        updateBasketWithQuantity(index, Number(event.target.value));
    })
}

// Formulaire
let formInputs = document.querySelectorAll("#formulaire input");
for (let index = 0; index < formInputs.length; index++) // Maybe length-1 to not consider the submit type
{
    formInputs[index].addEventListener('change', function(){
        if (!emptyFormParts[index])
        {
            emptyFormParts[index] = true;
        }
        activateSubmitButton(formInputs);
        });
}

// Gestion du clic sur le bouton "Envoyer"
let submitButton = document.getElementById("submitButton");
submitButton.addEventListener('click', function()
{
    let contact = {
        firstName : formInputs[0].value,
        lastName : formInputs[1].value,
        address : formInputs[2].value,
        city : formInputs[3].value,
        email : formInputs[4].value
    };
    localStorage.setItem("personalData", JSON.stringify(contact));
    window.location = 'confirmation.html';
});

// Gestion de la suppression d'un article au panier
let deleteArticle = document.getElementsByClassName("fa-times");
let container = document.getElementsByClassName("container-fluid");
for (let index = 0; index < deleteArticle.length; index++)
{
    deleteArticle[index].addEventListener("click", function(event)
    {
        let objectsFromBasket = JSON.parse(localStorage.getItem("object"));
        objectsFromBasket.splice(index, 1); // Supprime un élément du tableau a partir de l'index "index"
        localStorage.setItem("object", JSON.stringify(objectsFromBasket));
        window.location = "panier.html";
    })
}
