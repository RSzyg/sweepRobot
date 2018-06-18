var map = []
var robot = {
  x: 0,
  y: 0,
  width: 12,
  height: 12,
  direct: 'S'
}
var timer

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
  var map = initMap(num, ctx)
  renderRobot(ctx)
}

function start() {
  timer = setInterval(function () {randomRun()}, 20)
}

function randomDirect(direct) {
  if (direct === 'S' || direct === 'N') {
    if (Math.floor((Math.random() * 2))) {
      return 'E'
    } else {
      return 'W'
    }
  } else {
    if (Math.floor((Math.random() * 2))) {
      return 'S'
    } else {
      return 'N'
    }
  }
}

function randomRun() {
  var canvas = document.getElementById('main')
  var ctx = canvas.getContext('2d')
  removeRobot(ctx)
  switch (robot.direct) {
    case 'S':
      if (robot.x + 1 > 488 || HitJudge(robot.direct)) {
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
      for (var i = robot.x + 1; i < robot.x + 13; i++) {
        if (map[i][robot.y] === 1) return true
      }
      break;
    case 'N':
      for (var i = robot.x - 1; i < robot.x + 11; i++) {
        if (map[i][robot.y] === 1) return true
      }
      break
    case 'W':
      for (var j = robot.y - 1; j < robot.y + 11; j++) {
        if (map[robot.x][j] === 1) return true
      }
      break
    case 'E':
      for (var j = robot.y + 1; j < robot.y + 13; j++) {
        if (map[robot.x][j] === 1) return true
      }
    default:
      break
  }
  return false
}