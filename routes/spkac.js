
var crypto = require('crypto'),
  spki = new crypto.Certificate();

exports.index = function(req, res){

  /* Array of required fields */
  var required = [
    'commonName',
    'emailAddress',
    'countryName',
    'stateOrProvinceName',
    'localityName',
    'organizationName',
    'organizationalUnitName',
    'spkac'
  ];
  
  var errors = [];

  /* Ensure we have everything */
  for (var i in req.body) {
    if (required.indexOf(req.body[i])) {
      if (!req.body[i]) {
        errors.push('Missing field: '+i+'<br/>');
      }
    }
  }

  /* Send errors if they exist */
  if (errors.length > 0) {

    res.send(errors.join(' '));
    return;

  } else {

    if (req.body.spkac) {
      var response = [];

      /*
       * Convert the SPKAC to a buffer and
       * strip the browsers need for line endings
       */
      var spkac = new Buffer(stripLineEndings(req.body.spkac), 'utf-8');

      /* Test validity of SPKAC */
      response.push('SPKAC valid: <em>'+spki.verifySpkac(spkac)+'</em><br/>');

      /* Export challenge associated with SPKAC */
      response.push('SPKAC Challenge: <em>'+spki.exportChallenge(spkac).toString('utf-8')+'</em><br/>');

      /* Export public key associated with SPKAC */
      response.push('SPKAC Public Key: <pre>'+spki.exportPublicKey(spkac).toString('utf-8')+'</pre><br/>');

      res.send(response.join(' '));
    } else {
      res.send('A SPKAC was not found in POST request');
    }
  }
};

function stripLineEndings(obj) {
  return obj.replace(/(\r\n|\n|\r)/gm, '');
}
