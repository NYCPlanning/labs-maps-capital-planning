import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { group } from 'd3-array';

const Header = ({ siteTitle, pageContext }) => {
  const data = useStaticQuery(graphql`
    query MapPages {
      allMdx(sort: {fields: frontmatter___position, order: [ASC]}) {
        edges {
          node {
            slug
            frontmatter {
              title
            }
            parent {
              id
              ... on File {
                relativeDirectory
              }
            }
          }
        }
      }
    }
  `)
 
  // groups the pages child pages
  const pages = Array.from(group(data.allMdx.edges, d => {
    if (d.node.parent.relativeDirectory) {
      return d.node.parent.relativeDirectory;
    } else {
      return d.node.slug;
    }
  }));

  const mapLinks = pages.map(([, pages]) => {
    const rootPage = pages.find(p => !p.node.parent.relativeDirectory);
    const childPages = pages.filter(p => p.node.parent.relativeDirectory);

    return (
      <li key={rootPage.node.slug} className="dropdown">
        <Link activeClassName="is-active" className="dropbtn" to={`/${rootPage.node.slug}`}>{rootPage.node.frontmatter.title}</Link>

        {(childPages.length > 0) && <div className="button-group small secondary stacked dropdown-content">
          {childPages.map((page) => 
            <Link activeClassName="is-active" key={page.node.slug} className="button" to={`/${page.node.slug}`}>
              {page.node.frontmatter.title}
            </Link>
          )}
        </div>}
      </li>)
    });

  return (
    <header className="site-header" role="banner">
      <div href="https://planninglabs.nyc/" className="labs-beta-notice hide-for-print"></div>
      <div className="grid-x grid-padding-x">
        <div className="branding cell medium-auto shrink">
          <a href="http://www1.nyc.gov/site/planning/index.page" className="dcp-link">
            <img src="https://raw.githubusercontent.com/NYCPlanning/logo/master/dcp_logo_772.png" alt="NYC Planning" className="dcp-logo" />
          </a>
          <Link to="/" className="site-title">{siteTitle}</Link>
          <span> {pageContext.title} {pageContext.parent.relativeDirectory ? `(${pageContext.parent.relativeDirectory})` : ''}</span>
        </div>
        <div className="cell auto hide-for-medium text-right">
          <button className="responsive-nav-toggler hide-for-print" data-toggle="menu">Menu</button>
        </div>
        <nav role="navigation" className="cell medium-shrink responsive show-for-medium hide-for-print" id="menu" data-toggler=".show-for-medium">
          <ul className="menu vertical medium-horizontal">
            {mapLinks}
            <li><Link activeClassName="is-active" to="/blog">Gallery</Link></li>
            <li><a target="_blank">Login</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
