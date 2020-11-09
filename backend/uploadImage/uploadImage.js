//Access to /.env variables
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

const Formidable = require('formidable');

//Cloudinary configurations
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadImage = (req,res) => {
    const form = new Formidable.IncomingForm();
    form.parse(req, (error, fiels, files) => {
        const {image} = files;

        cloudinary
        .uploader
        .upload(image.path, {
            upload_preset: 'omer',
        })
        //.then((res) => console.log(res.secure_url))
        .then((res) => console.log("omer"))
        .catch((err) => console.log("etay"));

    })
}