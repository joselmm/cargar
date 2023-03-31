/*Dependencias de puppeter en shell
(para poderlas instalar en linux -distribucion Debian):

sudo apt-get install libxkbcommon-x11-0
sudo apt-get install libgtk-3-0
sudo apt-get install libgbm1

*/
const puppeteer = require('puppeteer');
const fetch= require('node-fetch');
require("dotenv").config();
let browser = "";
const fs  =  require('fs').promises;
const port = process.env.PORT || 8080;
var express = require('express')
var cors = require('cors')
var app = express()
app.use(cors())

const browserPromise = puppeteer.launch({
    headless:true,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });



browserPromise.then(async browserResult => {
    browser=browserResult;
app.listen(port, () => {
      console.log(`Servidor de Express escuchando en el puerto ${port}`);
    });
console.log("el navegador esta lanzado")

  })
  .catch(error => {
    console.error('Error al lanzar el navegador:', error);
  });
var pageChatGPT = false;
/* https://script.google.com/macros/s/AKfycbzHEa53uZqdbxkngX95aLH7w6CqGR-fvDnavmJGYViM6dFyukr-QT84j43-Zrc-avusxQ/exec?accion=actualizar&date=12345&codigo=6789
https://script.google.com/macros/s/AKfycbzHEa53uZqdbxkngX95aLH7w6CqGR-fvDnavmJGYViM6dFyukr-QT84j43-Zrc-avusxQ/exec?accion=consultar */
async function lanzarEiniciar(videoUrl) {
    var page = await browser.newPage();
    
    //await page.goto(videoUrl);
    await page.goto("https://y2mate.com");
    //await page.screenshot({"path":"y2mate-search.jpg"});

await page.screenshot()
  .then(async (screenshotBuffer) => {
    const base64Image = screenshotBuffer.toString('base64');
     var payload = {
        archivo_name: "capturay2mate.jpg",
        file_mime: "image/jpeg",
        archivo_base64: base64Image 
      };

      var result = await fetch(
        'https://script.google.com/macros/s/AKfycbz9GV4R7FOQOoTukIl8RDmdqw_sOy00z8H1IJDgA8dCQIMCbxO031VFF4TbwjSqBf0PIg/exec',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      )
        .then((res) => res.json())
        .then((res) => {
console.log(res)
resp = res;}
);
  })
  .catch((error) => {
    console.log('Error al capturar la pantalla:', error);
  });
    await page.close();
    return resp;
}


(async ()=>{
browserPromise.then(async browserResult => {
        browser=browserResult;
setTimeout(async ()=>{
	lanzarEiniciar();
    //var result= await searchVideoByUrl("https://www.youtube.com/watch?v=Qh4-hTA-Xgg")
//console.log(result)
},2000)


  })
  .catch(error => {
    console.error('Error al lanzar el navegador:', error);
  });


})()





app.post('/talk', express.json(),async function (req, res) {

	//console.log(videoUrl )
    const reqBody = req.body
    const respuesta ={
        noError:true
    }
	var botRespuesta= await talk(reqBody.promt);
    if(botRespuesta=="ocurrio un error al intentar tener una respuesta"){
        respuesta.noError=false;
    } else{
        respuesta.botRespuesta = botRespuesta;
    }


    res.json(respuesta)

	
})

function wait(ms){
return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function talk(promt) {
    await pageChatGPT.type(".ChatMessageInputView_textInput__Aervw",promt)
await pageChatGPT.click(".Button_button__GWnCw.ChatMessageInputView_sendButton__reEpT");
await wait(200)
await pageChatGPT.waitForSelector(".ChatMessageFeedbackButtons_feedbackButtonsContainer__0Xd3I")
var respuesta = await pageChatGPT.evaluate(() => {
    return document.querySelector(".ChatMessageFeedbackButtons_feedbackButtonsContainer__0Xd3I").parentNode.querySelector(".ChatMessage_messageRow__7yIr2").innerText
    // Aquí puedes ejecutar la función que quieras cuando el elemento reaparezca
});
if(typeof respuesta=="string") return respuesta
return "ocurrio un error al intentar tener una respuesta"
}