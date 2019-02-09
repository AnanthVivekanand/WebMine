importScripts('./allium.js');

Module.onRuntimeInitialized = function() {

    console.log(Module);

    postMessage("INITIALIZED");
    console.log("INITIALIZED");

    function hex2Buf(str) {
        var r = new Uint8Array(str.length / 2);

        for (var i = 0, x = str.length, k = 0; i < x; i += 2, k++) {
            r[k] = parseInt(str.substr(i, 2), 16);
        }

        return r;
    }

    function buf2Hex(buf) {
        var r = '';

        for (var i = 0, x = buf.length; i < x; i += 1) {
            r += (buf[i] <= 0xf ? '0' : '') + buf[i].toString(16);
        }

        return r;
    }
    const changeEndianness = (string) => {
        const result = [];
        let len = string.length - 2;
        while (len >= 0) {
            result.push(string.substr(len, 2));
            len -= 2;
        }
        return result.join('');
    }

    function randomNonce() {
        var rando_arr = new Array(Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255));
        return buf2Hex(rando_arr);
    }
    onmessage = function(e) {
//var t0 = performance.now();

        console.log('Message received from main script');
        let headertemplate = e.data[0] + e.data[1] + e.data[2] + e.data[3] + e.data[4] + "00000000";
        if (e.data[5] == 0) {
            diff = 0.5;
        } else {
            diff = e.data[5];
        }
        const maxTarget = 0x00000000FFFF0000000000000000000000000000000000000000000000000000;
        target = (maxTarget / diff) * 5000;
        let nonce = parseInt(randomNonce(4), 16); //1717644815;
        var heap = Module.HEAPU8.buffer;
        var header = new Uint8Array(heap, Module._malloc(80), 80);
        var output = new Uint8Array(heap, Module._malloc(32), 32);
        header.set(hex2Buf(headertemplate));
        //console.log(header);
        console.log(headertemplate);

//var t1 = performance.now();
//console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");


        while (++nonce) {
            //nonce++;
            header.set(hex2Buf(changeEndianness(nonce.toString(16))), 76);
            if (nonce % 250 == 0) {
                postMessage({
                    reportHashrate: true,
                    nonce: nonce
                });
                //console.log(nonce);
            }
            Module.ccall("allium_hash", "string", [], [header.byteOffset, output.byteOffset]);
            //console.log(buf2Hex(output));
            //console.log(buf2Hex(output));
            //	if (buf2Hex(output)[63] == "0") {
            if (buf2Hex(output)[62] == "0") {
                if (buf2Hex(output)[61] == "0") {
                    if (parseInt(changeEndianness(buf2Hex(output)), 16) < target) {
                        console.log("Zero detected!");
                        console.log(buf2Hex(output));
                        postMessage({
                            "nonce": nonce,
                            "submit": true
                        });
                        close();
                        break;
                    }
                }
            }
            //} 
        }
    }


}
