import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `
  "id": asset._ref,
  "preview": asset->metadata.lqip,
  "alt": coalesce(
    alt,
    asset->altText,
    caption,
    asset->originalFilename,
    "untitled"
  ),
  hotspot {
    x,
    y
  },
  crop {
    bottom,
    left,
    right,
    top
  }
`;
// Base fragments for reusable query parts
const imageFragment = /* groq */ `
  image {
    ${imageFields}
  }
`;

const customLinkFragment = /* groq */ `
  ...customLink{
    openInNewTab,
    "href": select(
      type == "internal" => internal->slug.current,
      type == "external" => external,
      "#"
    ),
  }
`;

const markDefsFragment = /* groq */ `
  markDefs[]{
    ...,
    ${customLinkFragment}
  }
`;

const richTextFragment = /* groq */ `
  richText[]{
    ...,
    _type == "block" => {
      ...,
      ${markDefsFragment}
    },
    _type == "image" => {
      ${imageFields},
      "caption": caption
    }
  }
`;

const blogAuthorFragment = /* groq */ `
  authors[0]->{
    _id,
    name,
    position,
    ${imageFragment}
  }
`;

const blogCardFragment = /* groq */ `
  _type,
  _id,
  title,
  description,
  "slug":slug.current,
  orderRank,
  ${imageFragment},
  publishedAt,
  ${blogAuthorFragment}
`;

const buttonsFragment = /* groq */ `
  buttons[]{
    text,
    variant,
    _key,
    _type,
    "openInNewTab": url.openInNewTab,
    "href": select(
      url.type == "internal" => url.internal->slug.current,
      url.type == "external" => url.external,
      url.href
    ),
  }
`;

// Page builder block fragments

const faqFragment = /* groq */ `
  "faqs": array::compact(faqs[]->{
    title,
    _id,
    _type,
    ${richTextFragment}
  })
`;

const faqAccordionBlock = /* groq */ `
  _type == "faqAccordion" => {
    ...,
    ${faqFragment},
    link{
      ...,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      )
    }
  }
`;

const heroSectionBlock = /* groq */ `
  _type == "heroSection" => {
    ...,
    ${buttonsFragment},
    decorativeImages[] {
      ${imageFields}
    }
  }
`;

const logoTickerSectionBlock = /* groq */ `
  _type == "logoTickerSection" => {
    ...,
    logos[] {
      ${imageFields}
    }
  }
`;

const recentPitchesSectionBlock = /* groq */ `
  _type == "recentPitchesSection" => {
    ...
  }
`;

const featureCardsIconBlock = /* groq */ `
  _type == "featureCardsIcon" => {
    ...,
    ${richTextFragment},
    cards[] {
      ...,
      ${richTextFragment}
    }
  }
`;

const integrationsSectionBlock = /* groq */ `
  _type == "integrationsSection" => {
    ...,
    integrations[] {
      ...,
      icon {
        ${imageFields}
      }
    }
  }
`;

const faqSectionBlock = /* groq */ `
  _type == "faqSection" => {
    ...,
    "faqs": faqs[]-> {
      _id,
      title,
      ${richTextFragment}
    }
  }
`;

const pageBuilderFragment = /* groq */ `
  pageBuilder[]{
    ...,
    _type,
    ${faqAccordionBlock},
    ${heroSectionBlock},
    ${logoTickerSectionBlock},
    ${recentPitchesSectionBlock},
    ${featureCardsIconBlock},
    ${integrationsSectionBlock},
    ${faqSectionBlock},
  }
`;

/**
 * Query to extract a single image from a page document
 * This is used as a type reference only and not for actual data fetching
 * Helps with TypeScript inference for image objects
 */
export const queryImageType = defineQuery(`
  *[_type == "page" && defined(image)][0]{
    ${imageFragment}
  }.image
`);

export const queryHomePageData =
  defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
    _id,
    _type,
    title,
    seoTitle,
    seoDescription,
    ${pageBuilderFragment}
  }`);

export const querySlugPageData = defineQuery(`
  *[_type == "page" && defined(slug.current) && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${pageBuilderFragment}
  }
  `);

export const querySlugPagePaths = defineQuery(`
  *[_type == "page" && defined(slug.current)].slug.current
