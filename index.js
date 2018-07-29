const Mam = require('./lib/mam.client.js');
const IOTA = require('iota.lib.js');
const iota = new IOTA({ provider: 'https://nodes.testnet.iota.org:443' });
const seed = 'TRACKRYBND9AFCHFDLCWSVQU9ISCDTBKUQSLXEEUXFHVDEEQZZJPCBPBJ9QSVFBXUJXTIFBMTQSLVUFYTH'

const MODE = 'restricted'; // public, private or restricted
const SIDEKEY = 'unihack2018trackr'; // Enter only ASCII characters. Used only in restricted mode
const SECURITYLEVEL = 3; // 1, 2 or 3
const TIMEINTERVAL  = 120; // seconds

exports.sendToIOTA = (req, res) => {
    let mamState = Mam.init(iota, undefined, SECURITYLEVEL);
    
    // Set channel mode
    if (MODE == 'restricted') {
        const key = iota.utils.toTrytes(SIDEKEY);
        mamState = Mam.changeMode(mamState, MODE, key);
    } else {
        mamState = Mam.changeMode(mamState, MODE);
    }
    
    
    
    const generateLength = function () {
        const length = Math.floor(Math.random()*30 + 1)
        return length
    }
    
    
    const generateID = function (){
        const ID = Math.floor(Math.random()*1000000)
        return ID
    }
    
    
    const generateData = function(dataLength)
    {
        var dataString = '';
        for (i = 0; i < dataLength; i++) {
            // Generate some random numbers simulating sensor data
            const lat = (Math.random() * 1000) + 10;
            const lon = (Math.random() * 1000) + 10;
            const speed = Math.floor((Math.random() * 89) + 10);
            if (dataString == '') {
                dataString = lat + ',' + lon + ',' + speed
            }
            else {
                dataString = dataString + ',' + lat + ',' + lon + ',' + speed
            }
        }
        return dataString
    }
    
    
    
    const determineDataLength = function(dataString){
        return String(dataString).split(',').length
    }
    
    
    const getID = function(dataString){
        return  dataString.split(',')[0]
    }
    
    
    
    
    // Publish data to the tangle
    const publish = async function(packet) {
        // Create MAM Payload
        const trytes = iota.utils.toTrytes(JSON.stringify(packet));
        const message = Mam.create(mamState, trytes);
    
        // Save new mamState
        mamState = message.state;
        console.log('Root: ', message.root);
        console.log('Address: ', message.address);
    
        // Attach the payload.
        await Mam.attach(message.payload, message.address);
    
        return message.root;
    }
    
    
    
    const buildJSONTripArray =  function(dataString) {
    
        var jsonTripArr = [];
        const dataArray = String(dataString).split(',');
        const dataLength = dataArray.length;
    
    
        for (var i = 0; i < dataLength; i = i + 3) {
            const lat = dataArray[i]
            const lon = dataArray[i + 1]
            const speed = dataArray[i + 2]
    
            jsonTripArr.push({
                'lon': lon,
                'lat': lat,
                'speed': speed
            });
        }
        return jsonTripArr
    }
    
    
    const buildJSONDataArray = function(dataString) {
        var jsonDataArray = [];
        const ID = 'crispy-bacon';
        const risk = (Math.random() * 100);
        const currentDate = new Date();
    
        jsonDataArray.push({
            'ID': ID,
            'risk': risk,
            'current date': currentDate,
            'data': buildJSONTripArray(dataString)
        })
        return jsonDataArray
    }
    
    
    var initialRoot = '';
    
    const executeDataPublishing = async function() {
        var dataString = await asyncData();
        var jsonArr = await buildJSONDataArray(dataString);
    
        console.log('Here is the array at the publishing stage');
        console.log(jsonArr);
    
        const root = await publish(jsonArr);
        if (initialRoot == '') {
            console.log('Of course because')
            initialRoot = root;
        };
        if (initialRoot != '') {
            console.log('Not any more, intial root is now')
            console.log(initialRoot);
        };
		return initialRoot
    
    }
    
    
    var asyncData = function() {
        let data = generateData(generateLength());
        return data
    }
    
    
    executeDataPublishing();
    
    // setInterval(function(){executeDataPublishing()}, TIMEINTERVAL*1000);
    
    res.send(initialRoot);
}