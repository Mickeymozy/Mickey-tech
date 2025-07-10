 const session = process.env.SESSION || '';
const mycode = process.env.CODE || "255";
const botname = process.env.BOTNAME || 'MICKEY-TECH';
const herokuAppName = process.env.HEROKU_APP_NAME || '';
const herokuApiKey = process.env.HEROKU_API_KEY || 'HRKU-859cb7ed-48d8-482c-9d6a-38afe1ac0f9a';
const database = process.env.DATABASE_URL || '';

module.exports = {
  session,
  mycode,
  botname,
  database,
herokuAppName,
herokuApiKey
};
