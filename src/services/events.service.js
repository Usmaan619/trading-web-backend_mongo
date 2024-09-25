
export const getEvent = async (id) => {
  try {
    return await Event.findById({ _id: id });
  } catch (error) {
    throw error;
  }
};
export const createEvents = async (Body) => {
  try {
    return await Event.create(Body);
  } catch (error) {
    throw error;
  }
};
