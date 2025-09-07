import { FeaturedBlogCard } from "@/components/blog-card";
import { BlogList } from "@/components/blog-list";
import type { Blog } from "@/types";

export type BlogSectionProps = {
  blogs: Blog[];
  title: string;
  isFeatured?: boolean;
};

export function BlogSection({
  blogs,
  title,
  isFeatured = false,
}: BlogSectionProps) {
  if (blogs.length === 0) {
    return null;
  }

  if (isFeatured) {
    return (
      <section className="mb-12">
        <h2 className="sr-only">{title}</h2>
        <div className="grid grid-cols-1 gap-6">
          {blogs.map((blog) => (
            <FeaturedBlogCard blog={blog} key={blog._id} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="sr-only">{title}</h2>
      <BlogList blogs={blogs} />
    </section>
  );
}
