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

    const response = {
      title: "ask.com - what's your question?",
      description: "ask.com...",
      category: "search engine",
      estimated_monthly_visits: {
        "2017-11-01": 249348031,
        "2017-12-01": 225190770,
        "2018-01-01": 220857250
      },
      engagments: {
        visits: 220857250.12760288,
        time_on_site: 261.92853073818873,
        page_per_visit: 2.4397743066766662,
        page_per_visit: 0.53620374970043616
      }
    };

    nock('https://api.similarweb.com/v1/website')
      .get('/cnn.com/general-data/all')
      .query(true)
      .reply(200, response);

    appTester(App.searches.general_data.operation.perform, bundle)
      .then(results => {
        should.exist(results);
        results.length.should.eql(1);

        results[0].should.eql({
          title: 'ask.com - what\'s your question?',
          description: 'ask.com...',
          category: 'search engine',
          engagements_visits: 220857250.12760288,
          engagements_time_on_site: 261.9285307381887,
          engagements_page_per_visit: 0.5362037497004362,
          engagements_bounce_rate: 0.5362037497004362,
          visits: 220857250
        });

        // const visits = results[0];
        // visits.date.should.eql('2017-06');
        // visits.visits.should.eql(1000);

        done();
      })
      .catch(done);
  });
});
