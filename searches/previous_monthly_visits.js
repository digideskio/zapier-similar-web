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
    url: `https://api.similarweb.com/v1/website/${bundle.inputData.domain}/total-traffic-and-engagement/visits`,
    params: {
      granularity: 'monthly',
      main_domain_only: bundle.inputData.main_domain_only,
      start_date: bundle.inputData.start_date || lastMonth(),
      end_date: bundle.inputData.end_date || lastMonth(),
      api_key: bundle.authData.api_key,
      country: 'gb'
    }
  });

  return responsePromise.then(response => z.JSON.parse(response.content).visits);

  //return responsePromise.then(response => console.log(response));
};

module.exports = {
  key: 'previous_monthly_visits',
  noun: 'Monthly Visits',

  display: {
    label: 'Retrieve Monthly Visits',
    description: 'Retrieves previous monthly visits for a domain'
  },

  operation: {
    inputFields: [
      { key: 'domain', required: true, helpText: 'Retrieve monthly visits to this domain' },
      { key: 'start_date', required: false, helpText: 'Starting from this month (YYYY-MM), defaults to previous month' },
      { key: 'end_date', required: false, helpText: 'Ending at this month (YYYY-MM), defaults to previous month' },
      { key: 'main_domain_only', required: true, type: 'boolean', helpText: 'Search main domain only?' }
    ],

    perform: search,

    sample: {
      date: '2016-01-01',
      visits: 419183781
    },

    outputFields: [
      { key: 'date', label: 'Date' },
      { key: 'visits', label: 'Visits' }
    ]
  }
};
