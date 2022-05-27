import { RqgActorSheet } from "../rqgActorSheet";
import { RqgActor } from "../rqgActor";
import { findDatasetValueInSelfOrAncestors, getDomDataset, getGame, getRequiredDomDataset, localize, RqgError } from "../../system/util";
import { ContextMenuRunes } from "./contextMenuRunes";
import { RqgItem } from "../../items/rqgItem";
import { ItemTypeEnum } from "../../data-model/item-data/itemTypes";
import { Rqid } from "../../system/api/rqidApi";

export const cultMenuOptions = (actor: RqgActor): ContextMenu.Item[] => [
  {
    name: localize("RQG.ContextMenu.ViewDescription"),
    icon: ContextMenuRunes.ViewDescription,
    condition: (el: JQuery) => {
      const rqid = findDatasetValueInSelfOrAncestors(el[0] as HTMLElement, "cultRqid");
      return rqid ? true: false;
    },
    callback: async (el: JQuery) => {
      const rqid = findDatasetValueInSelfOrAncestors(el[0] as HTMLElement, "cultRqid");
      if (rqid) {
        await Rqid.renderRqidDocument(rqid);
      }
    },
  },
  {
    name: localize("RQG.ContextMenu.EditItem", {itemType: RqgItem.localizeItemTypeName(ItemTypeEnum.Cult)}),
    icon: ContextMenuRunes.Edit,
    condition: () => !!getGame().user?.isGM,
    callback: (el: JQuery) => {
      const itemId = getRequiredDomDataset(el, "item-id");
      const item = itemId && actor.items.get(itemId);
      if (!item || !item.sheet) {
        const msg = localize("RQG.ContextMenu.Notification.CantEditCultError", {journalId: itemId, actorName: actor.name});
        ui.notifications?.error(msg);
        throw new RqgError(msg);
      }
      item.sheet.render(true);
    },
  },
  {
    name: localize("RQG.ContextMenu.DeleteItem", {itemType: RqgItem.localizeItemTypeName(ItemTypeEnum.Cult)}),
    icon: ContextMenuRunes.Delete,
    condition: () => !!getGame().user?.isGM,
    callback: (el: JQuery) => {
      const itemId = getRequiredDomDataset(el, "item-id");
      RqgActorSheet.confirmItemDelete(actor, itemId);
    },
  },
];
