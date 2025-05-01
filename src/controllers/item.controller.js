const itemRepository = require('../repositories/item.repository');
const cloudinary = require('../utils/cloudinary');

exports.createItem = async (req, res) => {
  try {
    const { name, price, store_id, stock } = req.body;
    let image_url = null;
    if (req.file) {
      const result = await cloudinary.uploadImage(req.file);
      image_url = result.secure_url;
    }
    const newItem = await itemRepository.createItem({
      name,
      price,
      store_id,
      image_url,
      stock: stock || 0
    });
    return res.status(201).json({
      succes: true,
      message: "Item created",
      payload: newItem
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      succes: false,
      message: error.message || "Error creating item",
      payload: null
    });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await itemRepository.getItems();
    return res.status(200).json({
      succes: true,
      message: "Items found",
      payload: items
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      succes: false,
      message: "Error retrieving items",
      payload: null
    });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await itemRepository.getItemById(id);
    if (!item) {
      return res.status(404).json({
        succes: false,
        message: "Item not found",
        payload: null
      });
    }
    return res.status(200).json({
      succes: true,
      message: "Item found",
      payload: item
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      succes: false,
      message: "Error retrieving item",
      payload: null
    });
  }
};

exports.getItemsByStoreId = async (req, res) => {
  try {
    const { store_id } = req.params;
    const items = await itemRepository.getItemsByStoreId(store_id);
    if (!items || items.length === 0) {
      return res.status(404).json({
        succes: false,
        message: "Store doesnt exist",
        payload: null
      });
    }
    return res.status(200).json({
      succes: true,
      message: "Items found",
      payload: items
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      succes: false,
      message: "Error retrieving items by store",
      payload: null
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id, name, price, store_id, stock } = req.body;
    let image_url = null;
    if (req.file) {
      const result = await cloudinary.uploadImage(req.file);
      image_url = result.secure_url;
    }
    const updatedItem = await itemRepository.updateItem({
      id,
      name,
      price,
      store_id,
      image_url,
      stock
    });
    if (!updatedItem) {
      return res.status(404).json({
        succes: false,
        message: "Store doesnt exist found",
        payload: null
      });
    }
    return res.status(200).json({
      succes: true,
      message: "Item updated",
      payload: updatedItem
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      succes: false,
      message: error.message || "Error updating item",
      payload: null
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await itemRepository.deleteItem(id);
    if (!deletedItem) {
      return res.status(404).json({
        succes: false,
        message: "Item not found",
        payload: null
      });
    }
    return res.status(200).json({
      succes: true,
      message: "Item deleted",
      payload: deletedItem
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      succes: false,
      message: "Error deleting item",
      payload: null
    });
  }
};
