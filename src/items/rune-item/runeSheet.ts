import { ItemTypeEnum } from "../../data-model/item-data/itemTypes";
import { RuneTypeEnum } from "../../data-model/item-data/runeData";
import { getAvailableRunes, getGameUser, AvailableRuneCache } from "../../system/util";
import { RqgItemSheet } from "../RqgItemSheet";
import { RqgItem } from "../rqgItem";
import { systemId } from "../../system/config";
import { ItemSheetData } from "../shared/sheetInterfaces";

interface RuneSheetData {
  allRunes: AvailableRuneCache[];
  runeTypes: RuneTypeEnum[];
}
export class RuneSheet extends RqgItemSheet<ItemSheet.Options, RuneSheetData | ItemSheet.Data> {
  static get defaultOptions(): ItemSheet.Options {
    return mergeObject(super.defaultOptions, {
      classes: [systemId, "item-sheet", "sheet", ItemTypeEnum.Rune],
      template: "systems/rqg/items/rune-item/runeSheet.hbs",
      width: 450,
      height: 500,
      tabs: [
        {
          navSelector: ".item-sheet-nav-tabs",
          contentSelector: ".sheet-body",
          initial: "rune",
        },
      ],
    });
  }

  getData(): RuneSheetData & ItemSheetData {
    // @ts-expect-error _source Read from the original data unaffected by any AEs
    const system = duplicate(this.document._source.system);

    if (!system.rune) {
      system.rune = this.document.name;
    }

    return {
      id: this.document.id ?? "",
      uuid: this.document.uuid,
      name: this.document.name ?? "",
      img: this.document.img ?? "",
      isGM: getGameUser().isGM,
      system: system,
      isEmbedded: this.document.isEmbedded,
      allRunes: getAvailableRunes(),
      runeTypes: Object.values(RuneTypeEnum),
    };
  }

  protected _updateObject(event: Event, formData: any): Promise<RqgItem | undefined> {
    formData["name"] = `${formData["system.rune"]} (${formData["system.runeType"]})`;

    let minorRunes = formData["system.minorRunes"];
    minorRunes = Array.isArray(minorRunes) ? minorRunes : [minorRunes];
    minorRunes = [...new Set(minorRunes.filter((r: any) => r))]; // Remove empty & duplicates
    formData["system.minorRunes"] = duplicate(minorRunes);

    formData["system.chance"] = Number(formData["system.chance"]);
    return super._updateObject(event, formData);
  }
}
