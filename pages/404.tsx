import { createReader } from "@keystatic/core/reader";
import config from "../keystatic.config";
import { inject } from "@/utils/slugHelpers";

const reader = createReader("", config);

const notFound = () => {
  return (
    <>
      <h1>404</h1>
      <h2>This page could not be found</h2>
    </>
  );
};

export async function getStaticProps() {
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
      posts: posts || {},
    },
  };
}

export default notFound;
