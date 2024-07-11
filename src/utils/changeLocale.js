export default (l, router) => {
  if (l !== router.locale) {
    router.push(
      {
        pathname: router.pathname,
        query: router.query
      },
      router.asPath,
      { locale: l }
    );
  }
};
