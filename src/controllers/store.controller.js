const storeRepository = require("../repositories/store.repository");
const baseResponse = require("../utils/baseResponse.utils");

exports.getAllStores = async (req, res) => {
  try {
    const stores = await storeRepository.getAllStores();
    return baseResponse(res, true, 200, "Stores found", stores);
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving stores", error);
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await storeRepository.getStoreById(req.params.id);
    if (!store) {
      return baseResponse(res, false, 404, "Store not found");
    }
    return baseResponse(res, true, 200, "Store found", store);
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving store", error);
  }
};

exports.createStore = async (req, res) => {
  if (!req.body.name || !req.body.address) {
    return baseResponse(res, false, 400, "Missing store name or address");
  }

  try {
    const store = await storeRepository.createStore(req.body);
    return baseResponse(res, true, 201, "Store created", store);
  } catch (error) {
    return baseResponse(res, false, 500, "Error creating store", error);
  }
};

exports.updateStore = async (req, res) => {
  if (!req.body.id || !req.body.name || !req.body.address) {
    return baseResponse(res, false, 400, "ID, name, and address are required");
  }

  try {
    const updatedStore = await storeRepository.updateStore(req.body);
    if (!updatedStore) {
      return baseResponse(res, false, 404, "Store not found");
    }
    return baseResponse(res, true, 200, "Store updated", updatedStore);
  } catch (error) {
    return baseResponse(res, false, 500, "Error updating store", error);
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const result = await storeRepository.deleteStore(req.params.id);
    if (result.rowCount === 0) {
      return baseResponse(res, false, 404, "Store not found");
    }
    // Mengembalikan data store yang dihapus (result.payload) jika ada
    return baseResponse(res, true, 200, "Store deleted", result.payload);
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting store", error);
  }
};
