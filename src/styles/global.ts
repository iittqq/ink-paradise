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
    outline: 2px solid ${({ theme }) => theme.elevatedSectionLight};
    color: ${({ theme }) => theme.text};
  }

  .redirect-button {
    background-color: ${({ theme }) => theme.elevatedSection};
  }
  
  .scanlation-button, .language-button {
    outline: 2px solid ${({ theme }) => theme.elevatedSectionLight};
  }
  
  .asc-desc-button {
    outline: 2px solid ${({ theme }) => theme.elevatedSectionLight};
    color: ${({ theme }) => theme.text} !important;
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
    color: ${({ theme }) => theme.elevatedSection};
  }

  .manga-description-header-text{
    color: ${({ theme }) => theme.highlighted};
  }
  
  .manga-details-header-text-author{
    color: ${({ theme }) => theme.highlighted};
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

  .list-button, .filter-button{
    outline: 2px solid ${({ theme }) => theme.elevatedSectionLight};
  }

  .return-button{
    color: ${({ theme }) => theme.elevatedSectionLight} !important;
  }

  .manga-dialog-continue-button{
    outline: 2px solid ${({ theme }) => theme.elevatedSection};
    color: ${({ theme }) => theme.text};
  }

  .reader-feed-button, .bookmark-button, .settings-button, .home-button, .library-button-reader, .reader-menu-button{
    outline: 2px solid ${({ theme }) => theme.elevatedSection};
  }

  .similar-manga-item{
    outline: 2px solid ${({ theme }) => theme.elevatedSectionLight};
  }

  .similar-manga-button{
    outline: 2px solid ${({ theme }) => theme.elevatedSectionLight};
  }

  .bookmark-clicked-dialog-option{
    color: ${({ theme }) => theme.elevatedSectionLight};
  }

  .individual-details-button{
    color: ${({ theme }) => theme.elevatedSection};
  }

  .manga-categories-dialog-text, .manga-details-header-text{
    color: ${({ theme }) => theme.elevatedSectionLight};
  }

  .library-entry-exists-alert-icon{
    color: ${({ theme }) => theme.elevatedSectionLight};
  }

  .header-container{
    background-color: ${({ theme }) => theme.body};
  }

  .carousel-button{
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }

  .folder-header-button, .library-header-button{
    background-color: ${({ theme }) => theme.elevatedSection};
  }

  .controls-icon, .filter-icon {
    color: ${({ theme }) => theme.elevatedSection};
  }

  .library-divider{
    border: 1px solid ${({ theme }) => theme.elevatedSection};
  }

  .manga-folder-alert-library, .folder-inputs, .manga-folder-alert, .manga-folder-alert-action-bar, .search-inputs{
    outline: 1px solid ${({ theme }) => theme.elevatedSection};
  }

  .folder-description-library, .current-folder-header, .scanlation-button{
    color: ${({ theme }) => theme.text};
  }

  .library-header, .folder-section-header{
    background-color: ${({ theme }) => theme.body};
  }

  /* Add other global styles as needed */
`;
export default withTheme(globalStyle);
