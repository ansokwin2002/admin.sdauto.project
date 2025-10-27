export const formatPageTitle = (pageTitle: string) => {
  return `${pageTitle} | SDAUTO`;
};

export const setPageTitle = (pageTitle: string) => {
  if (typeof document !== 'undefined') {
    document.title = formatPageTitle(pageTitle);
  }
};
