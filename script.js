class Point {
    x = 0
    y = 0

    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

function swapPoints(a, b) {
    let p = new Point(a.x, a.y)
    a.x = b.x
    a.y = b.y
    b.x = p.x
    b.y = p.y
}

function clonePoints(points) {
    const clone = []
    for (let i = 0; i < points.length; i++) {
        clone.push(new Point(points[i].x, points[i].y))
    }
    return clone
}

function calculateDistance(start, end) {
    const xDiff = start.x - end.x
    const yDiff = start.y - end.y
    return Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))
}

function randomNumbersWithIn(min, max, howMany) {
    const totalNums = max - min + 1
    if(totalNums < 5 * howMany) {
        return []
    }
    let i = 0
    const randomNums = new Float64Array(howMany)
    while (i <= howMany) {
        const num = Math.floor(Math.random() * (max - min + 1) + min)
        if (randomNums.includes(num)) {
            console.log(num + ' already included in', randomNums)
            continue
        }
        randomNums[i] = num
        i++
    }
    return randomNums
}

function generatePoints(numPoints) {
    const points = []
    const xCoords = randomNumbersWithIn(10, 790, numPoints)
    const yCoords = randomNumbersWithIn(10, 790, numPoints)
    for (let i = 0; i < numPoints; i++) {
        points.push(new Point(xCoords[i], yCoords[i]))
    }
    return points
}

class Plotter {

    ctx = null;
    pointRadius = 5
    index = 0

    constructor(title) {
        const canvas = document.createElement('canvas')
        canvas.width = 800
        canvas.height = 800
        document.body.appendChild(canvas)
        // const canvas = document.getElementById(canvasId)
        this.ctx = canvas.getContext('2d');

        this.ctx.beginPath()
        this.ctx.font = '18px serif'
        this.ctx.fillText(title, 10, 20)

    }

    plotPoints(points) {
        let colors = []
        const numPoints = points.length
        colors.push('black')
        for (let i = 1; i < numPoints; i++) {
            colors[i] = 'lightblue'
        }
        if (numPoints > 1) {
            colors[numPoints - 1] = 'red'
        }
        // console.log('plot points: ', points)
        for (let i = 0; i < points.length; i++) {
            this.markPoint(points[i], colors[i])
        }
    }

    drawRoute(points) {
        console.log('points are ', points)
        this.plotPoints(points)

        if (points.length < 2) {
            return
        }

        this.ctx.beginPath()
        let start = points[0]
        this.ctx.moveTo(start.x, start.y)
        console.log('moved to ', start)
        let distance = 0, totalDistance = 0
        let distanceLog = ''
        let next = start
        for (let i = 1; i < points.length; i++) {
            next = points[i]
            this.ctx.lineTo(next.x, next.y)
            console.log('line drawn to ', next)
            distance = calculateDistance(start, next)
            distanceLog += ('' + parseFloat(distance).toFixed(2) + ' + ')
            totalDistance += distance
            console.log('total distance is ' + totalDistance)
            start = next
        }

        next = points[0]
        this.ctx.lineTo(next.x, next.y)
        console.log('line drawn to ', next)
        distance = calculateDistance(start, next)
        distanceLog += ('' + parseFloat(distance).toFixed(2))
        totalDistance += distance
        console.log('total distance is ' + totalDistance)
        start = next

        this.ctx.stroke()

        const totalDistanceStr = parseFloat(totalDistance).toFixed(2)

        distanceLog += (' = ' + totalDistanceStr)

        this.ctx.fillText(`Total Distance: ${totalDistanceStr}`, 10, 50)
        console.log(distanceLog)
    }

    markPoint(point, color) {
        this.ctx.beginPath();
        this.ctx.ellipse(point.x, point.y, this.pointRadius, this.pointRadius, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fillStyle = color;
        this.ctx.fill()
        this.incrementIndex()
        this.ctx.fillStyle = 'grey'
        this.ctx.fillText(`${this.index}`, point.x + 10, point.y + 10)
    }

    incrementIndex() {
        return (++this.index)
    }

    drawHorizontalLineAt(y) {
        this.ctx.beginPath()
        this.ctx.moveTo(0, y)
        this.ctx.lineTo(800, y)
        this.ctx.stroke()
    }
}

class TravellingSalesmanAlgorithm {
    points = []
    distances = []
    isSolved = false

    constructor(points) {

        this.points = points
        let totalDistance = 0
        if (points.length > 1) {
            let start = points[0], next, distance
            for (let i = 1; i < points.length; i++) {
                next = points[i]
                distance = calculateDistance(start, next)
                this.distances.push(distance)
                totalDistance += distance
                start = next
            }
            next = points[0]
            distance = calculateDistance(start, next)
            this.distances.push(distance)
            totalDistance += distance
            start = next
        }
        if (points.length <= 2) {
            this.isSolved = true
        }

        console.log('initial total distance = ' + parseFloat(totalDistance).toFixed(2), this.distances)
    }

