export const transformMatrix = (arr: any) => {
  return arr[0]?.map((_: any, colIndex: any) =>
    arr?.map((row: any) => row[colIndex])
  );
};

export const calculateUtility = ({
  value,
  min,
  max,
  type,
}: {
  value: number;
  min: number;
  max: number;
  type: 'benefit' | 'cost';
}) => {
  let result;
  if (type === 'benefit') {
    result = (value - min) / (max - min);
  } else if (type === 'cost') {
    result = (max - value) / (max - min);
  }

  return result;
};

export function truncateTextWithEllipsis(text: string) {
  if (text.length > 60) {
    return text.substring(0, 60) + '...';
  }
  return text;
}
