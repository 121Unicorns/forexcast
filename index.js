const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const path = require('path');
const jsonParser = bodyParser.json();
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
const connectLivereload = require("connect-livereload");

liveReloadServer.watch(path.join(__dirname, '/'));

liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

const edit = require("./routes/editor");
const home = require("./routes/homepage");

app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.use(express.json());
app.use(connectLivereload());
app.use("/edit", edit);
app.use("/", home);

app.get('/about',function(req,res){
    res.render('about');
});

app.listen(port);
console.log('Ninjas are now skulking at port 3000');