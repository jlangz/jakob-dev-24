import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Bounded from "@/components/Bounded";
import { Content, DateField, isFilled } from "@prismicio/client";
import Heading from "@/components/Heading";

type Params = { uid: string };

export default function ContentBody({page}: {page: Content.BlogPostDocument | Content.ProjectDocument}) {
  const client = createClient();


  function formatDate(date: DateField) {
    if (isFilled.date(date)) {
      const dateOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Intl.DateTimeFormat("en-US", dateOptions).format(new Date(date));
    }
    return;
  }

  const formattedDate = formatDate(page.data.date);

    

  return (
    <Bounded as ="article">
      <div className="rounded-2xl border-2 border-zinc-800 bg-zinc-900 px-4 py-10 md:px-8 md:py-12">
        <Heading as="h1">{page.data.title}</Heading>
        <div className="flex gap-4 text-purple-300">
          {page.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p>{formattedDate}</p>
        <div className="prose prose-lg prose-invert mt-12 w-full max-w-none md:mt-20">
          <SliceZone slices={page.data.slices} components={components} />
        </div>
      </div>
    </Bounded>
  );
}