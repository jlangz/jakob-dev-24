import Bounded from "@/components/Bounded";
import ContentList from "@/components/ContentList";
import Heading from "@/components/Heading";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ContentIndex`.
 */
export type ContentIndexProps = SliceComponentProps<Content.ContentIndexSlice>;

/**
 * Component for "ContentIndex" Slices.
 */
const ContentIndex = ({ slice }: ContentIndexProps): JSX.Element => {

  


  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Heading
        size="lg"
        className="mb-8"
        as="h1"
      >
        {slice.primary.heading}
      </Heading>
      {isFilled.richText(slice.primary.description) && (
        <div
          className="prose prose-invert mb-10"
        >
          <PrismicRichText field={slice.primary.description} />
        </div>
      )}

      <ContentList />

    </Bounded>
  );
};

export default ContentIndex;
