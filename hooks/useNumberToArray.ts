const useNumberToArray = (n: number) =>
  Array.from({ length: n }, (_, i) => i + 1)

export default useNumberToArray
