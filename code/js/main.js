

// ================== UI elements ================== //
const messageDiv = document.querySelector("#message");
const introInfo = document.querySelector("#intro-info");
const form = document.querySelector("#form");
const selectUnit = document.querySelector("#unit-list-menu");
const amount = document.querySelector("#amount");
const conversionInfo = document.querySelector("#conversion-info");
const conversionWrapper = document.querySelector("#conversion-wrapper");
let conversionResultBoxes; // Gets initialized in Init class




// ================== Helper elements ================== //
const units = ["kilogram", "gram", "pound", "ounce", "ton"].sort();
const conversionRatioToKg = {
    "gram": 1000,
    "kilogram": 1,
    "pound": 2.205,
    "ounce": 35.27,
    "ton": 0.001,
}




// ================== Classes ================== //

class Helper
{
    static capitalizeWord(word) {
        return word[0].toUpperCase() + word.substring(1);
    }
}


class Init
/*
Creates those parts of the HTML that are dependent on what units are available
so that the HTML-file doesn't have to be updated on multiple places when ned weight units are added. 
*/
{
    static createHTML(units) {
        Init.createUnitList(units);
        Init.createUnitChoiceList(units);
        Init.createResultBoxes(units);
    }

    static createUnitList(units) {
        const ul = document.createElement("ul");
        units.forEach(unit => {
            const li = document.createElement("li");
            li.textContent = Helper.capitalizeWord(unit);
            ul.appendChild(li);
        });
        introInfo.appendChild(ul);
    }

    static createUnitChoiceList(units) {
        units.forEach(unit => {
            const option = document.createElement("option");
            option.setAttribute("value", unit);
            option.textContent = Helper.capitalizeWord(unit);
            selectUnit.appendChild(option);
        });
    }

    static createResultBoxes(units) {
        units.forEach(unit => {
            const div = document.createElement("div");
            div.classList.add("conversion-box");
            
            const h3 = document.createElement("h3");
            h3.classList.add("unit-heading");
            h3.setAttribute("data-unit", unit);
            div.appendChild(h3);
            
            const p = document.createElement("p");
            p.classList.add("conversion-result");
            p.setAttribute("data-unit", unit);
            div.appendChild(p);

            conversionWrapper.appendChild(div);
            conversionResultBoxes = document.querySelectorAll(".conversion-box");
        });
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
            box.children[0].innerHTML = `${Helper.capitalizeWord(box.children[0].getAttribute("data-unit"))}:`;
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
    static convertWeight(amount, chosenUnit, to) {
        let result;

        units.forEach(unit => {
            if (chosenUnit === unit) {
                result = amount * (1 / conversionRatioToKg[unit]);
            }
        });

        units.forEach(unit => {
            if (to === unit) {
                result = result * conversionRatioToKg[unit];
            }
        });

        return result;
    }

    static getConversionResults(chosenUnit, chosenAmount) {
        const conversionResults = {
            "from": chosenUnit,
            "amount": chosenAmount,
            "results": {},
        };

        units.forEach(unit => {
            conversionResults["results"][unit] = Convert.convertWeight(chosenAmount, chosenUnit, unit);
        });
        return conversionResults;
    }
}


class Event
{
    static pageLoad() {
        Init.createHTML(units);
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