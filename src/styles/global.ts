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


  a, 
  .loading-icon,
  .chapter-details, 
  .folder-description-library, 
  .current-folder-header, 
  .scanlation-button,
  .folder, {
    color: ${({ theme }) => theme.text};
  }

  input[type="search"]:focus,
  .chapter-button, 
  .show-more-button, 
  .folder, 
  .scanlation-button, 
  .language-button, 
  .asc-desc-button, 
  .list-button, 
  .filter-button, 
  .manga-dialog-continue-button, 
  .individual-page-feed-button, 
  .reader-feed-button, 
  .bookmark-button, 
  .settings-button, 
  .home-button, 
  .library-button-reader, 
  .reader-menu-button, 
  .similar-manga-item, 
  .similar-manga-button, 
  .manga-folder-alert-library, 
  .folder-inputs, 
  .manga-folder-alert, 
  .manga-folder-alert-action-bar, 
  .search-inputs,
  .categories-buttons,
   {
    outline: 2px solid ${({ theme }) => theme.elevatedSection};
  }

  .folder, 
  .start-reading-button-dialog {
    outline: 2px solid ${({ theme }) => theme.elevatedSectionLight};
  }

  .library-divider, {
  border: 1px solid ${({ theme }) => theme.elevatedSectionLight};
  }

  .divider-home {
    border: 2px solid ${({ theme }) => theme.elevatedSectionLight}; 
  }

  .redirect-button,
  .redirect-button-library,
  .login-button, 
  .register-button, 
  .back-button, 
  .folder-header-button, 
  .library-header-button,
  .open-library-controls-button,
   {
    background-color: ${({ theme }) => theme.elevatedSection};
    color: ${({ theme }) => theme.text};
  }

  .forgot-password-button, 
  .manga-details-dialog-button, 
  .manga-details-dialog-header, 
  .password-strength-text, 
  .password-strength-results, 
  .individual-details-button, 
  .return-button,
  .manga-name-button,
  , {
    color: ${({ theme }) => theme.elevatedSection};
  }

  .manga-description-header-text,
  .manga-details-header-text-author {
    color: ${({ theme }) => theme.highlighted};
  }

  .manga-details-header-text, 
  .manga-categories-dialog-text, 
  .library-entry-exists-alert-icon, 
  .login-text-field-headers, 
  .register-text-field-headers, 
  .manga-folder-alert-action-bar,
  .bookmark-clicked-dialog-option,{
    color: ${({ theme }) => theme.elevatedSectionLight};
  }

  .header-container, 
  .library-header, 
  .folder-section-header, 
  .carousel-button {
    background-color: ${({ theme }) => theme.body};
  }

 .carousel-button, 
 .controls-icon, 
 .filter-icon, 
.categories-buttons{
    color: ${({ theme }) => theme.text};
  }

  .folder:hover, .open-library-controls-button:hover {
    background-color: ${({ theme }) => theme.elevatedSectionLight};
  }

  p {
    line-height: 1.6;
  }
`;
export default withTheme(globalStyle);
