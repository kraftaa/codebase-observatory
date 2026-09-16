import type { Metadata } from "next";
import { Observatory } from "./observatory";

export const metadata: Metadata = {
  title: "Codebase Observatory",
  description:
    "A visual observatory for understanding large codebases through architecture, history, risk, ownership, and blast radius.",
};

export default function Home() {
  return <Observatory />;
}
