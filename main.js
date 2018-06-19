var map = []
var robot = {
  x: 0,
  y: 0,
  width: 20,
  height: 20,
  direct: 'S'
}
var spacing = 1
var interval
var timer
var cleaned = 0
var obstacle = 0
var dir = 'SWNE'
var redir = 'NESW'
var dx = [1, 0, -1, 0]
var dy = [0, -1, 0, 1]
var count = 0
var stack = []

function calculate() {
  cleaned = 0
  obstacle = 0
  for (var i = 0; i < 500; i++) {
    for (var j = 0; j < 500; j++) {
      if (map[i][j] === -1) obstacle++
      else if (map[i][j] > 0) cleaned++
    }
  }
  document.getElementById('calObstacle').innerText = 'Percent of obstacle:' + (obstacle / 2500) + '%'
  document.getElementById('calCleaned').innerText = 'Percent of cleaned:' + (cleaned * 100 / (250000 - obstacle)) + '%'
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
    var posX = Math.floor((Math.random() * 475))
    var posY = Math.floor((Math.random() * 475))
    ctx.fillStyle = '#FF0000'
    ctx.fillRect(posY, posX, 25 ,25)
    for (var i = posX; i < posX + 25; i++) {
      for (var j = posY; j < posY + 25; j++) {
        map[i][j] = -1
      }
    }
  }
}

function renderRobot() {
  var canvas = document.getElementById('main')
  var ctx = canvas.getContext('2d')
  ctx.fillStyle = 'green'
  ctx.fillRect(robot.y, robot.x, robot.width, robot.height)
  for (var i = robot.x; i < robot.x + robot.height; i++) {
    for (var j = robot.y; j < robot.y + robot.width; j++) {
      if (map[i]) {
        if (map[i][j] >= 0) map[i][j]++
      }
    }
  }
}

function removeRobot() {
  var canvas = document.getElementById('main')
  var ctx = canvas.getContext('2d')
  ctx.fillStyle = '#6CC417'
  ctx.fillRect(robot.y, robot.x, robot.width, robot.height)
}

function clearRoute() {
  var canvas = document.getElementById('main')
  var ctx = canvas.getContext('2d')
  for (var i = 0; i < 500; i++) {
    for (var j = 0; j < 500; j++) {
      if (map[i][j] > 0) {
        map[i][j] = 0
        ctx.fillStyle = '#C0C0C0'
        ctx.fillRect(j, i, 1, 1)
      }
    }
  }
  robot.x = 0
  robot.y = 0
  robot.direct = 'S'
  renderRobot()
}

function init() {
  var canvas = document.getElementById('main')
  var ctx = canvas.getContext('2d')
  canvas.height = canvas.height
  var num = +document.getElementById('obstacle').value
  initMap(num, ctx)
  renderRobot()
}

function start1() {
  timer = +document.getElementById('timer').value
  setTimeout(function () {stop()} , timer * 60 * 1000)
  interval = setInterval(function () {randomRun()}, spacing)
}

function start2() {
  timer = +document.getElementById('timer').value
  setTimeout(function () {stop()} , timer * 60 * 1000)
  dfs()
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

function hitJudge(nx, ny, k, mode) {
  if (
    nx + robot.height - 1 >= map.length ||
    ny + robot.width - 1 >= map[0].length ||
    nx < 0 ||
    ny < 0
  ) return true
  if (Math.abs(dx[k])) {
    var judge = false
    var hasZero = false
    for (var j = ny; j < ny + robot.width; j++) {
      if (dx[k] > 0) {
        if (map[nx + robot.height - 1][j] === -1) return true
        if (mode) {
          if (map[nx + robot.height - 1][j] === 0) hasZero = true
          if (map[nx + robot.height - 1][j] > 0) judge = true
        }
      } else {
        if (map[nx][j] === -1) return true
        if (mode) {
          if (map[nx][j] === 0) hasZero = true
          if (map[nx][j] > 0) judge = true
        }
      }
    }
  } else if (Math.abs(dy[k])) {
    for (var i = nx; i < nx + robot.height; i++) {
      if (dy[k] > 0) {
        if (map[i][ny + robot.width - 1] === -1) return true
        if (mode) {
          if (map[i][ny + robot.width - 1] === 0) hasZero = true
          if (map[i][ny + robot.width - 1] > 0) judge = true
        }
      } else {
        if (map[i][ny] === -1) return true
        if (mode) {
          if (map[i][ny] === 0) hasZero = true
          if (map[i][ny] > 0) judge = true
        }
      }
    }
  }
  return hasZero ? false : judge
}

function move(x, y) {
  var canvas = document.getElementById('main')
  var ctx = canvas.getContext('2d')
  removeRobot()
  robot.x = x
  robot.y = y
  renderRobot()
}

function dfs() {//S->W->N->E
  stack.push({ x: robot.x, y: robot.y })
  interval = setInterval(function () {
    if (stack.length) {
      var node = stack[stack.length - 1]
      var k = 0
      for (; k < 4; k++) {
        var nx = node.x + dx[k]
        var ny = node.y + dy[k]
        if (hitJudge(nx, ny, k, 1)) continue
        move(nx, ny)
        stack.push({ x: robot.x, y: robot.y })
        break
      }
      if (k === 4) {
        move(node.x, node.y)
        stack.pop()
      }
    }
  }, spacing)
}

function randomRun() {
  var canvas = document.getElementById('main')
  var ctx = canvas.getContext('2d')
  removeRobot()
  for (var k = 0; k < 4; k++) {
    if (dir[k] === robot.direct) {
      if (hitJudge(robot.x + dx[k], robot.y + dy[k], k, 0)) {
        robot.direct = randomDirect(k)
        break
      }
      robot.x += dx[k]
      robot.y += dy[k]
      break
    }
  }
  renderRobot()
}
