document.addEventListener('DOMContentLoaded', () => {
    const $alertList = document.querySelectorAll('.alert')
    const $alerts = [...$alertList].map($el => new bootstrap.Alert($el))
})
