"use client";

import { IntegrationsColumn } from "@/components/shared/integrations-column";
import { Tag } from "@/components/shared/tag";
import type { PagebuilderType } from "@/types";

type IntegrationsSectionProps = PagebuilderType<"integrationsSection">;

export function Integrations(props: IntegrationsSectionProps) {
  const { eyebrow, title, subtitle, integrations } = props;

  const items = integrations ?? [];
  const reversed = [...items].reverse();

  return (
    <section id="integrations" className="overflow-hidden py-24">
      <div className="container">
        <div className="grid items-center lg:grid-cols-2 lg:gap-16">
          <div>
            {eyebrow && <Tag>{eyebrow}</Tag>}
            {title && <h2 className="mt-6 text-6xl font-medium">{title}</h2>}
            {subtitle && (
              <p className="mt-4 text-lg text-neutral-500 dark:text-white/50">
                {subtitle}
              </p>
            )}
          </div>
          <div>
            <div className="mt-8 grid h-96 gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] md:grid-cols-2 lg:mt-0 lg:h-[800px]">
              {items.length > 0 && (
                <>
                  <IntegrationsColumn integrations={items} />
                  <IntegrationsColumn
                    integrations={reversed}
                    reverse
                    className="hidden md:flex"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
