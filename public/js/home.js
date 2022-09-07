const server = 'http://localhost:3000';
var pairId;
var pairName;
var pairRates;
var xhttp = new XMLHttpRequest();
var currentRates = [];

//FETCH THE PAIRS FROM JSON FILE
async function fetchPairs() {
  const url = server + '/pairData';
  const options = {
      method: 'GET',
      headers: {
          'Accept' : 'application/json'
      }
  }
  const response = await fetch(url, options);
  const pairs = await response.json();
  populateList(pairs);
  selectData();
}

function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

//CHOOSE PAIRS FOR GENERATING DATA
async function selectData(pairId, pairId2, pairId3){
  const url = server + '/pairData';
  const options = {
      method: 'GET',
      headers: {
          'Accept' : 'application/json'
      }
  }
  const response = await fetch(url, options);
  const pairs = await response.json();

  var pairIds = pairs.map(function (elem) {
    return elem.id;
  });

  var rates = pairs.map(function (elem) {
    return elem.rates;
  });

  var first = 0;
  var second = 0;
  var third = 0;

  if (pairId, pairId2, pairId3){
      for (let i =0; i <pairIds.length; i++){
      if (pairId === pairIds[i]){
        first +=i;
      }
      if (pairId2 === pairIds[i]){
        second +=i;
      }
      if (pairId3 === pairIds[i]){
        third  +=i;
      }
    }
  } else {
    first = second = third = 0;
    pairId = pairId2 = pairId3 = pairIds[0];
  }
  calculateMovAvg(rates, first, second, third, pairId, pairId2, pairId3);
}

//CALCULATE MOVING AVERAGES
function calculateMovAvg(rates, first, second, third, pairId, pairId2, pairId3){
  firstavgs = [];
  secavgs = [];
  thirdavgs = [];
  avgs = [];
  mylabels = [];
  firstdat = 0;
  secdat = 0;
  thirdat = 0;

  firstavgs = fillArray(rates, first, firstdat,avgs);
  avgs = [];
  secavgs = fillArray(rates, second, secdat,avgs);
  avgs = [];
  thirdavgs = fillArray(rates, third, thirdat,avgs);
  avgs = [];

  function fillArray(rates, number, data, avgs){
    for (let i = 4; i<rates[number].length; i++){
      data = (rates[number][i] + rates[number][i-1] + rates[number][i-2] + rates[number][i-3] + rates[number][i-4])/5;
      avgs.push(data);
    }
    return avgs;
  };

  var longest = Math.max(firstavgs.length, secavgs.length, thirdavgs.length);

  for (let i = 0; i<longest; i++){
    mylabel = ("Day " + (i+1));
    mylabels.push(mylabel);
  }
  BuildChart(firstavgs, secavgs, thirdavgs, mylabels, pairId, pairId2, pairId3);

}

//CREATE THE CHART
function BuildChart(firstavgs, secavgs, thirdavgs, mylabels, pairId, pairId2, pairId3){
  var ctx = document.getElementById("myChart").getContext('2d');
  var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: mylabels,
          datasets: [{
            label: pairId,
            data: firstavgs,
            backgroundColor: 'transparent',
            borderColor: 'red',
            borderWidth: 1
          },
          {
            label: pairId2,
            data: secavgs,
            backgroundColor: 'transparent',
            borderColor: 'yellow',
            borderWidth: 1
          },
          {
            label: pairId3,
            data: thirdavgs,
            backgroundColor: 'transparent',
            borderColor: 'green',
            borderWidth: 1
          }],
        },
        options: {
          elements:{
            line:{
              tension:0
            }
          },
          scales:{
            yAxes: [{
              ticks: {
                beginAtZero: false
              }
            }]
          },
          responsive: true,
          maintainAspectRatio: false,
        }
      });
  return myChart;
}

//GENERATE VALUES IN DROP DOWN MENU FROM CURRENCY PAIRS STORED IN JSON FILE
function populateList(pairs) {
  let dropdown1 = document.getElementById('mypairs');
  let dropdown2 = document.getElementById('mypairs2');
  let dropdown3 = document.getElementById('mypairs3');
  
  size = pairs.length;

  dropdown1.selectedIndex = 0;
  dropdown2.selectedIndex = 0;
  dropdown3.selectedIndex = 0;
  generate(dropdown1);
  generate(dropdown2);
  generate(dropdown3);

  function generate(dropdown1){
    for (let i = 0; i < pairs.length; i++) {
      option = document.createElement('option');
      option.text = pairs[i].name;
      option.value = pairs[i].id;
      dropdown1.appendChild(option);
    }
  }
}

//GET THE CURRENCY PAIRS SELECTED BY THE USER
document.querySelector('form').addEventListener('submit', (e) => {
  pairId = document.getElementById('mypairs').value;
  pairId2 = document.getElementById('mypairs2').value;
  pairId3 = document.getElementById('mypairs3').value;
  selectData(pairId, pairId2, pairId3);
  e.preventDefault();
});

//THIS CALLS AN API AND REQUESTS CURRENT EXCHANGE RATE DATA TO DISPLAY IN THE MARQUEE
xhttp.onreadystatechange = function () {
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