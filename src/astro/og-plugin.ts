import { Resvg } from "@resvg/resvg-js";
import type { AstroIntegration } from "astro";
import parseFrontmatter from "gray-matter";
import fs from "node:fs";
import { remark } from "remark";
import remarkParse from "remark-parse";
import satori from "satori";

import { remarkReadingTime } from "../remark-reading-time.mjs";
import { siteDescription } from "../content";
import { render } from "./og-render";

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
