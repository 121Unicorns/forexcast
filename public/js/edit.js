const server = 'http://localhost:3000';
var pairId;
var pairName;
var pairRates;
var delPair;
var pairEditId;
var pairEditName;
var pairEditRates;
var modal = document.getElementById("editModal");
var modalContent = document.getElementById("modalContent");
var xhttp = new XMLHttpRequest();
var currentRates = [];

fetchPairs();

//FETCH THE CURRENCY PAIRS FOM JSON
async function fetchPairs() {
  const url = server + '/edit/pairData';
  const options = {
      method: 'GET',
      headers: {
          'Accept' : 'application/json'
      }
  }
  const response = await fetch(url, options);
  const pairs = await response.json();
  populateContent(pairs);
}

//MAKE NAVIGATION BAR RESPONSIVE
function myFunction() {
    var x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
}

//HIDE EDITOR WINDOW
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
} 

//ADD A CURRENCY PAIR
async function addPair(){
  const url = server + '/edit/pairData';
  const pair = { id: pairId, name: pairName, rates: pairRates };
  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(pair)
  }
  
  const response = await fetch(url, options);
  const outcome = await response.json();
  alert(outcome.message);
}

//DELETE A CURRENCY PAIR
async function deletePair(){
    const url = server + '/edit/delete';
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"delId":delPair}),
    }
    var response = await fetch(url, options);
    const outcome = await response.json();
    alert(outcome.message);
}

//POPULATE THE TABLE WITH PAIRS
function populateContent(pairs) {
  let dropdown = document.getElementById('deezpairs');
  dropdown.selectedIndex = 0;
  for (let i = 0; i < pairs.length; i++) {
      option = document.createElement('option');
      option.text = pairs[i].name;
      option.value = pairs[i].id;
      dropdown.appendChild(option);
  }

  var table = document.getElementById('content');
  table.innerHTML = "<thead class='thead-dark'><tr><th>Rate ID</th><th>Rates</th><th>Edit Pair</th></tr></thead>";
  pairs.forEach(pair => {
      var row = document.createElement('tr');
      var dataId = document.createElement('td');
      var textId = document.createTextNode(pair.id);
      dataId.appendChild(textId);
      var dataRate = document.createElement('td');
      var textRate = document.createTextNode(pair.rates);
      dataRate.appendChild(textRate);
      var dataAction = document.createElement('td');
      var editBtn = document.createElement('button');
      editBtn.type = "button";
      editBtn.textContent = "Edit";
      editBtn.id = "editbtn";
      editBtn.setAttribute('onClick', `editItem('${pair.id}', '${pair.name}', '${pair.rates}')`);
      dataAction.appendChild(editBtn);     
      row.appendChild(dataId);
      row.appendChild(dataRate);
      row.appendChild(dataAction);
      table.appendChild(row);
  });
}

//FORM TO ADD PAIRS
document.querySelector('#myaddform').addEventListener('submit', (e) => {
    pairId = document.getElementById('pairId').value;
    pairName = document.getElementById('pairName').value;
    a = document.getElementById('pairRates').value;
    pairRates = a.split(',').map(Number).filter(x => !isNaN(x));

    if (pairId && pairName && pairRates) {
        addPair();
        fetchPairs();
        document.getElementById('myaddform').reset();
    }
    e.preventDefault();
});

//FORM TO DELETE PAIRS
document.querySelector('#delcurr').addEventListener('submit', (e) => {
    delPair = document.getElementById('deezpairs').value;
    if (delPair) {
        deletePair();
        fetchPairs();
    }
    e.preventDefault();
});

//FORM TO EDIT PAIRS
async function editItem (currid, currname, currates){
    modal.style.display = "block";
    modalContent.innerHTML = `
        <h1>Edit Pairs</h1>
        <form id="pairEditForm">
        <div class="row">
                <div class="form-group col">
                    <label for="pairId">Currency Pair ID: </label>
                    <input type="text"class="form-control" id="myEditId"
                        placeholder="Pair ID (ABCDEF)" required value=${currid} disabled>
                </div>
                <div class="form-group col">
                    <label for="pairName">Currency Pair Name: </label>
                    <input type="text" class="form-control" id="myEditName" placeholder="Pair Name" value='${currname}' required>
                </div>
                <div class="form-group col">
                    <label for="pairRates">Currency Pair Rates: </label>
                    <input type="text" class="form-control" id="myEditRates"
                        placeholder="Pair Rates" value=${currates} required>
                </div>
            </div>
            <div class="text-right">
                <button type="submit" id="submitedit">Submit</button>
                <button id="cancel" type="reset">Cancel</button>
            </div>
        </form>
    `;
    document.getElementById("pairEditForm").addEventListener("submit", (e) => {
        pairEditId = document.getElementById('myEditId').value;
        pairEditName = document.getElementById('myEditName').value;
        b = document.getElementById('myEditRates').value;
        pairEditRates = b.split(',').map(Number).filter(x => !isNaN(x));
        if (pairEditId && pairEditName && pairEditRates) {
            editPairs();
        }
        else {
            alert("Please fill out all the fields");
        }
        e.preventDefault();
    });
    document.getElementById("cancel").addEventListener("click", () =>{
        modal.style.display = "none"
    });
}

//EDIT CURRENCY PAIRS
async function editPairs(){
    const url = server + '/edit/edit';
    const pair = { id: pairEditId, name: pairEditName, rates: pairEditRates };
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pair)
    }
    const response = await fetch(url, options).then(response => response.json());
    modal.style.display = "none";
    alert(response.message);
}

//GET REALTIME CURRENCY DATA FROM WEB API
xhttp.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.response);
      var label = json.base;
      var values = json.rates;
      var details = [];
      for(var i in values){
        details.push(i, values [i]);
      }
      for (var i = 0; i<details.length; i++){
          if(i%2 == 0){
            currentRates.push(" " + label + "/" + details[i] + ": " + details[i+1]);
          }
      }
      var mytext = document.getElementById("marqueetext");
      var node = document.createTextNode(currentRates);
      mytext.appendChild(node);
    }
  };
  //RANDOMIZE MARQUEE EXCHANGE RATES
  const bases = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF"];
  const random = Math.floor(Math.random() * bases.length);
  var mybase = bases[random];
  xhttp.open("GET", ("https://api.frankfurter.app/latest?from=" + mybase), false);
  xhttp.send();