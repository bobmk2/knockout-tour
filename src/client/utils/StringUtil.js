export const toMinSecStr = (sec) => {
  let _isMinus = false;
  if (sec < 0) {
    _isMinus = true;
    sec *= -1;
  }

  const _sec = sec % 60;
  const _min = (sec - _sec) / 60;
  return `${_isMinus ? '-' : ''}${_min}:${('00' + _sec).slice(-2)}`;
};
