const fs = require('fs');

let createStructure;
createStructure = () => {
    let obj, tmpObj, nm =0, dtaa=[], senderRS='', HTMLstr=''; //, div = new ;

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
                    div.innerHTML = document.createElement(entry.senderRS);

                }

            });
            // fs.writeFile('arraySTR.json', JSON.stringify(dtaa),(data)=>{
            //     console.log('FILE SAVE!');
            // });
        }
    });
    //let obj = JSON.parse(jsn);
    console.log(div);
};
createStructure();

console.log(Date.now());