const testAuth = (z, bundle) => {
  return z.request({
    url: `https://api.similarweb.com/capabilities?api_key=${bundle.authData.api_key}`,
  }).then((response) => {
    if (response.status != 200) {
      throw new Error('The API Key you supplied is invalid');
    }
    return response;
  });
};

const authentication = {
  type: 'custom',
  // "test" could also be a function
  test: testAuth,
  fields: [
    {
      key: 'api_key',
      type: 'string',
      required: true,
      helpText: 'Provided by [SimilarWeb](https://pro.similarweb.com/#/account/api-management)'
    }
  ]
};

module.exports = authentication;
