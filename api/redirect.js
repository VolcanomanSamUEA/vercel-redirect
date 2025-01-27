module.exports = (req, res) => {
    const urls = [
        "https://form.jotform.com/250264561457357",
        "https://form.jotform.com/smitchinson/uea"
    ];
    let index = Math.floor(Math.random() * urls.length); // Random selection to demonstrate functionality
    res.writeHead(302, { Location: urls[index] });
    res.end();
};
