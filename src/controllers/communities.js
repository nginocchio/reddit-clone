import Model from '../models/model';

const communitesModel = new Model('communities');
export const messagesPage = async (req, res) => {
  try {
    const query = 'SELECT * FROM communites';
    const data = await communitesModel.executeQuery(query);
    res.status(200).json({ messages: data.rows });
  } catch (err) {
    res.status(200).json({ messages: err.stack });
  }
};
