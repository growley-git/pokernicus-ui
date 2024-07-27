function toHex(int) {
    const hex = int.toString(16)
    return hex.length == 1 ? `0${ hex }` : hex
}

function parseColor(color) {
    const arr = []
    color.replace(/[\d+\.]+/g, (v) => { arr.push(parseFloat(v)) })
    return {
        hex: `#${ arr.slice(0, 3).map(toHex).join("") }`,
        opacity: arr.length == 4 ? arr[3] : 1
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const $sgColors = [...document.querySelectorAll('.sg-color')]
    if ($sgColors.length) {
        $sgColors.forEach(el => {
            const chip   = el.querySelector('.sg-color__chip')
            const info   = el.querySelector('.sg-color__info')
            const styles = window.getComputedStyle(chip, null)
            const rgbStr = styles.getPropertyValue('background-color')
            const hexStr = parseColor(rgbStr).hex
            info.innerHTML += `<span><strong>RGB:</strong> ${ rgbStr }</span>`
            info.innerHTML += `<span><strong>HEX:</strong> ${ hexStr }</span>`
        })
    }
})
