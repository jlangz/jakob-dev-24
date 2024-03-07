"use client";
import Bounded from "@/components/Bounded";
import { Content, KeyTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import Shapes from "./Shapes";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {

  const component = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {

      const tl = gsap.timeline()
      tl.fromTo(".name-animation", 
        {
          x: -100,
          opacity: 0,
          rotate: -10
        },
        {
          x: 0,
          opacity: 1,
          rotate: 0,
          duration: 1,
          ease: "elastic.out(1,0.3)",
          transformOrigin: "left top",
          delay: 0.5,
          stagger: {
            each: 0.1,
            from: "random"
          }
        }
      )
      tl.fromTo(".sub-text", 
        {
          y:20,
          opacity: 0,
          scale: 1.35
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "fade.in",
          transformOrigin: "bottom",
        }
      )

    }, component)
    return () => ctx.revert();
  }, [])

  const renderLetters = (name: KeyTextField, key:string): any => {
    if (!name) return;
    return name.split("").map((letter, index) => (
      <span key={index} className={`name-animation name-animation-${key} inline-block opacity-0`}>
        {letter}
      </span>
    ));
  }

  const selectTagLine = (tagLine:KeyTextField) :string | undefined => {
    if (!tagLine) return;
    return tagLine.split(";")[Math.floor(Math.random() * tagLine.split(";").length)];
  }
  
  const [selectedTagLine, setSelectedTagLine] = useState<string | undefined>(
    slice.primary.tag_line ? slice.primary.tag_line.split(";")[0] : undefined
  );

  useEffect(() => {
    const tagLine = selectTagLine(slice.primary.tag_line);
    setSelectedTagLine(tagLine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTagLineClick = (): void => {
    const newTagLine = selectTagLine(slice.primary.tag_line);
    setSelectedTagLine(newTagLine);
  };
  

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <div className="grid min-h=[70vh] grid-cols-1 md:grid-cols-2 items-center">
        <Shapes>
        </Shapes>
        <div className="col-start-1 md:row-start-1">
          <h1 
            className="mb-8 text-[clamp(3rem,20vmin,9rem)] font-extrabold leading-none trackin-tighter" 
            aria-label={slice.primary.first_name + " " + slice.primary.last_name}
          >
            <span className="text-slate-300">
              {renderLetters(slice.primary.first_name, "first")}
            </span>
            <span className="-mt-[.2em] block text-slate-500">
              {renderLetters(slice.primary.last_name, "last")}
            </span>
          </h1>
          <span onClick={handleTagLineClick}
            className="sub-text cursor-pointer block bg-gradient-to-tr from-purple-500 via-sky-300 to-purple-500 bg-clip-text text-2xl font-bold uppercase tracking-[.2em] text-transparent opacity-0 md:text-4xl"
          >
              {selectedTagLine}
          </span>
        </div>
        
      </div>
      
    </Bounded>
  );
};

export default Hero;
