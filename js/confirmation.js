// Affiche un récapitulatif du panier
function printBasketSummary(response)
{
    let section = document.getElementsByTagName("section");
    let table = document.createElement("table");
    table.setAttribute("style", "width:40%");
    table.classList.add("mx-auto","mb-5");
    let title = document.createElement("caption");
    title.innerHTML = "Récapitulatif : ";
    title.setAttribute("style", "caption-side:top; font-size:1.5em");
    title.classList.add("text-dark","font-weight-bold");
    let thead = document.createElement("thead");
    let lineTitle = document.createElement("tr");
    let nameHeader = document.createElement("th");
    nameHeader.innerHTML = "Nom du produit";
    nameHeader.classList.add("border","border-dark","text-center");
    let colorHeader = document.createElement("th");
    colorHeader.innerHTML = "Couleur";
    colorHeader.classList.add("border","border-dark","text-center");
    let quantityHeader = document.createElement("th");
    quantityHeader.innerHTML = "Quantité";
    quantityHeader.classList.add("border","border-dark","text-center");
    let priceHeader = document.createElement("th");
    priceHeader.innerHTML = "Prix";
    priceHeader.classList.add("border","border-dark","text-center");
    let tfoot = document.createElement("tfoot");
    let totalPriceLine = document.createElement("tr");
    let totalPriceDescription = document.createElement("th");
    totalPriceDescription.innerHTML = "Prix total : ";
    totalPriceDescription.classList.add("text-right");
    totalPriceDescription.setAttribute("colspan", "3");
    let totalPriceAmount = document.createElement("th");
    totalPriceAmount.classList.add("text-center");
    let tbody = document.createElement("tbody");

    let amounts = [];

    let objectsFromBasket = JSON.parse(localStorage.getItem("object"));
    for (let product of objectsFromBasket)
    {
        let line = document.createElement("tr");
        let colName = document.createElement("td");
        colName.classList.add("border","border-dark");
        colName.innerHTML = product.name;
        let colColor = document.createElement("td");
        colColor.classList.add("border","border-dark");
        colColor.innerHTML = product.selection;
        let colQuantity = document.createElement("td");
        colQuantity.classList.add("border","border-dark","text-center");
        colQuantity.innerHTML = product.quantity;
        let colPrice = document.createElement("td");
        colPrice.classList.add("border","border-dark","text-center");
        let productPrice = product.price * product.quantity;
        colPrice.innerHTML = priceToEuros(productPrice);
        amounts.push(productPrice);

        tbody.appendChild(line);
        line.appendChild(colName);
        line.appendChild(colColor);
        line.appendChild(colQuantity);
        line.appendChild(colPrice);
    }
    
    totalPriceAmount.innerHTML = priceToEuros(calculateTotalAmount(amounts));

    // Construction de la table

    section[0].appendChild(table);
    table.appendChild(title);
    table.appendChild(thead);
    thead.appendChild(lineTitle);
    lineTitle.appendChild(nameHeader);
    lineTitle.appendChild(colorHeader);
    lineTitle.appendChild(quantityHeader);
    lineTitle.appendChild(priceHeader);
    table.appendChild(tfoot);
    tfoot.appendChild(totalPriceLine);
    totalPriceLine.appendChild(totalPriceDescription);
    totalPriceLine.appendChild(totalPriceAmount);
    table.appendChild(tbody);
}

function fillConfirmationMessage(response)
{
    printBasketSummary(response);
    let commandNumberTitle = document.createElement("h2");
    commandNumberTitle.classList.add("text-center","pb-3");
    commandNumberTitle.innerHTML = "Votre commande est validée sous la référence n° " + response.orderId+ ".";
    let section = document.getElementsByTagName("section");

    section[0].appendChild(commandNumberTitle);
    let finalWord = document.createElement("h3");
    finalWord.classList.add("text-center","font-weight-bold","my-5");
    finalWord.innerHTML = "Merci pour votre commande.";

    section[0].appendChild(finalWord);

    // Suppression du panier via nettoyage du localStorage
    localStorage.clear();
    printBasketInfo(); // Besoin pour mettre a jour la valeur du panier en haut a droite
}

// Appel de la fonction qui place un cercle au dessus du panier avec le nombre d'éléments a l'ouverture de la page
printBasketInfo();

// Recuperation des donnees du local storage pour la requete post
let contact = {};
let products = [];

let objectsFromBasket = JSON.parse(localStorage.getItem("object"));
for (let product of objectsFromBasket)
{
    products.push(product.id);
}
contact = JSON.parse(localStorage.getItem("personalData"));

// Lancement de la requete post avec fetch
let options = 
{
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({contact, products})
};

// Envoi de la requete post au serveur
fetchApi("http://localhost:3000/api/teddies/order/", options, fillConfirmationMessage);
