import { createReader } from "@keystatic/core/reader";
import config from "../keystatic.config";

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
      const post = await reader.collections.posts.readOrThrow(slug, {
        resolveLinkedFiles: true,
      });
      return { ...post, slug };
    }),
  ]);

  return {
    props: {
      posts: posts || [],
    },
  };
}

export default notFound;
