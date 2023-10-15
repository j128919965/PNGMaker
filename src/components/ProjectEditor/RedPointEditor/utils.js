import {EditorHeight, EditorWidth, RedPointSize} from "../../../data/constants";
import {Position} from "../../../data/ProjectMetadata";

export const getLeftTopPosition = (w, h, p) => {
  const scaleW = w / EditorWidth
  const scaleH = h / EditorHeight

  let pattern = p.pattern;
  let pw = pattern.width
  let ph = pattern.height

  let position
  let x = p.position.x;
  let y = p.position.y;
  switch (p.pattern.align) {
    case 1:
      position = new Position(x - RedPointSize, y - RedPointSize)
      break
    case 2:
      position = new Position(x, y)
      break
    case 3:
      position = new Position(x - (pw / 2), y - (ph / 2))
      break
    case 4:
      position = new Position(x + RedPointSize - pw, y + RedPointSize - ph)
      break
    case 5:
      position = new Position(x - pw, y - ph)
      break
    default:
      throw new Error("小红点的对其方式不对")
  }
  position.x *= scaleW
  position.y *= scaleH

  return {
    leftTopPosition: position,
    pw: pw * scaleW,
    ph: ph * scaleH
  }
}
