export { randomNumber, percentChance };

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function percentChance(percent) {
  return (1 + (Math.random() * 99)) <= percent
}
