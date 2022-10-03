import express from 'express';
let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//DB initial code
import { LowSync, JSONFileSync } from 'lowdb';
const adapter = new JSONFileSync('db.json');
const db = new LowSync(adapter);

//Set default data
db.data = db.data || { cups: [] };
// db.data = { cups: [] };

// add a route on server, that is listening for a post request
app.post('/noCups', (req, res) => {
    console.log(req.body);
    let currentDate = Date();
    let obj = {
        date: currentDate,
        coffee: req.body.number
    }
    //insert coffee data into the database
    db.data.cups.push(obj); //add to the array
    db.write(); //write to file

});
// serve the static files in public
app.use('/', express.static('public'));


//add route to get all coffee track information
app.get('/getCups', (req, res) => {
    // Read data from JSON file, this will set db.data content
    db.read();
    let data = db.data.cups;
    console.log(data);

    // let dataObj = { data: data };
    // res.json(dataObj);

    if (data.length === 0) {
        res.json({ task: "task failed" });
    } else {
        let dataObj = { data: data };
        res.json(dataObj);
    }



    // db.find({}, (err, docs)=> {
    //     if(err) {
    //         res.json({task: "task failed"})
    //     } else {
    //         let obj = {data: docs};
    //         res.json(obj);
    //     }

    // })

});

//listen at port 5000
let port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('listening at ', port);
});
