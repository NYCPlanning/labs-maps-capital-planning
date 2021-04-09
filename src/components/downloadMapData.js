import React from "react"
import fetch from 'node-fetch';

const generateSQL = (visJson, initUrlState) => {
  const cleanedParentMapState = window.location.hash.split('#')[1];
  const urlState = cleanedParentMapState ? decodeURIComponent(cleanedParentMapState) : initUrlState;

  if (visJson) {
    const { analyses, widgets: widgetConfigurations } = visJson;

    // 'a0' is usually how the first analysis is ID'd in carto
    const [firstAnalysis] = analyses;

    if (firstAnalysis) {
      const { analysis_definition: { params, options } } = firstAnalysis;
      const primarySQL = params ? params.query.replace(/\n/g, " ") : `SELECT * FROM (${options.query})`;

      if (urlState && urlState.includes('acceptedCategories')) {
        const { widgets } = JSON.parse(urlState);
        const widgetIds = Object.keys(widgets);
        const whereClause = widgetIds
          .map(id => widgetConfigurations.find(w => w.id === id))
          .filter(widget => widget.type === 'category')
          .map(widget => {
            const { acceptedCategories: categories } = widgets[widget.id];

            return `${widget.options.column} IN (${categories.map(cat => `'${cat}'`).join(",")})`;
          })
          .join(' AND ');

        return `SELECT * FROM (${primarySQL}) a WHERE ${whereClause}`;
      } else {
        return primarySQL;
      }
    }
  }

  return null;
}

const getInfoFromEmbedLink = (mapUrl) => {
  // Builder embed links tend to look like this:
  // https://{org-name}.carto.com/u/{userName}/builder/{id}/embed
  // so this splits on / and pulls the appropriate segments
  // the code reverses it because sometimes there are org urls and not. so it looks like this:
  // embed/{id}/builder/{userName}/u/nycplanning-web.carto.com/
  const [, id, , userName] = (new URL(mapUrl)).pathname.split('/').reverse();

  return {
    id,
    userName,
  };
}

export default class DownloadMapData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visJson: null,
      downloadLink: null,
    };
  }

  componentDidMount() {
    const { id, userName } = getInfoFromEmbedLink(this.props.mapUrl);

    fetch(`/.netlify/functions/get-viz-json?userName=${userName}&id=${id}`)
      .then(res => res.json())
      .then(
        json => this.setState({ visJson: json })
      );
  }

  render() {
    const { userName } = getInfoFromEmbedLink(this.props.mapUrl);
    const sqlApiEndpoint = `https://${userName}.carto.com/api/v2/sql?format=csv&q=`;

    if (this.state.visJson) {
      return (
        <a
          className="button loading download-button"
          href={`${sqlApiEndpoint}${generateSQL(this.state.visJson, this.props.urlState)}`}
        >
          Download Data
        </a>
      )
    }

    return (null);
  }
}
