import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  structuredData?: Record<string, any>;
}

export const SEO = ({ title, description, canonical, structuredData }: SEOProps) => {
  const location = useLocation();
  const url = typeof window !== "undefined" ? window.location.origin + location.pathname : canonical;

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />} 
      <meta property="og:type" content="website" />
      {url && <link rel="canonical" href={canonical || url} />}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
