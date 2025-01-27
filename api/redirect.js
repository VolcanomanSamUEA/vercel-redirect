module.exports = (req, res) => {
    const urls = [
        "https://form.jotform.com/250264561457357",
        "https://form.jotform.com/smitchinson/uea"
    ];
    // Retrieve the index from the query string or start at 0
    const index = parseInt(req.query.index, 10) || 0;

    // Calculate the next index, wrapping around if necessary
    const nextIndex = (index + 1) % urls.length;

    // Redirect to the current URL with the next index as a query parameter
    res.writeHead(302, { Location: `${urls[index]}?index=${nextIndex}` });
    res.end();
};
