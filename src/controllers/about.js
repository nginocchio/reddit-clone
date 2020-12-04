export const aboutPage = (req, res) =>
  res
    .status(200)
    .json({ message: 'This is the about page and data about this site.' });
