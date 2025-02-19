import { AbstractEmbeddedItem } from "../abstractEmbeddedItem";
import { RqgActor } from "../../actors/rqgActor";
import { RqgItem } from "../rqgItem";
import { ItemTypeEnum } from "../../data-model/item-data/itemTypes";
import { assertItemType, formatModifier, localize } from "../../system/util";
import { ItemChatFlags } from "../../data-model/shared/rqgDocumentFlags";
import { ItemChatHandler } from "../../chat/itemChatHandler";
import { ResultEnum } from "../../data-model/shared/ability";

export class Rune extends AbstractEmbeddedItem {
  // public static init() {
  //   Items.registerSheet("rqg", RuneSheet, {
  //     types: [ItemTypeEnum.ElementalRune],
  //     makeDefault: true,
  //   });
  // }

  static async toChat(rune: RqgItem): Promise<void> {
    const flags: ItemChatFlags = {
      type: "itemChat",
      chat: {
        actorUuid: rune.actor!.uuid,
        tokenUuid: rune.actor!.token?.uuid,
        chatImage: rune.img ?? "",
        itemUuid: rune.uuid,
      },
      formData: {
        modifier: "",
      },
    };
    await ChatMessage.create(await ItemChatHandler.renderContent(flags));
  }

  static async abilityRoll(
    runeItem: RqgItem,
    options: { modifier: number },
  ): Promise<ResultEnum | undefined> {
    const chance: number = Number((runeItem?.system as any).chance) || 0;
    let flavor = localize("RQG.Dialog.itemChat.RollFlavor", { name: runeItem.name });
    if (options.modifier && options.modifier !== 0) {
      flavor += localize("RQG.Dialog.itemChat.RollFlavorModifier", {
        modifier: formatModifier(options.modifier),
      });
    }
    const speaker = ChatMessage.getSpeaker({ actor: runeItem.actor ?? undefined });
    const result = await runeItem._roll(flavor, chance, options.modifier, speaker);
    await runeItem.checkExperience(result);
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static preUpdateItem(actor: RqgActor, rune: RqgItem, updates: any[], options: any): void {
    if (rune.type === ItemTypeEnum.Rune) {
      const chanceResult = updates.find(
        (r) => r["system.chance"] != null || r?.system?.chance != null,
      );
      if (!chanceResult) {
        return;
      }
      if (rune.system.opposingRune) {
        const opposingRune = actor.items.getName(rune.system.opposingRune);
        const chance = chanceResult["system.chance"] || chanceResult.system.chance;
        if (opposingRune && chance) {
          // While editing a rune it's possible to have incomplete data, ignore in that case.
          this.adjustOpposingRuneChance(opposingRune, chance, updates);
        }
      }
    }
  }

  private static adjustOpposingRuneChance(
    opposingRune: RqgItem | undefined,
    newChance: number,
    updates: object[],
  ) {
    assertItemType(opposingRune?.type, ItemTypeEnum.Rune);
    const opposingRuneChance = opposingRune.system.chance;
    if (newChance + opposingRuneChance !== 100) {
      updates.push({
        _id: opposingRune.id,
        system: { chance: 100 - newChance },
      });
    }
  }
}
