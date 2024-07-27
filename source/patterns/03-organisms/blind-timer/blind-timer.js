/*
 * Seconds to Days, Hours, Minutes and Seconds
 * sectionsToDHMS(5238322.2)
 * @return string
 */
function secondsToDHMS(seconds) {
    seconds = Number(seconds)
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor((seconds % (3600 * 24)) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)

    const dDisplay = d > 0 ? d + (d === 1 ? "&nbsp;day, " : "&nbsp;days, ") : "" // " 0&nbsp;days, "
    const hDisplay = h > 0 ? h + (h === 1 ? "&nbsp;hour, " : "&nbsp;hours, ") : "" // " 0&nbsp;hours, "
    const mDisplay = m > 0 ? m + (m === 1 ? "&nbsp;minute, " : "&nbsp;minutes, ") : " 0&nbsp;minutes, "
    const sDisplay = s > 0 ? s + (s === 1 ? "&nbsp;second" : "&nbsp;seconds") : " 0&nbsp;seconds"

    return `${dDisplay}${hDisplay}${mDisplay}${sDisplay}`
}

document.addEventListener('DOMContentLoaded', () => {
    const $blindTimers = [...document.querySelectorAll('.blind-timer')]
    if ($blindTimers.length) {
        $blindTimers.forEach($el => {
            const blindStart = $el.getAttribute('data-blind-start')
            const blindLength = $el.getAttribute('data-blind-length')
            const blindOutput = $el.querySelector('.blind-timer-countdown')
            const blindProgress = $el.querySelector('.progress-bar')
            const blindAlert = document.querySelector($el.getAttribute('data-blind-alert'))

            // blindAlert.classList.remove('show')

            const dateStart = blindStart ? new Date(blindStart) : new Date()
            const dateStop  = new Date(dateStart)
            dateStop.setMinutes(dateStart.getMinutes() + parseFloat(blindLength))
            const totalTime = dateStop.getTime() - dateStart.getTime()
            let progress = 0
            let percentage = 0
            let countdown = setInterval(() => {
                const dateNow  = new Date()
                const timeLeft = (dateStop.getTime() / 1000) - (dateNow.getTime() / 1000)
                progress = dateNow.getTime() - dateStart.getTime()
                percentage = (progress / totalTime) * 100
                blindProgress.style.width = `${ Math.floor(percentage) }%`
                blindOutput.innerHTML = secondsToDHMS(timeLeft)
                if (percentage >= 100) {
                    blindAlert.classList.add('show')
                    Notification.requestPermission().then(perm => {
                        if (perm === "granted") {
                            new Notification("Blinds Increasing", {
                                body: 'Blinds are increasing from 100 to 200'
                            })
                        }
                    })
                    clearInterval(countdown)
                }
            }, 1000)
        })
    }
})
