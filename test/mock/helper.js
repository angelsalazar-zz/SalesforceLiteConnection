const axios = require('axios');

function getAuthAxios(oauth) {
  return (
    axios.create({
      baseURL: oauth.instance_url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${oauth.token_type} ${oauth.access_token}`
      }
    })
  )
}

module.exports = {
  getAuthAxios
};
