import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/raleway/600.css";
import PageContainer from "../components/PageContainer";
import NavBar from "../components/NavBar";
import { Web3ContextProvider } from "../contexts/Web3Context";

export default function App({ Component, pageProps }: AppProps) {
  const theme = extendTheme({
    fonts: {
      styledFont: `'Raleway', sans-serif`,
    },
    components: {
      Text: {
        baseStyle: {
          fontFamily: `styledFont, sans-serif`,
        },
      },
      Button: {
        baseStyle: {
          fontFamily: `styledFont, sans-serif`,
        },
      },
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <Web3ContextProvider>
        <PageContainer>
          <NavBar />
          <Component {...pageProps} />
        </PageContainer>
      </Web3ContextProvider>
    </ChakraProvider>
  );
}
