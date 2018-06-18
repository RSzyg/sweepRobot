var map = []
var robot = {
  x: 0,
  y: 0,
  width: 12,
  height: 12,
  direct: 'S'
}
var interval
var timer
var cleaned = 0
var obstacle = 0

function calculate() {
  cleaned = 0
  obstacle = 0
  for (var i = 0; i < 500; i++) {
    for (var j = 0; j < 500; j++) {
      if (map[i][j] === 1) obstacle++
      else if (map[i][j] === 2) cleaned++
    }
  }
  document.getElementById('calObstacle').innerText = 'Percent of obstacle:' + obstacle / 2500 + '%'
  document.getElementById('calCleaned').innerText = 'Percent of cleaned:' + cleaned / 2500 + '%'
  document.getElementById('time').innerText = 'Time:' + timer + 'min'
}

function initMap(num, ctx) {
  for (var i = 0; i < 500; i++) {
    var row = []
    for (var j = 0; j < 500; j++) {
      row.push(0)
    }
    map.push(row)
  }
  while (num--) {
    var posX = Math.floor((Math.random() * 480))
    var posY = Math.floor((Math.random() * 480))
    ctx.fillStyle = '#FF0000'
    ctx.fillRect(posY, posX, 20 ,20)
    for (var i = posX; i < posX + 20; i++) {
      for (var j = posY; j < posY + 20; j++) {
        map[i][j] = 1
      }
    }
  }
}

function renderRobot(ctx) {
  ctx.fillStyle = 'green'
  ctx.fillRect(robot.y, robot.x, robot.width, robot.height)
  for (var i = robot.x; i < robot.x + 20; i++) {
    for (var j = robot.y; j < robot.y + 20; j++) {
      if (map[i]) {
        if (map[i][j] === 0) map[i][j] = 2
      }
    }
  }
}

function removeRobot(ctx) {
  ctx.fillStyle = '#6CC417'
  ctx.fillRect(robot.y, robot.x, robot.width, robot.height)
}

function init() {
  var canvas = document.getElementById('main')
  var ctx = canvas.getContext('2d')
  canvas.height = canvas.height
  var num = +document.getElementById('obstacle').value
  initMap(num, ctx)
  renderRobot(ctx)
}

function start() {
  timer = +document.getElementById('timer').value
  setTimeout(function () {stop()} , timer * 60 * 1000)
  interval = setInterval(function () {randomRun()}, 17)
}

function stop() {
  clearInterval(interval)
  calculate()
}

function randomDirect(direct) {
  var rand = Math.floor((Math.random() * 3))
  switch (direct) {
    case 'S':
      if (rand === 0) {
        return 'E'
      } else if (rand === 1) {
        return 'W'
      } else {
        return 'N'
      }
      break
    case 'N':
      if (rand === 0) {
        return 'E'
      } else if (rand === 1) {
        return 'S'
      } else {
        return 'W'
      }
      break
    case 'W':
      if (rand === 0) {
        return 'E'
      } else if (rand === 1) {
        return 'S'
      } else {
        return 'N'
      }
      break
    case 'E':
      if (rand === 0) {
        return 'S'
      } else if (rand === 1) {
        return 'W'
      } else {
        return 'N'
      }
      break
    default:
      break
  }
}

function randomRun() {
  var canvas = document.getElementById('main')
  var ctx = canvas.getContext('2d')
  removeRobot(ctx)
  switch (robot.direct) {
    case 'S':
      if (robot.x + 1 > 488 || HitJudge(robot.direct)) {
        console.log(robot.x, robot.y)
        robot.direct = randomDirect('S')
        break
      }
      robot.x++
      break
    case 'N':
      if (robot.x - 1 < 0 || HitJudge(robot.direct)) {
        robot.direct = randomDirect('N')
        break
      }
      robot.x--
      break
    case 'W':
      if (robot.y - 1 < 0 || HitJudge(robot.direct)) {
        robot.direct = randomDirect('W')
        break
      }
      robot.y--
      break
    case 'E':
      if (robot.y + 1 > 488 || HitJudge(robot.direct)) {
        robot.direct = randomDirect('E')
        break
      }
      robot.y++
    default:
      break;
  }
  renderRobot(ctx)
}

function HitJudge(direct) {
  switch (direct) {
    case 'S':
      for (var j = robot.y; j < robot.y + robot.width; j++) {
        if (robot.x + robot.height >= map.length) return true
        if (map[robot.x + robot.height][j] === 1) return true
      }
      break;
    case 'N':
      for (var j = robot.y; j < robot.y + robot.width; j++) {
        if (robot.x - 1 <= 0) return true
        if (map[robot.x - 1][j] === 1) return true
      }
      break
    case 'W':
      for (var i = robot.x; i < robot.x + robot.height; i++) {
        if (robot.y - 1 <= 0) return true
        if (map[i][robot.y - 1] === 1) return true
      }
      break
    case 'E':
      for (var i = robot.x; i < robot.x + robot.height; i++) {
        if (robot.y + robot.width >= map[0].length) return true
        if (map[i][robot.y + robot.width] === 1) return true
      }
      break
    default:
      break
  }
  return false
}