const drawingPoints = (arg) => {
    if(['free'].includes(arg)) {
        const draw = Math.floor(Math.random() * 1900 + 101)
        return draw
    }

    if(['premium'].includes(arg)) {
        const draw = Math.floor(Math.random() * 6850 + 151)
        return draw
    }
}
export default drawingPoints