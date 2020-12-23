/* Cette fonction a pour but de traduire un prix en centimes (valeur numerique)
en chaine de caractere qui represente le prix en euro
Exemple : 1500 devient 15.00€ */
function priceToEuros(centsPrice)
{
    priceString = centsPrice.toString();
    return (priceString.substring(0, priceString.length-2)  + '.' + priceString.slice(-2) + "€");
}

function priceToCentsString(stringPrice)
{
    return Number(stringPrice.slice(0, -1)) * 100;
}

/* Cette fonction récupère le nombre d'éléments du localStorage pour afficher
 la quantité d'article dans le panier */
function printBasketInfo()
{
    let div = document.querySelector("ul.navbar-nav li p");
    let quantities = 0;
    let objectsFromBasket = JSON.parse(localStorage.getItem("object"));
    if (objectsFromBasket != null)
    {
        for (let product of objectsFromBasket)
        {
            quantities += product.quantity;
        }
    }
    div.innerHTML = quantities.toString();
}

// Calcule la somme d'un tableau
function calculateTotalAmount(tableOfPrice)
{
    let sum = 0;
    for (let price of tableOfPrice)
    {
        sum += price;
    }
    return sum;
}

// Interrogation du serveur via une requete HTTP en utilisant l'API fetch
function fetchApi (url, options, callback)
{
    fetch(url, options)
    .then(function(response)
    {
        if (response.ok && (response.status >= 200 && response.status <= 299))
        {
            return response.json(); // Gestion des bons cas seulement si le code est entre 200 et 299
        }
        else
        {
            let message = [];
            if (response.status >= 300 && response.status <= 399)
            {
                message = 'Erreur de redirection. Le contenu a bougé ou n\'est pas accessible directement';
            }
            else if (response.status >= 400 && response.status <= 499)
            {
                message = 'Erreur liée à l\'utilisation du service web';
            }
            else if (response.status >= 500 && response.status <= 599)
            {
                message = 'Erreur venant du service web';
            }
            else
            {
                message = 'Erreur d\'un autre type';
            }
            throw new Error(message);
        }
    })
    .then(function(response)
    {
        callback(response);
    })
    .catch(error => alert(error))
}
