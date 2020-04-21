import { PointOffset, Point, Direction } from './interfaces';

export const getTwoPointDistance = (po: PointOffset):number => {
  return Math.sqrt(po.deltaX * po.deltaX + po.deltaY * po.deltaY);
}

export const packTouchToPoint = (t: Touch): Point => {
  return {
    x: t.pageX,
    y: t.pageY,
  };
}

const getCosAngleValue = (po1: PointOffset, po2: PointOffset): number => {
  const mr = getTwoPointDistance(po1) * getTwoPointDistance(po2);
  if (mr === 0) {
    return 0;
  }
  let r = (po1.deltaX * po2.deltaX + po1.deltaY * po2.deltaY) / mr;
  if (r > 1) {
    r = 1;
  }
  return Math.acos(r);
}

export const getAngle = (po1: PointOffset, po2: PointOffset): number => {
  let angle = getCosAngleValue(po1, po2);
  if (po1.deltaX * po2.deltaY - po2.deltaX * po1.deltaY > 0) {
    angle *= -1;
  }
  return angle * 180 / Math.PI;
}

export const getDirection = (begin: Point, end: Point): Direction  => {
  const horizontal: 'left' | 'right' = end.x > begin.x ? 'right' : 'left';
  const vertical: 'down' | 'up' = end.y > begin.y ? 'down' : 'up';
  if (end.x !== begin.x) {
    const tanAngle = (end.y - begin.y) / (end.x - begin.x);
    const angle = Math.abs(Math.atan(tanAngle) * 180 / Math.PI);
    if (angle > 15 && angle < 75) {
      const direction = vertical + horizontal.slice(0, 1).toUpperCase() + horizontal.slice(1);
      if (checkDirection(direction)) {
        return direction;
      } else {
        return '';
      }
    } else if (angle <= 15) {
      return horizontal;
    }
  }
  return vertical;
}

const checkDirection = (str: string):str is Direction => {
  const directionValidValue = [
    'left',
    'right',
    'up',
    'down',
    'upLeft',
    'upRight',
    'downLeft',
    'downRight',
  ];
  return directionValidValue.indexOf(str) > -1;
}