export const formatPageTitle = (pageTitle: string) => {
  return `${pageTitle} | EatlyPOS`;
};

export const setPageTitle = (pageTitle: string) => {
  if (typeof document !== 'undefined') {
    document.title = formatPageTitle(pageTitle);
  }
};
