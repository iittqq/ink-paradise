import { createGlobalStyle, withTheme } from "styled-components";
import { ThemeProps } from "./themes";

type GlobalThemeProps = {
  theme: ThemeProps;
};

const globalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }: GlobalThemeProps) => theme.body};
    color: ${({ theme }: GlobalThemeProps) => theme.text} !important;
    font-family: 'Figtree', sans-serif !important;
    scrollbar-width: none;
    -ms-overflow-style: none;
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
    outline: 2px solid ${({ theme }) => theme.elevatedSection};
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
    outline: 2px solid ${({ theme }) => theme.elevatedSectionLight};
  }
  
  .asc-desc-button {
    outline: 2px solid ${({ theme }) => theme.elevatedSectionLight};
    color: ${({ theme }) => theme.text};
  }

  .home-category-manga-button{
    outline: 2px solid ${({ theme }) => theme.elevatedSectionLight};
  }

  .loading-icon, .loading-{
    color: ${({ theme }) => theme.text};
  }
  
  .folder{
    &.MuiButtonBase-root:hover {
      background-color: ${({ theme }) => theme.elevatedSectionLight};
    }
  }

  .manga-details-dialog-button, .manga-details-dialog-header{
    color: ${({ theme }) => theme.elevatedSectionLight};
  }

  .manga-description-header-text{
    color: ${({ theme }) => theme.elevatedSectionLight};
  }
  
  .manga-details-header-text-author{
    color: ${({ theme }) => theme.elevatedSectionLight};
  }
  
  .manga-details-color-text{
    color: ${({ theme }) => theme.elevatedSection};
  }

  .login-button, .register-button{
    background-color: ${({ theme }) => theme.elevatedSection};
    color: ${({ theme }) => theme.text};
  }

  .forgot-password-button{
    color: ${({ theme }) => theme.elevatedSection};
  }

  .register-header, .login-header{
    color: ${({ theme }) => theme.elevatedSection};
  }

  .back-button{
    background-color: ${({ theme }) => theme.elevatedSection};
    color: ${({ theme }) => theme.text};
  }

  .password-strength-text{
    color: ${({ theme }) => theme.elevatedSection};
  }

  .password-strength-results{
    color: ${({ theme }) => theme.elevatedSection};
  }

  .login-text-field-headers, .register-text-field-headers{
    color: ${({ theme }) => theme.elevatedSectionLight};
  }

  .list-button{
    outline: 2px solid ${({ theme }) => theme.elevatedSectionLight};
  }

  .return-button{
    color: ${({ theme }) => theme.elevatedSectionLight} !important;
  }

  .manga-dialog-continue-button{
    outline: 2px solid ${({ theme }) => theme.elevatedSection};
    color: ${({ theme }) => theme.text};
  }

  .reader-feed-button, .bookmark-button, .settings-button, .home-button{
    outline: 2px solid ${({ theme }) => theme.elevatedSection};
  }

  .similar-manga-item{
    outline: 2px solid ${({ theme }) => theme.elevatedSectionLight};
  }

  .similar-manga-button{
    outline: 2px solid ${({ theme }) => theme.elevatedSectionLight};
  }


  /* Add other global styles as needed */
`;
export default withTheme(globalStyle);
