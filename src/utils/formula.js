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
 * 执行公式
 * @param defaultValue {string} 要执行的公式
 * @param point {RedPoint} 输入项
 * @param project {ProjectMetadata} 项目
 * @param result {InputDataLoadResult}
 * @returns ExecResult
 */
const exec = (defaultValue, point, project, result) => {
  const date = new Date().toLocaleDateString().split("/")
  const now = {
    year: parseInt(date[0]),
    month: parseInt(date[1]),
    day: parseInt(date[2])
  }
  const uuid = (n) => generateMixed(n)

  const points = {}
  project?.points.forEach(p => points[p.id] = {
    id: p.id,
    label: p.label?.length > 0 ? p.label : '未命名输入',
    value: null
  })

  result?.data.filter(d => points[d.pointId] != null).forEach(d => {
    points[d.pointId].value = d.data
  })

  Object.keys(points).forEach(key => {
    let id = parseInt(key)
    if (points[id].value == null) {
      points[id].value = `输入${id}的示例数据`
    }
  })

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