let Base_Url = "https://api.apilayer.com/exchangerates_data/latest?base=USD&symbols=INR,GBP&apikey=tgajwRI8pjzNZZu9tI2ZH724KG4zhFnt";

const dropdowns = document.querySelectorAll(".dropdown select");
let btn = document.querySelector("form button");
let fromCurr = document.querySelector(".from select");
let toCurr = document.querySelector(".to select");
const msg = document.querySelector(".result"); // Use the existing .msg element from HTML

// Populate dropdowns
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update flag image
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Fetch and display exchange rate
const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    let apiURL = `https://api.apilayer.com/exchangerates_data/convert?from=${fromCurr.value}&to=${toCurr.value}&amount=${amtVal}`;

    try {
        let response = await fetch(apiURL, {
            method: "GET",
            headers: {
                apikey: "tgajwRI8pjzNZZu9tI2ZH724KG4zhFnt"
            }
        });

        let data = await response.json();

        if (data.result) {
            msg.innerText = `${amtVal} ${fromCurr.value} = ${data.result.toFixed(2)} ${toCurr.value}`;
        } else {
            msg.innerText = "Exchange rate not available.";
        }
    } catch (err) {
        console.error("API error:", err);
        msg.innerText = "Failed to fetch exchange rate.";
    }
};

// Button click listener
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

// Initial load
window.addEventListener("load", () => {
    updateExchangeRate();
});
