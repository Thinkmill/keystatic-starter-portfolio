import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Link from "next/link";
import invariant from "tiny-invariant";
import { PostProps } from ".";
import { useRouter } from "next/router";
import { Nav } from "@/components/Nav";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps,
}: AppProps<{ posts: PostProps[] }>) {
  // invariant(pageProps.posts, "Please make sure to get posts on all pages");
  const { asPath } = useRouter();
  const { posts } = pageProps;
  return (
    <div
      className={`${inter.className} grid md:h-screen grid-template text-neutral-900`}
      key={asPath}
    >
      <Nav>
        {posts &&
          posts.map(({ slug, title }) => {
            invariant(slug, "Posts must have a slug");
            return (
              <li key={slug}>
                <Link href={slug} className="md:hover:opacity-75">
                  {title}
                </Link>
              </li>
            );
          })}
      </Nav>
      <main className="overflow-auto px-6 md:px-9 py-32 md:pt-9 md:pb-20 w-full">
        <div className="prose">
          <Component {...pageProps} />
        </div>
      </main>
    </div>
  );
}
