import { sanityFetch } from "@workspace/sanity/live";
import { queryHomePageData } from "@workspace/sanity/query";

import { PageBuilder } from "@/components/pagebuilder";
import { getSEOMetadata } from "@/lib/seo";

async function fetchHomePageData() {
  return await sanityFetch({ query: queryHomePageData });
}

export async function generateMetadata() {
  const { data } = await fetchHomePageData();
  return getSEOMetadata({
    title: data?.seoTitle ?? undefined,
    description: data?.seoDescription ?? undefined,
    slug: "/",
    contentId: data?._id,
    contentType: data?._type,
  });
}

export default async function Page() {
  const { data } = await fetchHomePageData();

  if (!data) {
    return <div>No home page data</div>;
  }

  return (
    <PageBuilder
      id={data._id}
      pageBuilder={data.pageBuilder ?? []}
      type={data._type}
    />
  );
}