`);

export const queryBlogIndexPageData = defineQuery(`
  *[_type == "blogIndex"][0]{
    ...,
    _id,
    _type,
    title,
    description,
    "displayFeaturedBlogs" : displayFeaturedBlogs == "yes",
    "featuredBlogsCount" : featuredBlogsCount,
    ${pageBuilderFragment},
    "slug": slug.current
  }
`);

export const queryBlogIndexPageBlogs = defineQuery(`
  *[_type == "blog" && (seoHideFromLists != true)] | order(orderRank asc) [$start...$end]{
    ${blogCardFragment}
  }
`);

export const queryAllBlogDataForSearch = defineQuery(`
  *[_type == "blog" && defined(slug.current) && (seoHideFromLists != true)]{
    ${blogCardFragment}
  }
`);

export const queryBlogIndexPageBlogsCount = defineQuery(`
  count(*[_type == "blog" && (seoHideFromLists != true)])
`);
export const queryBlogSlugPageData = defineQuery(`
  *[_type == "blog" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${blogAuthorFragment},
    ${imageFragment},
    ${richTextFragment},
    ${pageBuilderFragment}
  }
`);

export const queryBlogPaths = defineQuery(`
  *[_type == "blog" && defined(slug.current)].slug.current
`);

const ogFieldsFragment = /* groq */ `
  _id,
  _type,
  "title": select(
    defined(ogTitle) => ogTitle,
    defined(seoTitle) => seoTitle,
    title
  ),
  "description": select(
    defined(ogDescription) => ogDescription,
    defined(seoDescription) => seoDescription,
    description
  ),
  "image": image.asset->url + "?w=566&h=566&dpr=2&fit=max",
  "dominantColor": image.asset->metadata.palette.dominant.background,
  "seoImage": seoImage.asset->url + "?w=1200&h=630&dpr=2&fit=max", 
  "logo": *[_type == "settings"][0].logo.asset->url + "?w=80&h=40&dpr=3&fit=max&q=100",
  "date": coalesce(date, _createdAt)
`;

export const queryHomePageOGData = defineQuery(`
  *[_type == "homePage" && _id == $id][0]{
    ${ogFieldsFragment}
  }
  `);

export const querySlugPageOGData = defineQuery(`
  *[_type == "page" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryBlogPageOGData = defineQuery(`
  *[_type == "blog" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryGenericPageOGData = defineQuery(`
  *[ defined(slug.current) && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryFooterData = defineQuery(`
  *[_type == "footer" && _id == "footer"][0]{
    _id,
    ${richTextFragment}
  }
`);

export const queryNavbarData = defineQuery(`
  *[_type == "navbar" && _id == "navbar"][0]{
    _id,
    columns[]{
      _key,
      _type == "navbarColumn" => {
        "type": "column",
        title,
        links[]{
          _key,
          name,
          icon,
          description,
          "openInNewTab": url.openInNewTab,
          "href": select(
            url.type == "internal" => url.internal->slug.current,
            url.type == "external" => url.external,
            url.href
          )
        }
      },
      _type == "navbarLink" => {
        "type": "link",
        name,
        description,
        "openInNewTab": url.openInNewTab,
        "href": select(
          url.type == "internal" => url.internal->slug.current,
          url.type == "external" => url.external,
          url.href
        )
      }
    },
    ${buttonsFragment},
  }
`);

export const querySitemapData = defineQuery(`{
  "slugPages": *[_type == "page" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "blogPages": *[_type == "blog" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "startupPages": *[_type == "startup"]{
    "slug": _id,
    "lastModified": _updatedAt
  },
  "categoryPages": *[_type == "category" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  }
}`);
export const queryGlobalSeoSettings = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    logo {
      ${imageFields}
    },
    siteDescription,
    socialLinks{
      linkedin,
      facebook,
      twitter,
      instagram,
      youtube
    }
  }
`);

export const querySettingsData = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    siteDescription,
    "logo": logo.asset->url + "?w=80&h=40&dpr=3&fit=max",
    "socialLinks": socialLinks,
    "contactEmail": contactEmail,
  }
`);

export const queryRedirects = defineQuery(`
  *[_type == "redirect" && status == "active" && defined(source.current) && defined(destination.current)]{
    "source":source.current,
    "destination":destination.current,
    "permanent" : permanent == "true"
  }
`);

// ─── Startup Queries ───

export const queryStartups = defineQuery(`
  *[_type == "startup"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "category": category->title,
    image {
      ${imageFields}
    },
    _createdAt,
    views,
    upvotes,
    author-> {
      name,
      image {
        ${imageFields}
      },
      username
    }
  }
`);

export const queryStartupById = defineQuery(`
  *[_type == "startup" && _id == $id][0] {
    ...,
    "category": category->title,
    "categoryRef": category._ref,
    image {
      ${imageFields}
    },
    author-> {
      _id,
      name,
      image {
        ${imageFields}
      },
      username,
      bio
    }
  }
`);

export const queryRelatedStartups = defineQuery(`
  *[_type == "startup" && category._ref == $categoryRef && _id != $excludeId] | order(upvotes desc) [0...6] {
    _id,
    title,
    "slug": slug.current,
    description,
    "category": category->title,
    image {
      ${imageFields}
    },
    _createdAt,
    views,
    upvotes,
    author-> {
      name,
      image {
        ${imageFields}
      }
    }
  }
`);

export const queryStartupsByAuthor = defineQuery(`
  *[_type == "startup" && author._ref == $id] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "category": category->title,
    image {
      ${imageFields}
    },
    _createdAt,
    views,
    upvotes
  }
`);

export const queryTopStartups = defineQuery(`
  *[_type == "startup"] | order(upvotes desc, _createdAt desc) [0...$count] {
    _id,
    title,
    "slug": slug.current,
    description,
    "category": category->title,
    image {
      ${imageFields}
    },
    _createdAt,
    views,
    upvotes,
    author-> {
      name,
      image {
        ${imageFields}
      }
    }
  }
`);

export const queryStartupViews = defineQuery(`
  *[_type == "startup" && _id == $id][0]{ _id, views }
`);

export const queryStartupsByUpvotes = defineQuery(`
  *[_type == "startup"] | order(upvotes desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "category": category->title,
    image {
      ${imageFields}
    },
    _createdAt,
    views,
    upvotes,
    author-> {
      name,
      image {
        ${imageFields}
      },
      username
    }
  }
`);

export const queryStartupsByViews = defineQuery(`
  *[_type == "startup"] | order(views desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "category": category->title,
    image {
      ${imageFields}
    },
    _createdAt,
    views,
    upvotes,
    author-> {
      name,
      image {
        ${imageFields}
      },
      username
    }
  }
`);

// ─── Category Queries ───

export const queryAllCategories = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`);

export const queryCategoryBySlug = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description
  }
`);

