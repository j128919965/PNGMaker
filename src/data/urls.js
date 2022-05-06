// const Server = 'http://localhost:8080'
const Server = 'http://101.35.11.84:9898'

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
  }
}

export default urls

