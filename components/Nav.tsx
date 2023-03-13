import { useEffect, useState, useRef, ReactNode } from "react";
import FocusLock from "react-focus-lock";
import Link from "next/link";

const Nav: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close the component when the user presses the escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        isOpen && setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // The following `useEffect` will add `aria-hidden="true"` to every direct child of the `body` element when the modal is opened.
  // This is because `aria-modal` is not yet supported by all browsers (https://a11ysupport.io/tech/aria/aria-modal_attribute).
  // This fixes a bug in certain devices where focus is not trapped correctly such as VoiceOver on iOS.
  // This has been inspired by Reach UI (https://github.com/reach/reach-ui/blob/main/packages/dialog/src/index.tsx)
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const rootNodes: Element[] = [];
    const originalAttrs: (string | null)[] = [];

    const node = document.querySelector("main");
    if (node === dialogRef.current) return;
    const attr = node?.getAttribute("aria-hidden");
    const alreadyHidden = attr !== null && attr !== "false";
    if (alreadyHidden) return;
    node && rootNodes.push(node);
    originalAttrs.push(attr);
    node?.setAttribute("aria-hidden", "true");

    return () => {
      rootNodes.forEach((node, index) => {
        const originalValue = originalAttrs[index];
        if (originalValue === null) {
          node.removeAttribute("aria-hidden");
        } else {
          node.setAttribute("aria-hidden", originalValue);
        }
      });
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.className = "overflow-hidden";
    } else {
      document.body.className = "";
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="fixed bg-white inset-0"></div>}
      <FocusLock
        returnFocus
        disabled={!isOpen}
        className="max-h-screen overflow-auto fixed md:static w-full"
      >
        <div
          id="navigation"
          {...(isOpen
            ? {
                role: "dialog",
                "aria-label": "Main navigation",
                "aria-modal": "true",
              }
            : null)}
          ref={dialogRef}
        >
          <div className="p-4 md:pb-0 break-words bg-white flex justify-between md:static">
            <h3 className="p-5">
              <Link href="/">Artist name</Link>
            </h3>
            <button
              className="p-5 md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="navigation"
            >
              Menu
            </button>
          </div>
          <nav
            className={`p-9 pt-4 break-words bg-white md:block ${
              !isOpen ? "hidden" : ""
            }`}
          >
            <ul>{children}</ul>
          </nav>
        </div>
      </FocusLock>
    </>
  );
};

export { Nav };
