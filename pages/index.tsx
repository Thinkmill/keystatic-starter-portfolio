import Head from "next/head";
import { createReader } from "@keystatic/core/reader";
import config from "../keystatic.config";
import { inject } from "@/utils/slugHelpers";
import { InferGetStaticPropsType } from "next";

const reader = createReader("", config);

export type PostProps = InferGetStaticPropsType<
  typeof getStaticProps
>["posts"][number];

export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-9 w-full">x</main>
    </>
  );
}

export async function getStaticProps() {
  const postSlugs = await reader.collections.posts.list();
  const posts = await Promise.all(
    postSlugs.map(async (slug) => {
      const post = await inject(slug, reader.collections.posts);
      const content = (await post?.content()) || [];
      return { ...post, content };
    })
  );

  return {
    props: {
      posts: posts || {},
    },
  };
}
