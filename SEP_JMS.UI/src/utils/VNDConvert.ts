export const convertVND = (vnd: number | undefined): string => {
  if (!vnd) return "0";
  if (vnd < 1000) return vnd + " đồng";
  if (vnd < 1000000) {
    return (vnd / 1000).toFixed(0).replace(/\.0+$/, "") + " nghìn VND";
  } else if (vnd >= 1000000 && vnd < 100000000) {
    return (vnd / 1000000).toFixed(2).replace(/\.0+$/, "") + " triệu VND";
  } else if (vnd >= 100000000 && vnd < 1000000000) {
    return (vnd / 1000000).toFixed(1).replace(/\.0+$/, "") + " triệu VND";
  } else if (vnd >= 1000000000) {
    return (vnd / 1000000000).toFixed(2).replace(/\.0+$/, "") + " tỷ VND";
  }
  return "...";
};
