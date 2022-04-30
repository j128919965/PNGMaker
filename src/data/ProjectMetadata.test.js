import {FontPattern, PicturePattern, Position, ProjectMetadata, RedPoint} from "./ProjectMetadata";

test("generate new Position" , ()=>{
  let pos = Position.default()
  let expected = new Position()
  expected.x = 0
  expected.y = 0
  expect(pos).toStrictEqual(expected)
})

test("generate Position from null" , ()=>{
  let obj = undefined
  let pos = Position.fromObj(obj)
  let expected = new Position()
  expected.x = 0
  expected.y = 0
  expect(pos).toStrictEqual(expected)
})

test("generate Position from obj" , ()=>{
  let obj = {x:230}
  let pos = Position.fromObj(obj)
  let expected = new Position()
  expected.x = 230
  expected.y = 0
  expect(pos).toStrictEqual(expected)
})

test("generate new FontPattern" , ()=>{
  let pattern = FontPattern.default()
  let expected = new FontPattern()
  expected.align = 1
  expected.fontType = '宋体'
  expected.fontSize = 16
  expected.bold = false
  expected.italic = false
  expect(pattern).toStrictEqual(expected)
})

test("generate FontPattern from null",()=>{
  let obj = null
  let pattern = FontPattern.fromObj(obj)
  let expected = new FontPattern()
  expected.align = 1
  expected.fontType = '宋体'
  expected.fontSize = 16
  expected.bold = false
  expected.italic = false
  expect(pattern).toStrictEqual(expected)
})


test("generate FontPattern from obj",()=>{
  let obj = {align:3,fontType:'楷体'}
  let pattern = FontPattern.fromObj(obj)
  let expected = new FontPattern()
  expected.align = 3
  expected.fontType = '楷体'
  expected.fontSize = 16
  expected.bold = false
  expected.italic = false
  expect(pattern).toStrictEqual(expected)
})


test("generate new PicturePattern" , ()=>{
  let pattern = PicturePattern.default()
  let expected = new PicturePattern()
  expected.align = 1
  expected.width = 100
  expected.height = 100
  expect(pattern).toStrictEqual(expected)
})

test("generate PicturePattern from null" , ()=>{
  let obj = undefined
  let pattern = PicturePattern.fromObj(obj)
  let expected = new PicturePattern()
  expected.align = 1
  expected.width = 100
  expected.height = 100
  expect(pattern).toStrictEqual(expected)
})

test("generate PicturePattern from obj" , ()=>{
  let obj = {align:5,width:350,height:120}
  let pattern = PicturePattern.fromObj(obj)
  let expected = new PicturePattern()
  expected.align = 5
  expected.width = 350
  expected.height = 120
  expect(pattern).toStrictEqual(expected)
})

test("generate wrong Pattern from obj" , ()=>{
  let obj = {align:10,width:350,height:120}
  expect(()=>PicturePattern.fromObj(obj)).toThrow("对齐方式错误！")
})

test("generate new RedPoint",()=>{
  let point = RedPoint.default(1)
  let expected = new RedPoint()
  expected.id = 1
  expected.type = 1
  expected.pattern = FontPattern.default()
  expected.position = Position.default()
  expect(point).toStrictEqual(expected)
})

test("generate font RedPoint from obj",()=>{
  let obj = {
    id:1,
    position:{x:100,y:500},
    pattern:{
      align:3,fontType:'楷体'
    }
  }
  let point = RedPoint.fromObj(obj)
  let expected = new RedPoint()
  expected.id = 1
  expected.type = 1
  expected.pattern = FontPattern.fromObj(obj.pattern)
  expected.position = Position.fromObj(obj.position)
  expect(point).toStrictEqual(expected)
})


test("generate new ProjectMetadata" , ()=>{
  let proj = ProjectMetadata.default(1)
  let expected = new ProjectMetadata();
  expected.id = 1;
  expected.name = "项目 1"
  expected.points = []
  expect(proj).toStrictEqual(expected)
})


test("generate  ProjectMetadata from obj" , ()=>{
  let obj = {
    id:2,
    name:"无语了",
    points : [
      {
        id:3,
        position:{x:100,y:500},
        pattern:{
          align:3,fontType:'楷体'
        }
      }
    ]
  }
  let proj = ProjectMetadata.fromObj(obj)
  let expected = new ProjectMetadata();
  expected.id = 2;
  expected.name = "无语了"
  expected.points = [RedPoint.fromObj(obj.points[0])]
  expect(proj).toStrictEqual(expected)
})
