process.on('message', message => {
    const randomList = randomCantNumbers(1, 1000, message.cant || 100000000)
    process.send(randomList)
    // process.exit()
})

// req.params.cant 

// FUNCIONES
function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function randomCantNumbers(min, max, cant) {
    let randomList = []
    for (let index = 0; index < cant; index++) {
        let randomNbr = random(min, max)
        randomList.push(randomNbr)
    }
    let countRepeated = randomList.reduce(function (prev, cur) {
        prev[cur] = (prev[cur] || 0) + 1
        return prev
    }, {})

    return countRepeated
}