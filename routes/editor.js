const router = require("express").Router();
const fs = require("fs");
const fileName = "rates.json";

let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);
let size = data.length;

router.get("/", (req, res) => {
    res.render("edit")
})

router.get('/pairData', (req, res) => {
    res.send(data);
});

//ADD PAIR
router.post("/pairData", (req, res)=>{ 
    for (var i = 0; i< size; i++){
        if (req.body.id === data[i].id){
            return res.status(400).json({
                statusCode: res.statusCode,
                method: req.method,
                message: 'That Currency ID is already in use! Please enter another'
            });
        }
    }
    if (req.body === null || req.body === undefined){
        return res.status(400).json({
            statusCode: res.statusCode,
            method: req.method,
            message: 'Please enter a value!'
        });
    }
    data.push(req.body);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    res.json({message: "Currency Pair successfully added!"});
    res.end();
});

//DELETE PAIR
router.delete("/delete", (req, res) =>{
    var temp = data.filter((item) => item.id != req.body.delId);
    fs.writeFileSync(fileName, JSON.stringify(temp, null, 2));
    res.json({message: "Currency Pair successfully Deleted!"});
    res.end();
});

//EDIT PAIR
router.patch("/edit", (req, res)=> {
    for (var i = 0; i< size; i++){
        if (req.body.id === data[i].id){
            data[i].name = req.body.name;
            data[i].rates = req.body.rates;
        }
    }
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    res.json({message: "Currency Pair successfully altered"});
    res.end();
})

module.exports = router;