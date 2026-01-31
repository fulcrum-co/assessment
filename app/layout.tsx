import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Organizational Leverage Diagnostic | Fulcrum Collective",
  description: "Assess your organization's operational leverage across six key dimensions and receive a personalized strategic report.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon-32x32.png" },
    ],
  },
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
