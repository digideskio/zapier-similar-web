var dateFormat = require('dateformat');

const transform = (source) => {
  const getRecentVisits = (visits) => {
    const dates = Object.keys(visits).map((s) => Date.parse(s));
    const recent = dateFormat(Math.max(...dates), "yyyy-mm-dd");

    return visits[recent];
  };

  return {
    title: source.title,
    description: source.description,
    category: source.category,
    engagements_visits: source.engagments.visits,
    engagements_time_on_site: source.engagments.time_on_site,
    engagements_page_per_visit: source.engagments.page_per_visit,
    engagements_bounce_rate: source.engagments.page_per_visit,
    visits: getRecentVisits(source.estimated_monthly_visits)
  };
};

const search = (z, bundle) => {
  const responsePromise = z.request({
    url: `https://api.similarweb.com/v1/website/${bundle.inputData.domain}/general-data/all`,
    params: {
      api_key: bundle.authData.api_key
    }
  });

  return responsePromise.then((response) => {
    if (response.status == 200) {
      const parsed = z.JSON.parse(response.content);
      return [transform(parsed)];
    }

    return [];
  });
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
      description: 'website description',
      category: 'website category',
      engagements_visits: 220857250,
      engagements_time_on_site: 261,
      engagements_page_per_visit: 2.4,
      engagements_bounce_rate: 0.536,
      estimated_visits_last_month: 255531415
    },

    outputFields: [
      { key: 'visits', label: 'Estimated Visits (Last Month)' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description' },
      { key: 'category', label: 'Category' },
      { key: 'engagements_visits', label: 'Engagement (Visits)' },
      { key: 'engagements_time_on_site', label: 'Engagement (Time On Site)' },
      { key: 'engagements_page_per_visit', label: 'Engagement (Pages Per Visit)' },
      { key: 'engagements_bounce_rate', label: 'Engagement (Bounce Rate)' }
    ]
  }
};
