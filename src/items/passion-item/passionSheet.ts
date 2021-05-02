import { PassionItemData, PassionsEnum } from "../../data-model/item-data/passionData";
import { ItemTypeEnum } from "../../data-model/item-data/itemTypes";
import { RqgItemSheet } from "../RqgItemSheet";

export class PassionSheet extends RqgItemSheet {
  static passionImgUrl = new Map([
    [PassionsEnum.Cowardly, "systems/rqg/assets/images/passion/cowardly.svg"],
    [PassionsEnum.Devotion, "systems/rqg/assets/images/passion/devotion.svg"],
    [PassionsEnum.Fear, "systems/rqg/assets/images/passion/fear.svg"],
    [PassionsEnum.Hate, "systems/rqg/assets/images/passion/hate.svg"],
    [PassionsEnum.Honor, "systems/rqg/assets/images/passion/honor.svg"],
    [PassionsEnum.Loyalty, "systems/rqg/assets/images/passion/loyalty.svg"],
    [PassionsEnum.Love, "systems/rqg/assets/images/passion/love.svg"],
  ]);

  static get defaultOptions(): BaseEntitySheet.Options {
    // @ts-ignore mergeObject
    return mergeObject(super.defaultOptions, {
      classes: ["rqg", "sheet", ItemTypeEnum.Passion],
      template: "systems/rqg/items/passion-item/passionSheet.html",
      width: 520,
      height: 250,
    });
  }

  getData(): PassionItemData {
    const sheetData = super.getData() as PassionItemData;
    const data = sheetData.data;
    data.passionTypes = Object.values(PassionsEnum);
    return sheetData;
  }

  protected _updateObject(event: Event, formData: any): Promise<any> {
    const subject = formData["data.subject"] ? ` (${formData["data.subject"]})` : "";
    formData["name"] = formData["data.passion"] + subject;
    formData["img"] = PassionSheet.passionImgUrl.get(formData["data.passion"]);
    return super._updateObject(event, formData);
  }
}
