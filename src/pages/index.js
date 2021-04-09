import React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>An online resource for better, more collaborative planning through data and technology.</h1>
    <StaticImage src="../images/banner.png" alt="" />
  </Layout>
)

export default IndexPage
