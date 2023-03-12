import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${inter.className} grid h-screen`}
      style={{
        gridTemplate: "'a b' 100vh / 18rem 1fr",
      }}
    >
      <nav className="p-9 overflow-auto">
        <h1 className="pb-9">Artist name</h1>
        <ul>
          <li>hello</li>
          <li>
            <button>test</button>
          </li>
        </ul>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}
