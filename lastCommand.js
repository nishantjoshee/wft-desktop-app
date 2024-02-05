const fs = require('fs').promises;

async function clearLastCommand() {
  const newEntry = JSON.stringify({}, null, 2);

  await fs.writeFile("./lastCommand.json", newEntry, 'utf8', (err) => {
    if (err) {
      console.error('Error writing last command');
      return;
    }
  });
}

async function updateLastCommand(command) {
  const newEntry = JSON.stringify({
    command: command
  }, null, 2); 
  await fs.writeFile("./lastCommand.json", newEntry, 'utf8', (err) => {
    if (err) {
      console.error('Error writing last command');
      return;
    }
  });
}


async function checkLastCommand() {
  try {
    const data = await fs.readFile("./lastCommand.json", 'utf8');
    const lastCommand = JSON.parse(data).command;
    return lastCommand;
  } catch (err) {
    console.log('Error checking last command');
    throw err;
  }
}

module.exports = { checkLastCommand, updateLastCommand, clearLastCommand }