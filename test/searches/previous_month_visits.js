const should = require('should');
const zapier = require('zapier-platform-core');
const nock = require('nock');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('My App', () => {
  it('should run searchs.previous_month_visits', done => {
    const bundle = {
      inputData: { main_domain_only: false, domain: 'cnn.com', start_date: '2017-06', end_date: '2018-01' },
      authData: { api_key: process.env['API_KEY'] }
    };

    const response = { visits: [{ date: '2017-06', visits: 1000 }] };

    nock('https://api.similarweb.com/v1/website')
      .get('/cnn.com/total-traffic-and-engagement/visits')
      .query(true)
      .reply(200, response);

    appTester(App.searches.previous_monthly_visits.operation.perform, bundle)
      .then(results => {
        should.exist(results);
        results.length.should.eql(1);

        const visits = results[0];
        visits.date.should.eql('2017-06');
        visits.visits.should.eql(1000);

        done();
      })
      .catch(done);
  });
});
