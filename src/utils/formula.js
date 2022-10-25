class ExecResult {
  s = true
  d = ''
  m = ''

  constructor(s, d, m) {
    this.s = s
    this.d = d
    this.m = m
  }
}

const str = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function generateMixed(n) {
  let res = "";
  for (let i = 0; i < n; i++) {
    let id = Math.ceil(Math.random() * 35);
    res += str[id];
  }
  return res;
}

/**
 *
 * @param point {RedPoint}
 * @param defaultValue {string}
 * @returns ExecResult
 */
const exec = (point, defaultValue) => {
  const date = new Date().toLocaleDateString().split("/")
  const now = {
    year: parseInt(date[0]),
    month: parseInt(date[1]),
    day: parseInt(date[2])
  }
  const uuid = (n) => generateMixed(n)
  try {
    let input = '`' + (defaultValue == null ? point.defaultValue : defaultValue) + '`'
    let d = eval(input)
    return new ExecResult(true, d)
  } catch (e) {
    return new ExecResult(false, null, e.message)
  }
}

export default {
  exec
}