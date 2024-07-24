document.addEventListener('DOMContentLoaded', () => {
    const $inputs = [...document.querySelectorAll('[data-js-password]')]
    $inputs.forEach(el => {
        const id = el.getAttribute('data-js-password')
        const $input = document.querySelector(`#${id}`)
        if ($input) {
            el.addEventListener('click', () => {
                const type = $input.getAttribute('type')
                switch (type) {
                    case 'password':
                        $input.setAttribute('type', 'text')
                        break
                    default:
                        $input.setAttribute('type', 'password')
                        break
                }
            })
        }
    })
})
