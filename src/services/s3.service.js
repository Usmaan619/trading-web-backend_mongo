import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
/**
 * Method to upload file
 * @param {*} data - file buffer
 * @param {*} filePath - string path with file name - ex: profile/user.png
 * @returns
 */
export const upload = async (data, filePath) => {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const Key = `${process.env.AWS_BUCKET_NAME}/${filePath}`;
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key,
        Body: data,
      })
    );
  } catch (err) {
    throw err;
  }

  return Key;
};
