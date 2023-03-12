import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Link from "next/link";
import invariant from "tiny-invariant";
import { PostProps } from ".";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps,
}: AppProps<{ posts: PostProps[] }>) {
  invariant(pageProps.posts, "Please make sure to get posts on all pages");
  const { posts } = pageProps;

  return (
    <div
      className={`${inter.className} grid h-screen`}
      style={{
        gridTemplate: "'a b' 100vh / 18rem 1fr",
      }}
    >
      <nav className="p-9 overflow-auto break-words">
        <h1 className="pb-9">
          <Link href="/">Artist name</Link>
        </h1>
        <ul>
          {posts &&
            posts.map(({ slug, title }) => {
              invariant(slug, "Posts must have a slug");
              return (
                <li key={slug}>
                  <Link href={slug}>{title}</Link>
                </li>
              );
            })}
        </ul>
      </nav>
      <main className="overflow-auto p-9 pb-20 w-full">
        <div className="prose">
          <Component {...pageProps} />
        </div>
      </main>
    </div>
  );
}
