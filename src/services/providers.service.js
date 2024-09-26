import pkg from 'rest-api-errors';
const { APIError } = pkg;


export const connectWallet = async (data) => {
  try {
    
    if (!data) {
      throw new APIError(404, "404", "Wallet connect failed!");
    }

    const alreadyConnect = await ConnectedProviders.findOne({
      name: data?.name,
    });

    if (alreadyConnect) {
      throw new APIError(404, "404", "Wallet is already connected!");
    }

    return await ConnectedProviders.create(data);
  } catch (error) {
    throw error;
  }
};
