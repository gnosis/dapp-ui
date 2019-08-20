const windowLoaded = new Promise((accept, reject) => {
    if (typeof window === 'undefined') {
        return accept()
    }

    if (typeof window.addEventListener !== 'function') {
        return reject(new Error('expected to be able to register event listener'))
    }

    window.addEventListener(
        'load',
        function loadHandler(event) {
            window.removeEventListener('load', loadHandler, false)

            // return setTimeout(() => accept(event), 2000)
            return accept(event)
        },
        false,
    )
})

export { windowLoaded }
