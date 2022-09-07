const router = require("express").Router();
const fs = require("fs");
const fileName = "rates.json";

let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

router.get("/", (req, res) => {
    res.render("home")
})

router.get('/pairData', (req, res) => {
    res.send(data);
});

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
    data.push(req.body);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    res.end();
});

module.exports = router;