export const queryStartupsByCategory = defineQuery(`
  *[_type == "startup" && category->slug.current == $slug] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "category": category->title,
    image {
      ${imageFields}
    },
    _createdAt,
    views,
    upvotes,
    author-> {
      name,
      image {
        ${imageFields}
      },
      username
    }
  }
`);

export const queryCategoryPaths = defineQuery(`
  *[_type == "category" && defined(slug.current)].slug.current
`);

export const queryAllCategoriesWithCount = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "count": count(*[_type == "startup" && category._ref == ^._id])
  }
`);

// ─── Playlist Queries ───

export const queryPlaylistBySlug = defineQuery(`
  *[_type == "playlist" && slug.current == $slug][0] {
    title,
    select[]-> {
      _id,
      title,
      "slug": slug.current,
      description,
      "category": category->title,
      image {
        ${imageFields}
      },
      author-> {
        name,
        image {
          ${imageFields}
        }
      },
      views,
      upvotes
    }
  }
`);

// ─── Author Queries ───

export const queryAuthorByGithubId = defineQuery(`
  *[_type == "author" && githubId == $id][0]
`);

export const queryAuthorById = defineQuery(`
  *[_type == "author" && _id == $id][0] {
    _id,
    name,
    username,
    email,
    bio,
    position,
    image {
      ${imageFields}
    }
  }
`);

// ─── Comment Queries ───

export const queryRecentActivityByAuthor = defineQuery(`
  *[_type == "comment" && author._ref == $id] | order(_createdAt desc) [0...10] {
    _id,
    _createdAt,
    content,
    startup-> {
      _id,
      title
    }
  }
`);

export const queryCommentsByStartup = defineQuery(`
  *[_type == "comment" && startup._ref == $id] | order(_createdAt desc) {
    _id,
    _createdAt,
    content,
    author-> {
      _id,
      name,
      username,
      image {
        ${imageFields}
      }
    }
  }
`);
