import { AES_KEY } from "@constants";
import * as CryptoJS from "crypto-js";

export class AESUitls {
  static KEY = AES_KEY;

  public static encrypt(str: any): string {
    return CryptoJS.AES.encrypt(str, this.KEY).toString();
  }

  public static decrypt(str: any): any {
    return CryptoJS.AES.decrypt(str, this.KEY).toString(CryptoJS.enc.Utf8);
  }
}
