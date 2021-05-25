const express =  require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express()	

app.use(bodyParser.urlencoded({extended:true}))


app.get('/',function(req,res){
res.sendFile(__dirname+"/index.html");

})
app.post('/',function(req,res){

        const city = req.body.city
     
    const url ="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=5ab5992e2f17780ddf80d21c9b14c495&units=metric"
    https.get(url,function(response){
        response.on('data',function(data){
            res.set("Content-Type", "text/html"); // set response as html 
            const wdata= JSON.parse(data)
            if(wdata.cod==='404')
            {
                res.write("<h3>City not found</h3>");
                res.send();
            }
            const temp = wdata.main.temp
            const des = wdata.weather[0].description
            const icon = wdata.weather[0].icon
            const country = wdata.sys.country
           
            res.write("<h3>The temprature in "+ city +" is "+ temp +"</h3>");
            res.write("<p>The weather is "+ des +"</p>");
            res.write("<p>country = "+ country +"</p>");
            res.write("<img src=http://openweathermap.org/img/wn/"+icon+"@2x.png>");
            res.send();
        })
    })

})

app.listen(3000,function()
{
    console.log('Server running at 3000')
})
