export const formatToOptions = (data) => {
  if (!data || !data?.categorias) return [];

  const filterCategorias = data?.categorias?.map((item) => {
    return {
      label: item?.nombre,
      value: item?.id,
    };
  });
  return filterCategorias;
};
