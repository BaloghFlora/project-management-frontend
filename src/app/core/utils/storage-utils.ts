export const isLocalStorageAvailable = () => {
  return typeof window !== 'undefined' && window.localStorage
}
