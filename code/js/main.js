

// ================== UI elements ================== //
const messageDiv = document.querySelector("#message");
const introInfo = document.querySelector("#intro-info");
const form = document.querySelector("#form");
const selectUnit = document.querySelector("#unit");
const amount = document.querySelector("#amount");
const conversionInfo = document.querySelector("#conversion-info");
const conversionWrapper = document.querySelector("#conversion-wrapper");
const conversionResultBoxes = document.querySelectorAll(".conversion-box");




// ================== Helper elements ================== //
const units = ["kilogram", "gram", "pound", "ounce"].sort();





// ================== Classes ================== //

class Init
/*
Creates those parts of the HTML that are dependent on what units are available
so that the HTML-file doesn't have to be updated on multiple places when ned weight units are added. 
*/
{
    static setHTML(units) {
        Init.createUnitList(units);
    }

    static createUnitList(units) {
        const ul = document.createElement("ul");
        units.forEach(unit => {
            const li = document.createElement("li");
            li.textContent = unit;
            ul.appendChild(li);
        });
        introInfo.appendChild(ul);
    }

    static createUnitChoiceList(units) {

    }
}


class Storage
{
    static getUnit() {
        return window.localStorage.getItem("unit") === null ? "kilogram" : JSON.parse(window.localStorage.getItem("unit"));
    }

    static setUnit(unit) {
        window.localStorage.setItem("unit", JSON.stringify(unit));
    }

    static getSorting() {
        return window.localStorage.getItem("sorting") === null ? "alphabetically" : JSON.parse(window.localStorage.getItem("sorting"));
    }

    static setSorting(sorting) {
        window.localStorage.setItem("sorting", JSON.stringify(sorting));
    }
}


class UI
{
    static displayMessage(message, color) {
        messageDiv.innerText = message;
        messageDiv.style.backgroundColor = color;
        messageDiv.style.display = "block";
        window.setTimeout(() => {
            messageDiv.style.display = "none";
        }, 3000);
    }

    static getUnit() {
        return selectUnit.value;
    }

    static setUnit(unit) {
        selectUnit.value = unit;
    }

    static getAmount() {
        return amount.value;
    }

    static showConversionResults(conversionResults) {
        conversionInfo.textContent = `${conversionResults.amount} ${conversionResults.from} is equal to`;
        conversionResultBoxes.forEach(box => {
            box.children[0].innerHTML = `<h3>${box.children[0].getAttribute("data-unit")}</h3>`;
            box.children[1].innerHTML = `${conversionResults.results[box.children[0].getAttribute("data-unit")]}`;
        });
        conversionWrapper.style.display = "block";
    }

    static hideContent() {
        conversionWrapper.style.display = "none";
    }
}


class Convert
{
    static kgTo(amount, unit) {
        if (unit === "kilogram") {
            return amount;
        } else if (unit === "gram") {
            return (amount * 1000).toFixed(4);
        } else if (unit === "pound") {
            return (amount * 2.2).toFixed(4);
        } else if (unit === "ounce") {
            return (amount * 35.27396).toFixed(4);
        } else {
            throw "Could not complete conversion from kilogram"
        }
    }

    static gramTo(amount, unit) {
        if (unit === "kilogram") {
            return (amount * 0.001).toFixed(4);
        } else if (unit === "gram") {
            return amount;
        } else if (unit === "pound") {
            return (amount * 0.0022).toFixed(4);
        } else if (unit === "ounce") {
            return (amount * 0.03527396).toFixed(4);
        } else {
            throw "Could not complete conversion from gram"
        }
    }

    static poundTo(amount, unit) {
        if (unit === "kilogram") {
            return (amount * 0.4535924).toFixed(3);
        } else if (unit === "gram") {
            return (amount * 453.5924018).toFixed(2);
        } else if (unit === "pound") {
            return amount;
        } else if (unit === "ounce") {
            return (amount * 16).toFixed(3);
        } else {
            throw "Could not complete conversion from pound"
        }
    }

    static ounceTo(amount, unit) {
        if (unit === "kilogram") {
            return (amount * 0.02834952).toFixed(4);
        } else if (unit === "gram") {
            return (amount * 28.34952).toFixed(3);
        } else if (unit === "pound") {
            return (amount * 0.0625).toFixed(4);
        } else if (unit === "ounce") {
            return amount;
        } else {
            throw "Could not complete conversion from ounce"
        }
    }

    static getConversionMethod(chosenUnit) {
        if (chosenUnit === "kilogram") {
            return Convert.kgTo;
        } else if (chosenUnit === "gram") {
            return Convert.gramTo;
        } else if (chosenUnit === "pound") {
            return Convert.poundTo;
        } else if (chosenUnit === "ounce") {
            return Convert.ounceTo;
        } else {
            throw "Could not choose a conversion mehtod";
        }
    }

    static getConversionResults(chosenUnit, chosenAmount) {
        const conversionResults = {
            "from": chosenUnit,
            "amount": chosenAmount,
            "results": {},
        };
        const conversionMethod = Convert.getConversionMethod(chosenUnit);
        units.forEach(unit => {
            conversionResults["results"][unit] = conversionMethod(chosenAmount, unit);
        });
        return conversionResults;
    }
}


class Event
{
    static pageLoad() {
        Init.setHTML(units);
        UI.setUnit(Storage.getUnit());
    }

    static saveUnit() {
        Storage.setUnit(UI.getUnit());
    }

    static preventFormSubmit(e) {
        e.preventDefault();
    }

    static convertWeight() {
        if (amount.value === "") {
            UI.hideContent();
            return;
        }
        const chosenUnit = UI.getUnit();
        const chosenAmount = UI.getAmount();
        const conversionResults = Convert.getConversionResults(chosenUnit, chosenAmount);
        UI.showConversionResults(conversionResults);
    }
}



// ================== Events ================== //

// Get last used unit on page load
document.addEventListener("DOMContentLoaded", Event.pageLoad);

// Save last used unit
selectUnit.addEventListener("change", Event.saveUnit);

// Prevent form from submitting
form.addEventListener("submit", Event.preventFormSubmit);

// Convert weight when amount is updated
amount.addEventListener("input", Event.convertWeight);

// Convert weight when unit is changed
selectUnit.addEventListener("change", Event.convertWeight);