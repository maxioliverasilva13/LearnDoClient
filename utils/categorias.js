export const formatToOptions = (data) => {
  if (!data) return [];

  const filterCategorias = data?.map((item) => {
    return {
      label: item?.nombre,
      value: item?.id,
    };
  });
  return filterCategorias;
};
