
const sqlite = {
    client: 'sqlite3',
    connection: () => ({
      filename: '../DB/messages.sqlite'
    }),
  };

module.exports = sqlite