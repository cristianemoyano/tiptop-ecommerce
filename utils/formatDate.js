

const getDateFormatted = (isoDateString) => {
    const isoDate = new Date(isoDateString)
    const dateFormat = new Intl.DateTimeFormat('es', {
        dateStyle: 'full', timeStyle: 'long',
    })
    return dateFormat.format(isoDate)
}

export default getDateFormatted;
