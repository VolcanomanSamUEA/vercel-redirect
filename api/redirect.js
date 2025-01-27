let index = 0;
const urls = [
    "https://form.jotform.com/250264561457357",
    "https://form.jotform.com/smitchinson/uea"
];

module.exports = (req, res) => {
    res.redirect(307, urls[index % urls.length]);
    index++;
};
