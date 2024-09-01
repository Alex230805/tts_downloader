const googleTTS = require("google-tts-api");
const axios = require("axios");
const fs = require("fs")

const output_dir = "src/file_out/";
const list_of_things = "src/data.txt";
const link_list = "src/link/audio.txt";

const lang = "en";

async function fetch_data(){
    let data = await fs.readFileSync(list_of_things,"utf-8", (err,data)=>{console.log(data)});
    let cache = data.split("\n");
    let output = "";

    for(let i=0;i<cache.length;i++){
        try{
            let url = await googleTTS.getAudioUrl(cache.at(i), {
                lang: lang,
                slow: false,
                host: 'https://translate.google.com',
              }); 
    
              let response = await axios.get(url, {responseType:"arraybuffer"});
              fs.writeFileSync(output_dir+cache.at(i)+".mp3", Buffer.from(response.data));
    
              output += url;
              output += "\n";
        }catch(error){
            console.log(error);
            return;
        }
    }
    fs.writeFileSync(link_list, output, "utf-8", ()=>{console.log("Link downloaded")});
}

fetch_data();
