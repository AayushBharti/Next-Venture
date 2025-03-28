import { after } from "next/server"

import Ping from "@/components/ping-animate"
import { client } from "@/sanity/lib/client"
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries"
import { writeClient } from "@/sanity/lib/write-client"

const View = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id })

  after(
    async () =>
      await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit(),
  )

  return (
    <div className="fixed bottom-3 right-3 mt-5 flex items-center justify-end rounded-lg bg-violet-700/10">
      <div className="absolute -right-2 -top-2">
        <Ping />
      </div>

      <p className="rounded-lg px-4 py-2 text-[16px] font-medium capitalize">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  )
}
export default View
