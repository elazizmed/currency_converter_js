 /*==== Initialize HTML elements ===*/
 const amountInput = document.getElementById("amount");
 const fromCurrency = document.getElementById("fromCurrency");
 const toCurrency = document.getElementById("toCurrency");
 const convertBtn = document.getElementById("convertBtn");
 const resultText = document.getElementById("result");

 /*===== Fetch available currencies from API ====*/
 async function fetchCurrencies() {
     try {
         const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
         const data = await response.json();
         const currencies = Object.keys(data.rates);
         
         fromCurrency.innerHTML = currencies.map(curr => `<option value="${curr}">${curr}</option>`).join("");
         toCurrency.innerHTML = currencies.map(curr => `<option value="${curr}">${curr}</option>`).join("");
         
         /*==== Retrieve values from LocalStorage ====*/
         fromCurrency.value = localStorage.getItem("fromCurrency") || "USD";
         toCurrency.value = localStorage.getItem("toCurrency") || "EUR";
         amountInput.value = localStorage.getItem("amount") || "1";
     } catch (error) {
         resultText.innerText = "Failed to load currencies";
     }
 }

/*=== Function to convert currency ===*/
async function convertCurrency() {
    const amount = amountInput.value;
    const from = fromCurrency.value;
    const to = toCurrency.value;
    
    /*==== Save values in LocalStorage ====*/
    localStorage.setItem("amount", amount);
    localStorage.setItem("fromCurrency", from);
    localStorage.setItem("toCurrency", to);
    
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        const data = await response.json();
        const rate = data.rates[to];
        const result = (amount * rate).toFixed(2);
        resultText.innerText = `${amount} ${from} = ${result} ${to}`;
    } catch (error) {
        resultText.innerText = "Error fetching exchange rate";
    }
}

/*=== Trigger conversion on button click ====*/
convertBtn.addEventListener("click", convertCurrency);

/*==== Automatically convert on input changes ===*/
amountInput.addEventListener("input", convertCurrency);
fromCurrency.addEventListener("change", convertCurrency);
toCurrency.addEventListener("change", convertCurrency);

/*==== Load currencies on page load and perform initial conversion ===*/
fetchCurrencies().then(convertCurrency);