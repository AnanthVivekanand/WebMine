var garlicoinhash = require('./index.js');


garlicoinhash.onRuntimeInitialized = function() {
    var heap = garlicoinhash.HEAPU8.buffer;
    var input = new Uint8Array(heap, garlicoinhash._malloc(80), 80);
    var output = new Uint8Array(heap, garlicoinhash._malloc(32), 32);
    var hashs = 0;
    var stime = new Date().getTime() / 1000;

    while (true) {
        var nonce = Math.random() * 4294967295 + 1 >>> 0;
        input[39] = (nonce & 4278190080) >> 24;
        input[40] = (nonce & 16711680) >> 16;
        input[41] = (nonce & 65280) >> 8;
        input[42] = (nonce & 255) >> 0;

        garlicoinhash.ccall("allium_hash", "string", [], [input.byteOffset, output.byteOffset]);

        hashs++;
        var now = new Date().getTime();

        if (now % 10 == 0) {
            now = now / 1000;

            if (typeof process.send == "function") {
                process.send({
                    hashrate: (hashs / (now - stime)),
                    total: hashs,
                    timestamp: (now - stime)
                });
            } else {
                console.clear();
                console.log("Hashrate: " + (hashs / (now - stime)) + "h/s\n" + "Total hashs: " + hashs + "\nTempo: " + (now - stime));
            }
        }
    }
    // garlicoinhash._allium_hash(input.byteOffset, output.byteOffset);
    // console.log("Allium: " + Buffer.from(output).toString('hex'));
}