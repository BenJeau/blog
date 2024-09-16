import { Resvg } from "@resvg/resvg-js";
import type { AstroIntegration } from "astro";
import parseFrontmatter from "gray-matter";
import fs from "node:fs";
import { remark } from "remark";
import remarkParse from "remark-parse";
import satori from "satori";

import { remarkReadingTime } from "./remark-reading-time.mjs";
import { siteDescription, siteTitle } from "./content";

const render = (
  title: string,
  description: string,
  readingTime?: string,
  image?: string,
) => ({
  type: "div",
  props: {
    style: {
      height: "100%",
      width: "100%",
      position: "relative",
      color: "white",
      fontFamily: "Open Sans",
      display: "flex",
    },
    children: [
      image && {
        type: "img",
        props: {
          src: image,
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            objectFit: "cover",
          },
        },
      },
      {
        type: "div",
        props: {
          style: {
            backgroundColor: "black",
            opacity: image ? 0.8 : 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
        },
      },
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            padding: 55,
            gap: 55,
            justifyContent: "space-between",
          },
          children: [
            {
              type: "div",
              props: {
                style: { display: "flex", gap: 32, alignItems: "center" },
                children: [
                  {
                    type: "svg",
                    props: {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "96",
                      height: "96",
                      viewBox: "0 0 256 256",
                      fill: "none",
                      children: [
                        {
                          type: "rect",
                          props: {
                            width: "256",
                            height: "256",
                            fill: "white",
                          },
                        },
                        {
                          type: "path",
                          props: {
                            d: "M83 119H101V92H83V119ZM101 128H83V164H101V128ZM56 164H65V92H56V83H110V92H119V119H110V128H119V164H110V173H56V164ZM164 83H200V92H191V164H182V173H146V164H137V137H155V164H173V92H164V83Z",
                            fill: "black",
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        gap: 0,
                      },
                      children: [
                        {
                          type: "p",
                          props: {
                            style: {
                              fontSize: 32,
                              fontFamily: "Open Sans Bold",
                              margin: 0,
                            },
                            children: siteTitle,
                          },
                        },
                        {
                          type: "p",
                          props: {
                            style: {
                              fontSize: 32,
                              fontFamily: "Open Sans",
                              margin: 0,
                            },
                            children: readingTime,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              type: "div",
              props: {
                style: { display: "flex", flexDirection: "column", gap: 8 },
                children: [
                  {
                    type: "p",
                    props: {
                      style: {
                        fontSize: 72,
                        fontFamily: "Open Sans Bold",
                        lineHeight: 1.2,
                      },
                      children: title,
                    },
                  },
                  {
                    type: "p",
                    props: {
                      style: {
                        fontSize: 32,
                        fontFamily: "Open Sans",
                      },
                      children: description,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
});

const prepareAstroFrontmatter = () => (tree: any, file: any) => {
  file.data.astro = file.data.astro || {};
  file.data.astro.frontmatter = file.data.astro.frontmatter || {};
};

const processMarkdown = async (content: string) => {
  const result = await remark()
    .use(remarkParse)
    .use(prepareAstroFrontmatter)
    .use(remarkReadingTime)
    .process(content);

  return result.data;
};

const extractMarkdownInformation = async (pathname: string) => {
  if (pathname === "/" || pathname === "") {
    return {
      title: "Home",
      description: siteDescription,
    };
  }

  const filePath = `src/content/blogs/${pathname.slice(0, -1)}.md`;
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseFrontmatter(fileContent);

  const remarkData = (await processMarkdown(content)) as {
    astro: {
      frontmatter: {
        minutesRead: string;
      };
    };
  };

  let image = undefined;
  if (data.cover) {
    const imagePath = `src/content/blogs/${data.cover.slice(2)}`;
    const imageData = fs.readFileSync(imagePath);
    image = `data:image/png;base64,${imageData.toString("base64")}`;
  }

  return {
    title: data.title,
    description: data.description,
    readingTime: remarkData.astro.frontmatter.minutesRead,
    image,
  };
};

export const og = (): AstroIntegration => ({
  name: "satori-og",
  hooks: {
    "astro:build:done": async ({ dir, pages, logger }) => {
      try {
        const openSans = fs.readFileSync(
          "src/assets/fonts/OpenSans-Regular.ttf",
        );
        const openSansBold = fs.readFileSync(
          "src/assets/fonts/OpenSans-Bold.ttf",
        );

        for (const { pathname } of pages) {
          logger.info(`Generating OpenGraph image for path "/${pathname}"`);

          const { title, description, readingTime, image } =
            await extractMarkdownInformation(pathname);

          const svg = await satori(
            render(title, description, readingTime, image),
            {
              width: 1200,
              height: 630,
              fonts: [
                {
                  name: "Open Sans",
                  data: openSans,
                  weight: 400,
                  style: "normal",
                },
                {
                  name: "Open Sans Bold",
                  data: openSansBold,
                  weight: 700,
                  style: "normal",
                },
              ],
            },
          );

          const resvg = new Resvg(svg, {
            fitTo: {
              mode: "width",
              value: 1200,
            },
          });

          const pngBuffer = resvg.render().asPng();
          const pngUint8Array = new Uint8Array(pngBuffer);
          fs.writeFileSync(`${dir.pathname}${pathname}og.png`, pngUint8Array);
        }

        logger.info("Generated OpenGraph images");
      } catch (e) {
        console.error(e);
        logger.error("OpenGraph image generation failed");
      }
    },
  },
});
