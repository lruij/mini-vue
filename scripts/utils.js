const fs = require('fs')

//  读取packages文件夹下所有文件， 并且过滤
const targets = fs.readdirSync('packages').filter(f => fs.statSync(`packages/${f}`).isDirectory())

exports.targets = targets
