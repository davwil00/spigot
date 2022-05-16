class Drip {

    waterTop = document.getElementById('water').getBoundingClientRect().top
    gravity = 0.2
    stopped = true

    start() {
        this.reset()
        this.interval = setInterval(this.updatePositionAndRerender.bind(this), 60)
    }

    stop() {
        this.run = false
    }

    reset() {
        this.run = true
        this.stopped = false
        this.createDroplet()
        this.speedY = 0
        this.gravitySpeed = 0
        this.currentDigitIndex = 1n
        this.state = [10n, -30n, 0n, 1n]
    }

    updatePositionAndRerender() {
        this.gravitySpeed += this.gravity
        this.speedY += this.gravitySpeed
        this.droplet.style.top = `${parseInt(this.droplet.style.top) + this.speedY}px`
        
        if (this.inWater()) {
            if (this.run) {
                this.next()
            } else {
                clearInterval(this.interval)
                this.stopped = true
                this.droplet.remove()
            }
        }
    }

    inWater() {
        return this.droplet.getBoundingClientRect().top >= this.waterTop
    }

    next() {
        this.gravitySpeed = 0
        this.speedY = 0
        this.droplet.src = `images/anim/${this.generateNextDigit()}.png`
        this.droplet.style.top = '-150px'
    }

    createDroplet() {
        this.droplet = document.createElement('img')
        this.droplet.classList.add('droplet')
        this.droplet.src = 'images/anim/3-decimal.webp'
        this.droplet.style.top = '-150px'
        document.getElementById('air').appendChild(this.droplet)
    }

    comp(a,b) {
        return [
            a[0]*b[0] + a[1]*b[2],
            a[0]*b[1] + a[1]*b[3],
            a[2]*b[0] + a[3]*b[2],
            a[2]*b[1] + a[3]*b[3],
        ]
    }

    generateNextDigit() {
        while (true) {
            const x = 27n * this.currentDigitIndex - 12n
            const y = (this.state[0]*x + 5n*this.state[1]) / (this.state[2]*x + 5n*this.state[3])
            const x2 = 675n * this.currentDigitIndex - 216n
            const z = (this.state[0]*x2 + 125n*this.state[1]) / (this.state[2]*x2 + 125n*this.state[3])
            if (y == z) {
                this.state = this.comp([10n, y*-10n, 0n, 1n], this.state)
                return y
            }
            const j = 3n*(3n*this.currentDigitIndex+1n)*(3n*this.currentDigitIndex+2n)
            this.state = this.comp(this.state, [this.currentDigitIndex*(2n*this.currentDigitIndex-1n), j*(5n*this.currentDigitIndex-2n), 0n, j])
            this.currentDigitIndex += 1n
        }
    }
}

const drip = new Drip()

function handleEvent(event) {
	if (event.key === 'a') {
		if (drip.stopped) {
            drip.start()
        }
	} else if (event.key === 'b') {
		drip.stop()
	}
}

window.addEventListener("keyup", handleEvent, false)