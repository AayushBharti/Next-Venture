"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import React from "react"

import { cn } from "../lib/utils"
import { IntegrationsType } from "./homepage/integrations"

export default function IntegrationsColumn(props: {
  integrations: IntegrationsType
  className?: string
  reverse?: boolean
}) {
  const { integrations, className, reverse } = props

  return (
    <motion.div
      initial={{
        y: reverse ? "-50%" : 0,
      }}
      animate={{
        y: reverse ? 0 : "-50%",
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "linear",
      }}
      className={cn("flex flex-col gap-4 pb-4", className)}
    >
      {Array.from({ length: 2 }).map((_, index) => (
        <React.Fragment key={index}>
          {integrations.map(integration => (
            <div
              key={integration.name}
              className="rounded-3xl border border-white/10 bg-neutral-900 p-6"
            >
              <div className="flex justify-center">
                <Image
                  src={integration.icon}
                  alt={`${integration.name} icon`}
                  className="size-24"
                />
              </div>
              <h3 className="mt-6 text-center text-3xl">{integration.name}</h3>
              <p className="mt-2 text-center text-white/50">
                {integration.description}
              </p>
            </div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  )
}
