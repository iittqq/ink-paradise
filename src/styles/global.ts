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

  .chapter-details {
    color: ${({ theme }) => theme.text};
  }

  .folder{
    background-color: ${({ theme }) => theme.elevatedSection};
  }

  .redirect-button {
    background-color: ${({ theme }) => theme.elevatedSection};
  }
  
  .scanlation-button, .language-button {
    background-color: ${({ theme }) => theme.elevatedSection};
  }
  
  .asc-desc-button {
    background-color: ${({ theme }) => theme.elevatedSection};
    color: ${({ theme }) => theme.text};
  }

  .home-category-manga-button{
    outline: 2px solid ${({ theme }) => theme.elevatedSectionLight};
  }

  .loading-icon{
    color: ${({ theme }) => theme.text};
  }
  
  .folder{
    &.MuiButtonBase-root:hover {
      background-color: ${({ theme }) => theme.elevatedSectionLight};
    }
  }

  .manga-details-dialog-button{
    color: ${({ theme }) => theme.elevatedSectionLight};
  }

  /* Add other global styles as needed */
`;
export default withTheme(globalStyle);
