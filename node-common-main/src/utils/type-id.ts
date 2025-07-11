import { typeid } from "typeid-js";

export const generateTypeId = (prefix:string) => {
    return typeid(prefix).toString()
}