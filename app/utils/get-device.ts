function getDeviceTypeByResolution() {
  if (window.matchMedia('(max-width: 767px)').matches) return 'mob';
  if (window.matchMedia('(max-width: 1023px)').matches) return 'pad';
  return 'pc';
}

export { getDeviceTypeByResolution };