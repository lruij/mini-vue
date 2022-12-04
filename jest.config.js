modules.exports = {
  rootDir: __dirname,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.[jt]s?(x)'],
  watchPathIgnorePatterns: ['/node_modules/', 'dist/', '/.git/']
}
