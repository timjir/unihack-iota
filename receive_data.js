
const Mam = require('./lib/mam.client.js');
const IOTA = require('iota.lib.js');

const iota = new IOTA({ provider: 'https://nodes.testnet.iota.org:443' });


const MODE = 'restricted'; // public, private or restricted
const SIDEKEY = 'unihack2018trackr'; // Enter only ASCII characters. Used only in restricted mode



let root;
let key;

// Check the arguments
const args = process.argv;
if(args.length !=3) {
    console.log('Missing root as argument: node mam_receive.js <root>');
    process.exit();
} else if(!iota.valid.isAddress(args[2])){
    console.log('You have entered an invalid root: '+ args[2]);
    process.exit();
} else {
    root = args[2];
}

// Initialise MAM State
let mamState = Mam.init(iota);

// Set channel mode
if (MODE == 'restricted') {
    key = iota.utils.toTrytes(SIDEKEY);
    mamState = Mam.changeMode(mamState, MODE, key);
} else {
    mamState = Mam.changeMode(mamState, MODE);
}


const executeDataRetrieval = async function(rootVal, keyVal, results = []) {

    let resp = await Mam.fetch(rootVal, MODE, keyVal, function(data) {
        let json = JSON.parse(iota.utils.fromTrytes(data));

        results.push(json);

    });


    if (rootVal == resp.nextRoot){
        return results;
    }
    return executeDataRetrieval(resp.nextRoot, keyVal, results);

}



const executeDataRetrieval2 = async function(rootVal, keyVal) {

    let resp = await Mam.fetch(rootVal, MODE, keyVal);
    console.log(resp);
}


executeDataRetrieval(root, key).then(function(data){
    console.log('The complete data looks like');
    console.log(data);
});

//console.log(Promise.all(executeDataRetrieval(root, key)));





