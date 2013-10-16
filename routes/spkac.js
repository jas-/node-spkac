
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

      /* These fields are required for a valid CSR */
      response.push('<h3>Submitted data</h3>');
      response.push('<p>These fields can be used during CSR creation</p>');

      response.push('<p>');
      response.push('Server name: <em>'+req.body.commonName+'</em><br/>');
      response.push('Email: <em>'+req.body.emailAddress+'</em><br/>');
      response.push('Country Name: <em>'+req.body.countryName+'</em><br/>');
      response.push('State or Province Name: <em>'+req.body.stateOrProvinceName+'</em><br/>');
      response.push('Locality Name: <em>'+req.body.localityName+'</em><br/>');
      response.push('Organization Name: <em>'+req.body.organizationName+'</em><br/>');
      response.push('Organizational Unit Name: <em>'+req.body.organizationalUnitName+'</em><br/>');
      response.push('SPKAC: <pre>'+req.body.spkac+'</pre>');
      response.push('</p>');
      response.push('<p>');

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

      response.push('</p>');
      res.send(response.join(' '));
    } else {
      res.send('A SPKAC was not found in POST request');
    }
  }
};

function stripLineEndings(obj) {
  return obj.replace(/(\r\n|\n|\r)/gm, '');
}
