const Server = 'http://localhost:8080/agapi'
// const Server = 'http://101.35.11.84:9898'

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
  }
}

export default urls

