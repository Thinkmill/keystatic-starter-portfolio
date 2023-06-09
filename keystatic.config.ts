import {
  collection,
  config,
  fields,
  GitHubConfig,
  LocalConfig,
  singleton,
} from "@keystatic/core";
import { field } from "./custom-field";

const storage: LocalConfig["storage"] | GitHubConfig["storage"] =
  process.env.NODE_ENV === "development"
    ? { kind: "local" }
    : {
        kind: "github",
        repo: {
          owner: 'JPrisk',
          name: 'keystatic-starter-portfolio',
        },
      };

export default config({
  storage,
  singletons: {
    index: singleton({
      label: "Home",
      path: "content/pages/home/",
      schema: {
        color: field({
          label: "Color"
        }),
        content: fields.document({
          label: "Content",
          formatting: true,
        }),
      },
    }),
  },
  collections: {
    posts: collection({
      label: "Posts",
      path: "content/posts/*/",
      slugField: "title",
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            validation: {
              length: {
                min: 1,
              },
            },
          },
        }),
        summary: fields.text({
          label: "Summary",
          validation: { length: { min: 4 } },
        }),
        publishedDate: fields.date({ label: "Published Date" }),
        images: fields.array({
          ...fields.object({
            image: fields.image({ label: "Image", directory: "public" }),
            alt: fields.text({ label: "Alt text" }),
          }),
        }),
        content: fields.document({
          label: "Content",
          formatting: true,
        }),
      },
    }),
  },
});
