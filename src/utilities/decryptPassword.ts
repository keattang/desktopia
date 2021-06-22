import { PRIVATE_KEY } from "../config";
import NodeRSA from "node-rsa";

const decryptPassword = (password: string) => {
  const buff = Buffer.from(password, "base64");
  const key = new NodeRSA(PRIVATE_KEY as NodeRSA.Key, "pkcs1-private-pem", {
    encryptionScheme: "pkcs1",
  });
  return key.decrypt(buff).toString();
};

export default decryptPassword;
