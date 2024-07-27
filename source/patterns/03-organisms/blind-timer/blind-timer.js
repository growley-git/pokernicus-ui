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

    const dDisplay = d > 0 ? d + (d === 1 ? "&nbsp;day, " : "&nbsp;days, ") : " 0&nbsp;days, "
    const hDisplay = h > 0 ? h + (h === 1 ? "&nbsp;hour, " : "&nbsp;hours, ") : " 0&nbsp;hours, "
    const mDisplay = m > 0 ? m + (m === 1 ? "&nbsp;minute, " : "&nbsp;minutes, ") : " 0&nbsp;minutes, "
    const sDisplay = s > 0 ? s + (s === 1 ? "&nbsp;second" : "&nbsp;seconds") : " 0&nbsp;seconds"

    return dDisplay + hDisplay + mDisplay + sDisplay
}

document.addEventListener('DOMContentLoaded', () => {
    const $blindTimers = [...document.querySelectorAll('.blind-timer')]
    if ($blindTimers.length) {
        $blindTimers.forEach($el => {
            const blindStart = $el.getAttribute('data-blind-start')
            const blindLength = $el.getAttribute('data-blind-length')
            const blindOutput = $el.querySelector('.blind-timer-countdown')
            const blindProgress = $el.querySelector('.progress-bar')

            const dateStart = new Date(blindStart)
            const dateStop  = new Date(blindStart)
            dateStop.setMinutes(dateStart.getMinutes() + blindLength)
            const totalTime = dateStop.getTime() - dateStart.getTime()
            setInterval(() => {
                const dateNow  = new Date()
                const timeLeft = (dateStop.getTime() / 1000) - (dateNow.getTime() / 1000)
                const progress = dateNow.getTime() - dateStart.getTime()
                const percentage = (progress / totalTime) * 100
                blindProgress.style.width = `${ Math.floor(percentage) }%`
                blindOutput.innerHTML = secondsToDHMS(timeLeft)
            }, 1000)
        })
    }
})
