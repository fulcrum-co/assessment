import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Organizational Leverage Diagnostic | Fulcrum Collective",
  description: "Assess your organization's operational leverage across six key dimensions and receive a personalized strategic report.",
  openGraph: {
    title: "Organizational Leverage Diagnostic | Fulcrum Collective",
    description: "Assess your organization's operational leverage across six key dimensions and receive a personalized strategic report.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