    findRoute() {
        const lastIndex = this.points.length - 1

        ////////////////////////////////////////////
        const plotter1 = new Plotter('Initial')
        plotter1.drawRoute(this.points)


        ////////////////////////////////////////////
        const pointsSwappedStartEnd = clonePoints(this.points)
        swapPoints(pointsSwappedStartEnd[0], pointsSwappedStartEnd[lastIndex])
        const plotter2 = new Plotter('After first and last swapped')
        plotter2.drawRoute(pointsSwappedStartEnd)


        ////////////////////////////////////////////        
        const pointsSorted = clonePoints(this.points)
        pointsSorted.sort((a, b) => a.x - b.x)
        pointsSorted.sort((a, b) => a.y - b.y)
        const plotter3 = new Plotter('Sorted X then Y')
        plotter3.drawRoute(pointsSorted)


        /////////////////////////////////////////////
        const pointsSorted2 = clonePoints(this.points)
        pointsSorted2.sort((a, b) => b.x - a.x)
        pointsSorted2.sort((a, b) => b.y - a.y)
        const plotter4 = new Plotter('Sorted X then Y, descending')
        plotter4.drawRoute(pointsSorted2)


        /////////////////////////////////////////////
        const pointsSorted3 = clonePoints(this.points)
        pointsSorted3.sort((a, b) => b.y - a.y)
        pointsSorted3.sort((a, b) => b.x - a.x)
        const plotter5 = new Plotter('Sorted Y then X, descending')
        plotter5.drawRoute(pointsSorted3)

        const plotter0 = new Plotter('Empty')

        /////////////////////////////////////////////        
        const pointsSorted4 = clonePoints(this.points)
        pointsSorted4.sort((a, b) => a.x - b.x)
        let maxY = pointsSorted4[0].y
        let minY = pointsSorted4[0].y
        for (let i = 0; i <= lastIndex; i++) {
            if (pointsSorted4[i].y > maxY) {
                maxY = pointsSorted4[i].y
            }
            if (pointsSorted4[i].y < minY) {
                minY = pointsSorted4[i].y
            }
        }
        const meanY = Math.round((maxY + minY) / 2)
        console.log(`max Y is ${maxY}, min Y is ${minY}, mean Y is ${meanY}`)
        const abovePoints = []
        const belowPoints = []
        for (let i = 0; i <= lastIndex; i++) {
            if (pointsSorted4[i].y >= meanY) {
                belowPoints.push(pointsSorted4[i])
            } else {
                abovePoints.push(pointsSorted4[i])
            }
        }
        abovePoints.sort((a, b) => b.x - a.x)
        belowPoints.sort((a, b) => a.x - b.x)
        const roundPoints = []
        let i
        for (i = 0; i < belowPoints.length; i++) {
            roundPoints.push(belowPoints[i])
        }
        for (i = 0; i < abovePoints.length; i++) {
            roundPoints.push(abovePoints[i])
        }
        const nonOptimizedPoints = clonePoints(roundPoints)
        if (roundPoints.length > 3) {
            let numOptimizations = 1
            while(numOptimizations > 0) {
                numOptimizations = this.optimizeRing(roundPoints)
            }            
        }
        const plotter6 = new Plotter('Before Optimizations')
        plotter6.drawRoute(nonOptimizedPoints)
        plotter6.drawHorizontalLineAt(meanY)

        const plotter7 = new Plotter('After Optimizations')
        plotter7.drawRoute(roundPoints)
        plotter7.drawHorizontalLineAt(meanY)
    }

    optimizeRing(roundPoints) {
        let numOptimizations = 0, i
        for (i = 0; i < roundPoints.length - 3; i++) {
            numOptimizations += this.optimize4(roundPoints[i], roundPoints[i + 1], roundPoints[i + 2], roundPoints[i + 3])
        }
        numOptimizations += this.optimize4(roundPoints[i], roundPoints[i + 1], roundPoints[i + 2], roundPoints[0])
        numOptimizations += this.optimize4(roundPoints[i + 1], roundPoints[i + 2], roundPoints[0], roundPoints[1])
        numOptimizations += this.optimize4(roundPoints[i + 2], roundPoints[0], roundPoints[1], roundPoints[2])
        console.log(`${numOptimizations} optimizations`)
        return numOptimizations
    }

    optimize4(a, b, c, d) {
        if (
            (calculateDistance(a, b) + calculateDistance(b, c) + calculateDistance(c, d)) >
            (calculateDistance(a, c) + calculateDistance(c, b) + calculateDistance(b, d))
        ) {
            swapPoints(b, c)
            return 1
        }

        return 0
    }
}

function init() {
    const points = generatePoints(20)

    // const plotter1 = new Plotter('canvas1')
    // const plotter2 = new Plotter('canvas2')

    const algo = new TravellingSalesmanAlgorithm(points)

    algo.findRoute()
}

window.addEventListener('DOMContentLoaded', init)
