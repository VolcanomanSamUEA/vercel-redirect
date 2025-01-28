module.exports = (req, res) => {
    const urls = [
        "https://form.jotform.com/smitchinson/cove-b1",
        "https://form.jotform.com/smitchinson/cove-b2",
        "https://form.jotform.com/smitchinson/cove-b3",
        "https://form.jotform.com/smitchinson/cove-b4"
    ];
    let index = Math.floor(Math.random() * urls.length); // Random selection to demonstrate functionality
    res.writeHead(302, { Location: urls[index] });
    res.end();
};
