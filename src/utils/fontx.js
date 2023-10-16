const supportFont = (font) => {
//    f是要检测的字体
  if (typeof font != "string") {
    return false
  }
  let h = "Arial";
  if (font.toLowerCase() === h.toLowerCase()) {
    return true
  }
  let e = "a";
  let d = 100;
  let a = 100,
    i = 100;
  let c = document.createElement("canvas");
  let b = c.getContext("2d");
  c.width = a;
  c.height = i;
  b.textAlign = "center";
  b.fillStyle = "black";
  b.textBaseline = "middle";
  let g =  (j) => {
    b.clearRect(0, 0, a, i);
    b.font = d + "px " + j + ", " + h;
    b.fillText(e, a / 2, i / 2);
    let k = b.getImageData(0, 0, a, i).data;
    return [].slice.call(k).filter(function (l) {
      return l !== 0
    });
  };
  let ret = g(h).join("") !== g(font).join("");
  return ret;
};

export default {
  supportFont
}