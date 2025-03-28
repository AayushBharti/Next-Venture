import markdownit from "markdown-it"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { GeneralSwiper } from "@/components/general-swiper"
import StartupCard, { StartupTypeCard } from "@/components/startup-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import View from "@/components/views-badge"
import { formatDate } from "@/lib/utils"
import { client } from "@/sanity/lib/client"
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries"

const md = markdownit()

export const experimental_ppr = true

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  //parallel request fetching
  const [post, { select: editorPosts }] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, {
      slug: "editor-picks",
    }),
  ])

  if (!post) return notFound()

  const parsedContent = md.render(post?.pitch || "")

  return (
    <div className="min-h-screen">
      <section className="mt-24 flex min-h-[230px] w-full flex-col items-center justify-center px-6 py-10">
        <Badge variant="secondary">{formatDate(post?._createdAt)}</Badge>
        <h1 className="my-5 max-w-5xl rounded-xl px-6 py-3 text-center text-3xl font-extrabold uppercase leading-tight sm:text-5xl sm:leading-tight">
          {post.title}
        </h1>
        <p className="max-w-4xl text-center text-lg text-primary/80 sm:text-xl">
          {post.description}
        </p>
      </section>

      <section className="mx-auto px-4 py-12 md:container">
        <Image
          src={post.image}
          alt="thumbnail"
          width={1200}
          height={675}
          className="h-auto max-h-[650px] w-full rounded-3xl object-cover"
        />
        <Card className="mx-auto mt-16 max-w-4xl overflow-hidden">
          <CardContent className="p-8">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <Link
                href={`/user/${post.author?._id}`}
                className="flex items-center gap-4"
              >
                <Avatar className="size-16 border-2 border-purple-500">
                  <AvatarImage src={post.author.image} alt={post.author.name} />
                  <AvatarFallback className="bg-purple-700">
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{post.author.name}</p>
                  <p className="text-sm text-gray-400">
                    @{post.author.username}
                  </p>
                </div>
              </Link>
              <Badge
                variant="outline"
                className="border-purple-500 text-purple-300"
              >
                {post.category}
              </Badge>
            </div>

            <CardHeader className="px-0">
              <CardTitle className="sr-only text-2xl font-bold">
                Pitch Details
              </CardTitle>
            </CardHeader>
            {parsedContent ? (
              <article
                className="prose prose-invert max-w-4xl break-words"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />
            ) : (
              <p className="italic text-gray-400">No details provided</p>
            )}
          </CardContent>
        </Card>

        <hr className="my-12 bg-gray-700" />

        {editorPosts && editorPosts.length > 0 && (
          <div className="mx-auto w-full max-w-6xl py-8 md:px-4">
            <h2 className="mb-5 text-3xl font-bold lg:text-4xl">
              Editor Picks
            </h2>
            <GeneralSwiper
              slidesPerView={{ 300: 1.3, 640: 2.2, 1024: 2.7 }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop={true}
              spaceBetween={20}
              pagination={false}
              navigation={false}
              className="py-12"
            >
              {editorPosts.map((post: StartupTypeCard, index: number) => (
                <StartupCard key={index} post={post} />
              ))}
            </GeneralSwiper>
          </div>
        )}

        <div className="mt-16">
          <Suspense fallback={<Skeleton className="h-8 w-full bg-gray-700" />}>
            <View id={id} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}

export default Page
