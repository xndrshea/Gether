const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const uploadImage = async () => {
    try {
        const buffer = fs.readFileSync('./doppelpunktu.png'); // Use a local test image

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `test/${Date.now()}-upload.png`,
            Body: buffer,
            ContentType: 'image/png'
        };

        const uploadResult = await s3.upload(params).promise();
        console.log('Test image uploaded successfully:', uploadResult);
    } catch (err) {
        console.error('Error uploading test image:', err);
    }
};

uploadImage();