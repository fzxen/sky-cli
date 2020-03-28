import fs from 'fs'

export const isFoldExist = async name => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(name)) reject(new Error(`${name} has existed`))
    else resolve()
  })
}

export const isNone = obj => obj === undefined || obj === null

export const getCreateQuestions = ({ name }) => {
  return [
    {
      type: 'list',
      name: 'frame',
      message: 'please choose this project template',
      choices: ['vue', 'react'],
    },
    {
      type: 'input',
      name: 'name',
      message: 'Please enter the project name: ',
      default: name,
      validate(value) {
        if (!value) return 'you must provide the name'

        return true
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'Please enter the project description: ',
      validate(value) {
        if (!value) return 'you must provide the description'

        return true
      },
    },
    {
      type: 'input',
      name: 'author',
      message: 'Please enter the author name: ',
      default: 'fanzhongxu',
      validate(value) {
        if (!value) return 'you must provide the author'

        return true
      },
    },
  ]
}

export const gitSources = {
  vue: {
    url: 'direct:https://gitee.com/zxffan/vue-template',
  },
  react: {
    url: '',
  },
  electron: {
    url: '',
  },
}

export const updateJsonFile = (path, obj) => {
  return new Promise(resolve => {
    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path).toString()
      const json = JSON.parse(data)
      Object.assign(json, obj)
      fs.writeFileSync(path, JSON.stringify(json, null, '\t'))
      resolve()
    }
  })
}

export const getType = target =>
  Object.prototype.toString.call(target).match(/\s(\w*)]$/)[1]
export const isBaseType = target =>
  ['number', 'string', 'boolean', 'undefined', 'null'].indexOf(
    getType(target)
  ) >= 0

// * init
export const getInitQuestions = () => {
  return [
    {
      type: 'confirm',
      message: 'Do you need initialize a git repository',
      name: 'git',
      default: false,
    },
  ]
}
