import { skillType } from "../data-model/item-data/item-types";
import { SkillCategoryEnum } from "../data-model/item-data/skill";

export class SkillSheet extends ItemSheet {
  static get defaultOptions(): FormApplicationOptions {
    return mergeObject(super.defaultOptions, {
      classes: ["rqg", "sheet", skillType],
      template: "systems/rqg/module/item/skill-sheet.html",
      width: 520,
      height: 250,
    });
  }

  getData(): ItemSheetData {
    const data = super.getData();
    data.data.skillCategories = Object.keys(SkillCategoryEnum);
    data.data.isGM = this.actor ? !this.actor.isPC : true;
    return data;
  }
}
