import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="manifest.json" />
          <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
          <link rel="apple-touch-icon" href="ios\152.png" />
        </Head>
        <body className="bg-palette-green-light">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
