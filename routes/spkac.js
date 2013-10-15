
/*
 * POST spkac.
 */
var crypto = require('crypto');

exports.index = function(req, res){
  var spki = new crypto.Certificate();
  var spkac = new Buffer(stripLineEndings(req.body.spkac), 'utf-8');
  
  console.log(spki.verifySpkac(spkac));
  console.log(spki.exportChallenge(spkac).toString('utf-8'));
  console.log(spki.exportPublicKey(spkac).toString('utf-8'));

  res.send("respond with a resource");
};

function stripLineEndings(obj) {
  return obj.replace(/(\r\n|\n|\r)/gm, '');
}
