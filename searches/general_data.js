// find a particular previousmonthvisits by name
const dateFormat = require('dateformat');

const lastMonth = () => {
  var now = new Date();
  now.setDate(1);
  now.setMonth(now.getMonth() - 1);

  return dateFormat(now, "yyyy'-'mm");
};

const search = (z, bundle) => {
  const responsePromise = z.request({
    url: `https://api.similarweb.com/v1/website/${bundle.inputData.domain}/general-data/all`,
    params: {
      api_key: bundle.authData.api_key
    }
  });

  return responsePromise.then((response) => {
    const results = [];

    if (response.status == 200) {
      results.push(z.JSON.parse(response.content));
    }

    return results;
  });
  //return responsePromise.then(response => console.log(response));
};

module.exports = {
  key: 'general_data',
  noun: 'Website Overview',

  display: {
    label: 'Retrieve Website Overiew',
    description: 'Retrieves overview data for a given domain'
  },

  operation: {
    inputFields: [
      { key: 'domain', required: true, helpText: 'Retrieve overview of this domain' }
    ],

    perform: search,

    sample: {
      title: 'website title',
      estimated_monthly_visits: { "2017-08-01": 255531415, "2017-09-01": 227030315 }
    },

    outputFields: [
      { key: 'estimated_monthly_visits', label: 'Estimated Monthly Visits' },
      { key: 'title', label: 'Title' }
    ]
  }
};
