import { createGlobalStyle, withTheme } from "styled-components";
import { ThemeProps } from "./themes";

type GlobalThemeProps = {
  theme: ThemeProps;
};

const globalStyle = createGlobalStyle`
   body {
    background-color: ${({ theme }: GlobalThemeProps) => theme.body};
    color: ${({ theme }: GlobalThemeProps) => theme.text} !important;
    font-family: 'Arial', sans-serif;
    transition: background-color 0.5s linear, color 0.5s linear;
  }

  a {
    color: ${({ theme }: GlobalThemeProps) => theme.text};
    text-decoration: none;
  }

  p {
    line-height: 1.6;
  }

  input[type="search"]:focus {
    border: 2px solid ${({ theme }) => theme.text} !important;
  }

  .input-field {
    input {
      color: ${({ theme }) => theme.text};
    }
  }

  .chapter-button, .show-more-button {
    background-color: ${({ theme }) => theme.elevatedSection};
  }

  .folder{
    background-color: ${({ theme }) => theme.elevatedSection};
  }

  .redirect-button {
    background-color: ${({ theme }) => theme.elevatedSection};
  }


  /* Add other global styles as needed */
`;
export default withTheme(globalStyle);
