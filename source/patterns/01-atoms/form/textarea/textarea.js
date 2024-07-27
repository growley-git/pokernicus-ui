document.addEventListener('DOMContentLoaded', () => {
    const $textareas = [...document.querySelectorAll('textarea')]
    if ($textareas.length) {
        $textareas.forEach($textarea => {
            $textarea.style.height = ''
            $textarea.style.height = `${ $textarea.scrollHeight }px`

            $textarea.addEventListener('input', () => {
                $textarea.style.height = ''
                $textarea.style.height = `${ $textarea.scrollHeight }px`
            })
        })
    }
})
