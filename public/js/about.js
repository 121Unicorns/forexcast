const server = 'http://localhost:3000';
var xhttp = new XMLHttpRequest();
var currentRates = [];

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