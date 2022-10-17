// const Server = 'http://localhost:8080/agapi'
const Server = 'http://101.35.11.84:9898/agapi'

const urls = {
  projects: {
    getAll: Server + '/proj/all',
    getById: Server + '/proj/getById',
    create: Server + '/proj/new',
    save: Server + '/proj/save',
    del: Server + '/proj/delete'
  },
  files: {
    upload: Server + '/file'
  },
  input: {
    create: Server + '/input/new',
    getAllByProject: Server + '/input/by-proj',
    getNotRenderedByProject: Server + '/input/by-proj/no-rendered',
    del: Server + '/input/delete',
    setRendered: Server + '/input/set-rendered'
  },
  users: {
    login: Server + '/user/login',
    register: Server + '/user/register',
    role : Server + '/user/role'
  },
  roleAsks :{
    create : Server + '/roleask/new',
    handle : Server + '/roleask/handle',
    getAllNotHandled : Server + '/roleask/not-handled',
  }
}
/*完了，我不知道这些接口都是干嘛的（挠头 哪个才是*/
export default urls

