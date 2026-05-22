export type LayoutRow = number[];

export const getAlbumLayout = (count: number): LayoutRow[] => {
  switch (count) {
    case 2:
      return [[0, 1]];
    case 4:
      return [
        [0, 1],
        [2, 3],
      ];
    case 5:
      return [
        [0, 1],
        [2, 3, 4],
      ];
    case 6:
      return [
        [0, 1, 2],
        [3, 4, 5],
      ];
    case 7:
      return [
        [0, 1],
        [2, 3],
        [4, 5, 6],
      ];
    case 8:
      return [
        [0, 1],
        [2, 3, 4],
        [5, 6, 7],
      ];
    case 9:
      return [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ];
    case 10:
      return [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8, 9],
      ];
    default:
      return [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8, 9],
      ];
  }
};
