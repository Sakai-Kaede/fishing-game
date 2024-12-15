import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUrl = process.env.MONGOURL;
  if (!mongoUrl) {
    throw new Error("環境変数 'MONGOURL' が設定されていません。");
  }
  try {
    await mongoose.connect(mongoUrl);
    console.log('DBと接続中・・・');
  } catch (err) {
    console.error('DB接続エラー:', err);
    throw new Error('DB接続エラー');
  }
};

export default connectDB;