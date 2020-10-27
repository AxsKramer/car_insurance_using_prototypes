const form = document.querySelector('#form');
form.addEventListener('submit', quoteCarInsurance);

// UI
function UI() {}

// CareInsurance
function CareInsurance(brand, year, type) {
    this.brand = brand;
    this.year = year;
    this.type = type;
}

//Fill the select options tags with years 
UI.prototype.yearsSelectOption = () => {
    const max = new Date().getFullYear();
    const min = max - 20;
    const selectYear = document.querySelector('#year');
    
    for(let i = max; i > min; i-- ) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

//Instance UI
const ui = new UI();
//When web page load
document.addEventListener('DOMContentLoaded', () => ui.yearsSelectOption());

// Show the message when submit
UI.prototype.showMessage = (message, type) => {
    const div = document.createElement('div');
    if(type === 'error') {
        div.classList.add('alert', 'alert-danger');
    } else {
        div.classList.add('alert', 'alert-success');
    }
    div.classList.add('mt-4' ,'text-center');
    div.textContent = message;
    // Insert HTML
    form.insertBefore(div, document.querySelector('#button-box'));
    setTimeout(() => div.remove(), 3000);
}

CareInsurance.prototype.quoteCare = function() {
    /*
        1 = American 1.15
        2 = Asian 1.05
        3 = European 1.35
    */
    let quantity;
    const base = 2000;

    switch(this.brand) {
        case '1':
            quantity = base * 1.15;
            break;
        case '2':
            quantity = base * 1.05;
            break;
        case '3':
            quantity = base * 1.35;
            break;
        default:
            break;
    }

    //Read year
    const diff = new Date().getFullYear() - this.year;
    //The cost  is reducing 3% each year
    quantity -= ((diff * 3) * quantity ) / 100;

    /*
        If the care insurance is basic, times for 30% more
        If the care insurance is complete, times for 50% more
    */

    if(this.type === 'basic') {
        quantity *= 1.30;
    } else {
        quantity *= 1.50;
    }

    return quantity;
}


function quoteCarInsurance(e) {
    e.preventDefault();
    //Read brand selected
    const brand = document.querySelector('#brand').value;
    //Read year selected
    const year = document.querySelector('#year').value;
    //Read type checked
    const type = document.querySelector('input[name="type"]:checked').value;
    
    //If the fields are empty
    if(brand === '' || year === '' || type === '') {
        ui.showMessage('All fields are required', 'error');
        return;
    } 
    //If the fields are not empty
    ui.showMessage('Quoting ...', 'success');

    //Hide previous quotes
    const results = document.querySelector('#result div');
    if(results != null) {
        results.remove();
    }

    // Instance 
    const careInsurance = new CareInsurance(brand, year, type);
    const total = careInsurance.quoteCare();

    // Use the prototype indicted
    ui.showResult(total, careInsurance);
    
}

UI.prototype.showResult = (total, careInsurance) => {

    const { brand, year, type } = careInsurance;

    let brandText;

    switch(brand) {
        case '1':
            brandText = 'American';
            break;
        case '2':
            brandText = 'Asian';
            break;
        case '3':
            brandText = 'European';
            break;
        default:
            break;
    }

    const div = document.createElement('div');
    div.classList.add('mt-3');

    div.innerHTML = `
                <div class="card mb-3" style="width: 16rem;">
                    <div class="card-header text-center">
                        <p class="font-weight-bolder">Results</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                        <p class="font-weight-bold">Brand: <span class="font-weight-normal"> ${brandText} </span></p>
                        </li>
                        <li class="list-group-item">
                            <p class="font-weight-bold">Year: <span class="font-weight-normal"> ${year} </span></p>
                        </li>
                        <li class="list-group-item">
                            <p class="font-weight-bold">Type: <span class="font-weight-normal text-capitalize"> ${type} </span></p>
                        </li>
                        <li class="list-group-item">
                            <p class="font-weight-bold">Total: <span class="font-weight-normal"> $ ${total} </span></p>
                        </li>
                    </ul>
                </div>
    `;
    const resultDiv = document.querySelector('#result');
    
    // Show spinner
    const spinner = document.querySelector('#loading');
    spinner.style.display = 'block';

    setTimeout(() => { 
        spinner.style.display = 'none';
        resultDiv.appendChild(div);
    }, 3000);
}


