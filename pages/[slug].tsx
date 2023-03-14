import Head from "next/head";
import { createReader } from "@keystatic/core/reader";
import config from "../keystatic.config";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import { inject } from "@/utils/slugHelpers";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import invariant from "tiny-invariant";

const reader = createReader("", config);

export type PostProps = InferGetStaticPropsType<
  typeof getStaticProps
>["posts"][number];

export default function Home({
  posts,
  slug,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const post = posts.find((el) => el.slug === slug);
  invariant(post, "Unable to match slug to post in array");
  console.log(post);

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.summary} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ul className="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 mb-16">
        {post.images?.map(
          (el) =>
            el.image && (
              <li>
                <img
                  src={`/${post.slug}/${el.image}`}
                  alt={el.alt}
                  key={el.image}
                />
              </li>
            )
        )}
      </ul>
      <div className="prose">
        {post.content && <DocumentRenderer document={post.content} />}
      </div>
    </>
  );
}

export async function getStaticPaths(params: GetStaticPropsContext) {
  const postSlugs = await reader.collections.posts.list();
  const posts = await Promise.all(
    postSlugs.map(async (slug) => {
      const post = await inject(slug, reader.collections.posts);
      return { ...post };
    })
  );
  const paths = posts.map(({ slug }) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const [postSlugs] = await Promise.all([
    await reader.collections.posts.list(),
  ]);

  const [...posts] = await Promise.all([
    ...postSlugs.map(async (slug) => {
      const post = await inject(slug, reader.collections.posts);
      const content = (await post?.content()) || [];
      return { ...post, content };
    }),
  ]);

  return {
    props: {
      slug: context.params?.slug,
      posts: posts || {},
    },
  };
}
