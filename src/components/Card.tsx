import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, description, ogImage, tags } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium decoration-dashed hover:underline",
  };

  return (
    <li className="my-6">
      <a
        href={href}
        className="bg-white border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 flex w-full flex-col items-center rounded-lg border p-4 shadow md:flex-row"
      >
        <img
          src={ogImage}
          alt=""
          class="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
        />
        <div className="flex flex-col justify-between p-4 leading-normal">
          {secHeading ? <h2 {...headerProps}>{title}</h2> : <h3 {...headerProps}>{title}</h3>}
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="bg-skin-muted rounded-full px-2 py-1 text-sm font-medium text-skin-base">
                {tag}
              </span>
            ))}
          </div>
          <p>{description}</p>
          <Datetime datetime={pubDatetime} />
        </div>
      </a>
    </li>
  );
}
