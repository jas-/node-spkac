
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
        errors.push('Missing field: '+i);
      }
    }
  }

  /* Send errors if they exist */
  if (errors.length > 0) {
    display(req, res, errors, null, null, null);
  } else {

    if (req.body.spkac) {
      /*
       * Convert the SPKAC to a buffer and
       * strip the browsers need for line endings
       */
      var spkac = new Buffer(stripLineEndings(req.body.spkac), 'utf-8');

      /* Test validity of SPKAC */
      var valid = spki.verifySpkac(spkac);

      /* Export challenge associated with SPKAC */
      var challenge = spki.exportChallenge(spkac).toString('utf-8');

      /* Export public key associated with SPKAC */
      var pubKey = spki.exportPublicKey(spkac).toString('utf-8');

      display(req, res, null, valid, challenge, pubKey);
    } else {
      display(req, res, ['A SPKAC was not found in POST request'], null, null, null);
    }
  }
};

function display(req, res, errors, verify, challenge, pubKey) {
  res.render('spkac', {
    title: 'SPKAC w/ node.js',
    errors: errors,
    commonName: req.body.commonName,
    emailAddress: req.body.emailAddress,
    countryName: req.body.countryName,
    stateOrProvinceName: req.body.stateOrProvinceName,
    localityName: req.body.localityName,
    organizationName: req.body.organizationName,
    organizationalUnitName: req.body.organizationalUnitName,
    spkac: req.body.spkac,
    verify: verify,
    challenge: challenge,
    pubKey: pubKey
  });
}

function stripLineEndings(obj) {
  return obj.replace(/(\r\n|\n|\r)/gm, '');
}
