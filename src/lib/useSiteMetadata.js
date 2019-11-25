import { useStaticQuery, graphql } from 'gatsby'

const useSiteMetadata = () => {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetaData {
        site {
          siteMetadata {
            title
            titleTemplate
            description
            author
            keywords
          }
        }
      }
    `
  )
  return site.siteMetadata
}

export default useSiteMetadata
