const cloudinary = require("../config/cloudinary.config");

const deleteFromCloud = async (publicId) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
            console.error('Delete failed:', error);
        } else {
            console.log('Delete success:', result);
        }
    });
}

module.exports = deleteFromCloud;