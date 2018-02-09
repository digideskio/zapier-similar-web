const should = require('should');
const zapier = require('zapier-platform-core');
const nock = require('nock');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('My App', () => {
  it('should run searchs.general_data', done => {
    const bundle = {
      inputData: { domain: 'cnn.com' },
      authData: { api_key: process.env['API_KEY'] }
    };

    const response = { estimated_monthly_visits: {}, title: 'title' };

    nock('https://api.similarweb.com/v1/website')
      .get('/cnn.com/general-data/all')
      .query(true)
      .reply(200, response);

    appTester(App.searches.general_data.operation.perform, bundle)
      .then(results => {
        should.exist(results);
        results.length.should.eql(1);
        
        // const visits = results[0];
        // visits.date.should.eql('2017-06');
        // visits.visits.should.eql(1000);

        done();
      })
      .catch(done);
  });
});
