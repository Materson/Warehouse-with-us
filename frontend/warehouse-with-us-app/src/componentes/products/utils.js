export function quantitySum(prodQuantity)
{
    return prodQuantity.reduce((preVal, curVal) => {
        return preVal + curVal.delta;
    },0)
}

export function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
  }

export function validatePrice(prInput, setPriceError) {
    if(prInput && isNumeric(prInput) && parseFloat(prInput) >= 0) 
      setPriceError(false);
    else
      setPriceError(true);
}

export function validateQuantity(quantity, setQuantityError) {
    if(quantity && isNumeric(quantity) && parseInt(quantity) > 0) 
        setQuantityError(false);
    else
        setQuantityError(true);
}

export function toFloat(num) {
    return parseFloat(parseFloat(num).toFixed(2));
}

export function compareProductsByCategory(categories) {
    return function(a,b) {
        const aCat = categories.find(element => element.id == a.category);
        if(aCat === undefined)
        {
            console.log("kategoria undefined: " + a.category + "prod: " + a.manufacturer);
            return -1;
        }
        const bCat = categories.find(element => element.id == b.category);
        if(bCat === undefined)
        {
            console.log("kategoria undefined: " + b.category + "prod: " + b.manufacturer);
            return -1;
        }

        if(aCat.name === "-") return 1;
        if(bCat.name === "-") return -1;
        if(aCat.name.toLowerCase() < bCat.name.toLowerCase())
            return -1;
        else if(aCat.name.toLowerCase() > bCat.name.toLowerCase())
            return 1;
        return 0;
    }
}