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
var dir = 'SWNE'
var dx = [1, 0, -1, 0]
var dy = [0, -1, 0, 1]

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
  for (var i = robot.x; i < robot.x + 12; i++) {
    for (var j = robot.y; j < robot.y + 12; j++) {
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
    case 0://S
      if (rand === 0) {
        return 'E'
      } else if (rand === 1) {
        return 'W'
      } else {
        return 'N'
      }
      break
    case 2://N
      if (rand === 0) {
        return 'E'
      } else if (rand === 1) {
        return 'S'
      } else {
        return 'W'
      }
      break
    case 1://W
      if (rand === 0) {
        return 'E'
      } else if (rand === 1) {
        return 'S'
      } else {
        return 'N'
      }
      break
    case 3://E
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
  for (var k = 0; k < 4; k++) {
    if (dir[k] === robot.direct) {
      if (HitJudge(robot.x + dx[k], robot.y + dy[k], k)) {
        robot.direct = randomDirect(k)
        break
      }
      robot.x += dx[k]
      robot.y += dy[k]
      break
    }
  }
  renderRobot(ctx)
}

function HitJudge(nx, ny, k) {
  if (
    nx + robot.height - 1 >= map.length ||
    ny + robot.width - 1 >= map[0].length ||
    nx < 0 ||
    ny < 0
  ) return true
  if (Math.abs(dx[k])) {
    for (var j = ny; j < ny + robot.width; j++) {
      if (map[nx + robot.height - 1][j] === 1) return true
      if (map[nx][j] === 1) return true
    }
  } else if (Math.abs(dy[k])) {
    for (var i = nx; i < nx + robot.height; i++) {
      if (map[i][ny + robot.width - 1] === 1) return true
      if (map[i][ny] === 1) return true
    }
  }
  return false
}