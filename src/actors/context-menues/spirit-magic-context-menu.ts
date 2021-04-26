import { RqgActorSheet } from "../rqgActorSheet";
import { SpiritMagicCard } from "../../chat/spiritMagicCard";
import { SpiritMagicItemData } from "../../data-model/item-data/spiritMagicData";
import { RqgActor } from "../rqgActor";
import { getDomDataset, logBug } from "../../system/util";

export const spiritMagicMenuOptions = (actor: RqgActor): ContextMenu.Item[] => [
  {
    name: "Roll (click)",
    icon: '<i class="fas fa-dice-d20"></i>',
    condition: () => true,
    callback: async (el: JQuery) => {
      const itemId = getDomDataset(el, "item-id");
      const item = itemId && actor.getOwnedItem(itemId);
      if (item) {
        await SpiritMagicCard.show(item._id, actor);
      } else {
        logBug(
          `Couldn't find itemId [${itemId}] on actor ${
            actor!.name
          } to roll the spiritmagic item from the spiritmagic context menu,`,
          true,
          el
        );
      }
    },
  },
  {
    name: "Direct Roll (dbl click)",
    icon: '<i class="fas fa-dice-d20"></i>',
    condition: () => true,
    callback: async (el: JQuery) => {
      const itemId = getDomDataset(el, "item-id");
      const item = itemId && (actor.getOwnedItem(itemId) as Item<SpiritMagicItemData>);
      if (item) {
        if (item.data.data.isVariable && item.data.data.points > 1) {
          await SpiritMagicCard.show(item._id, actor);
        } else {
          await SpiritMagicCard.roll(item.data, item.data.data.points, 0, actor);
        }
      } else {
        logBug(
          `Couldn't find itemId [${itemId}] on actor ${actor.name} to do a direct roll for a spiritmagic item from the spiritmagic context menu.`,
          true,
          el
        );
      }
    },
  },
  {
    name: "View Description",
    icon: '<i class="fas fa-book-open"></i>',
    condition: (el: JQuery) => {
      const itemId = getDomDataset(el, "item-id");
      let firstItemEl = el[0];
      while ((firstItemEl?.previousElementSibling as HTMLElement)?.dataset?.itemId === itemId) {
        firstItemEl = firstItemEl?.previousElementSibling as HTMLElement;
      }
      return !!firstItemEl?.dataset.journalId;
    },
    callback: async (el: JQuery) => {
      const itemId = getDomDataset(el, "item-id");
      let firstItemEl = el[0];
      while ((firstItemEl?.previousElementSibling as HTMLElement)?.dataset?.itemId === itemId) {
        firstItemEl = firstItemEl.previousElementSibling as HTMLElement;
      }

      const journalId = firstItemEl.dataset.journalId;
      const journalPack = firstItemEl.dataset.journalPack;
      if (journalId) {
        await RqgActorSheet.showJournalEntry(journalId, journalPack);
      } else {
        logBug(
          `Couldn't find itemId [${itemId}] on actor ${actor.name} to view the description of a spirit magic item from the spirit magic context menu.`,
          true,
          el
        );
      }
    },
  },
  {
    name: "Edit",
    icon: '<i class="fas fa-edit"></i>',
    condition: () => !!game.user?.isGM,
    callback: (el: JQuery) => {
      const itemId = getDomDataset(el, "item-id");
      const item = itemId && (actor.getOwnedItem(itemId) as Item<SpiritMagicItemData>);
      if (item && item.sheet) {
        item.sheet.render(true);
      } else {
        logBug(
          `Couldn't find itemId [${itemId}] on actor ${actor.name} to edit the spirit magic item from the spirit magic context menu.`,
          true,
          el
        );
      }
    },
  },
  {
    name: "Delete",
    icon: '<i class="fas fa-trash"></i>',
    condition: () => !!game.user?.isGM,
    callback: (el: JQuery) => {
      const itemId = getDomDataset(el, "item-id");
      if (itemId) {
        RqgActorSheet.confirmItemDelete(actor, itemId);
      } else {
        logBug(
          `Couldn't find itemId [${itemId}] on actor ${actor.name} to delete a spirit magic item from the spirit magic context menu.`,
          true,
          el
        );
      }
    },
  },
];
