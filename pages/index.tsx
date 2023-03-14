import Head from "next/head";
import { createReader } from "@keystatic/core/reader";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import config from "../keystatic.config";
import { inject } from "@/utils/slugHelpers";
import { InferGetStaticPropsType } from "next";

const reader = createReader("", config);

export type PostProps = InferGetStaticPropsType<
  typeof getStaticProps
>["posts"][number];

export default function Home({
  home,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Keystatic portfolio starter</title>
        <meta name="description" content="Create a portfolio using keystatic" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="prose">
        {home.content && <DocumentRenderer document={home.content} />}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const [postSlugs, index] = await Promise.all([
    await reader.collections.posts.list(),
    await reader.singletons.index.read(),
  ]);

  const [home, ...posts] = await Promise.all([
    { ...index, content: await index?.content() },
    ...postSlugs.map(async (slug) => {
      const post = await inject(slug, reader.collections.posts);
      const content = (await post?.content()) || [];
      return { ...post, content };
    }),
  ]);

  return {
    props: {
      home,
      posts: posts || {},
    },
  };
}
