const fs = require('fs');

let createStructure;
createStructure = () => {
    let obj, tmpObj, nm =0, dtaa=[], senderRS='';

    fs.readFile('./array.json', 'utf8', (err, data)=>{
        if (err){
            console.log(err)
        } else {
            obj = JSON.parse(data);
            obj.forEach((entry, indx) => {
                //console.log(entry);
                if(!entry.nm > nm){
                    dtaa.push(entry.senderRS);
                    dtaa[entry.senderRS] = new Array();
                    //dtaa[entry.senderRS].push(entry.recipientRS);
                    console.log();
                } else {

                }

            });
            fs.writeFile('arraySTR.json', JSON.stringify(dtaa),(data)=>{
                console.log('FILE SAVE!');
            });
        }
    });
    //let obj = JSON.parse(jsn);

};
createStructure();

console.log(Date.now());