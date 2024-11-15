export interface ThemeProps {
  body: string;
  text: string;
  elevatedSection: string;
  elevatedSectionLight: string;
  hightlighted: string;
}

export const lightTheme = {
  body: "#fffae0 ",
  text: "#363537",
  elevatedSection: "#8ab192 ",
  elevatedSectionLight: "#d5e3d8",
  highlighted: "#ff7e67",
};

export const darkTheme = {
  body: "#191919",
  text: "#FAFAFA",
  elevatedSection: "#ABB896",
  elevatedSectionLight: "#EEBEC6",
  highlighted: "#ff7e67",
};

export const lightPastelTheme = {
  body: "#B0B5ED",
  text: "#191919",
  elevatedSection: "#B8DBE5",
  elevatedSectionLight: "#dadaf1",
  highlighted: "#ff7e67",
};

export const darkPastelTheme = {
  body: "#191919",
  text: "#FAFAFA",
  elevatedSection: "#9095d6",
  elevatedSectionLight: "#b6c0b9",
  highlighted: "#ff7e67",
};

export const devTheme = {
  body: "#131313",
  text: "#FAFAFA",
  elevatedSection: "#705f8c",
  elevatedSectionLight: "#3a3a3a",
  highlighted: "#ff7e67",
};
