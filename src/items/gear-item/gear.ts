import { AbstractEmbeddedItem } from "../abstractEmbeddedItem";
import { RqgActor } from "../../actors/rqgActor";
import { RqgItem } from "../rqgItem";
import { ItemTypeEnum } from "../../data-model/item-data/itemTypes";
import { getSameLocationUpdates } from "../shared/physicalItemUtil";

export class Gear extends AbstractEmbeddedItem {
  // public static init() {
  //   Items.registerSheet("rqg", GearSheet, {
  //     types: [ItemTypeEnum.Gear],
  //     makeDefault: true,
  //   });
  // }

  static preUpdateItem(actor: RqgActor, gear: RqgItem, updates: object[], options: any): void {
    if (gear.type === ItemTypeEnum.Gear) {
      updates.push(...getSameLocationUpdates(actor, gear, updates));
    }
  }
}
