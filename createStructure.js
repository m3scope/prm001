const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM('<p>Hello<img src="./images/foo.jpg"></p>',{ includeNodeLocations: true });

const document = dom.window.document;
const bodyEl = document.body; // implicitly created
const pEl = document.querySelector('p');
const textNode = pEl.firstChild;
const imgEl = document.querySelector('img');

console.log(dom.nodeLocation(bodyEl));   // null; it's not in the source
console.log(dom.nodeLocation(pEl));      // { startOffset: 0, endOffset: 39, startTag: ..., endTag: ... }
console.log(dom.nodeLocation(textNode)); // { startOffset: 3, endOffset: 13 }
console.log(dom.nodeLocation(imgEl));

let createStructure;
createStructure = () => {
    let obj, tmpObj, nm =0, dtaa=[], senderRS='', HTMLstr='';//, document = window.document, div = document.createElement('div');

    fs.readFile('./array.json', 'utf8', (err, data)=>{
        if (err){
            console.log(err)
        } else {
            obj = JSON.parse(data);
            obj.forEach((entry, indx) => {
                //console.log(entry);
                if(entry.nm > nm){
                    let picked = obj.filter(function (el) {
                        return el.nm === entry.nm;
                    });
                    //console.log(picked);
                    nm = entry.nm;
                } else {
                    //dtaa.find()
                    //HTMLstr =
                    //div.innerHTML = document.createElement(entry.senderRS);

                }

            });
            // fs.writeFile('arraySTR.json', JSON.stringify(dtaa),(data)=>{
            //     console.log('FILE SAVE!');
            // });
        }
    });
    //let obj = JSON.parse(jsn);
    console.log(dom);
};
createStructure();

console.log(Date.now());