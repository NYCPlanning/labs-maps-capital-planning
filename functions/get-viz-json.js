const request = require('superagent');
require('dotenv').config();

exports.handler = async (event) => {
  const { id, userName } = event.queryStringParameters;
  const viz = `https://${userName}.carto.com/api/v3/viz/${id}/viz.json?api_key=${process.env.CARTO_MASTER_KEY}`;

  const response = await request
    .get(viz);

  const [firstAnalysis] = response.body.analyses
  const analysisUrl = `https://${userName}.carto.com/api/v3/viz/${id}/analyses/${firstAnalysis.id}?api_key=${process.env.CARTO_MASTER_KEY}`;
  console.log(analysisUrl);
  const analysis = await request
    .get(analysisUrl);

  return {
    'statusCode': 200,
    'headers': {
      'Content-Type': 'application/json',
    },
    'body': JSON.stringify({
      widgets: response.body.widgets,
      analyses: [analysis.body],
    }),
  }
}
