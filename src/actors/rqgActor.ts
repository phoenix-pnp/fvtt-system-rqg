import { humanoid, RqgCalculations } from "../system/rqgCalculations";
import { RqgActorData } from "../data-model/actor-data/rqgActorData";
import { ResponsibleItemClass } from "../data-model/item-data/itemTypes";
import elementalRunes from "../assets/default-items/elementalRunes";
import powerFormRunes from "../assets/default-items/powerFormRunes";
import hitLocations from "../assets/default-items/hitLocations";
import characterSkills from "../assets/default-items/characterSkills";
import { RqgActorSheet } from "./rqgActorSheet";
import { RqgItem } from "../items/rqgItem";

export class RqgActor extends Actor<RqgActorData> {
  static init() {
    CONFIG.Actor.entityClass = RqgActor as typeof Actor;

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("rqg", RqgActorSheet, { makeDefault: true });

    Hooks.on("createActor", async (actor: RqgActor, options: any) => {
      if (actor.data.type === "character" && options.renderSheet) {
        // TODO Add support for other races than humanoid - is race even set at this point?
        const humanoidHitLocations = hitLocations.filter((h) =>
          humanoid.hitLocations.toString().includes(h.name)
        );
        const actorItemsData = (elementalRunes as ItemData[]).concat(
          powerFormRunes,
          humanoidHitLocations,
          characterSkills,
          humanoid.naturalWeapons.skills
        );

        // createOwnedItem is mistyped - can return array as well
        const actorItems = ((await actor.createOwnedItem(
          actorItemsData
        )) as unknown) as Item[];

        // Connect natural meleeWeapon with corresponding skill
        const naturalWeapons = humanoid.naturalWeapons.meleeWeapons.map((w) => {
          w.data.skillId = actorItems.find((s) => s.name === w.name)._id;
          return w;
        });
        await actor.createOwnedItem(naturalWeapons);
      }
    });
  }

  /**
   * First prepare any derived data which is actor-specific and does not depend on Items or Active Effects
   */
  prepareBaseData() {
    // @ts-ignore (until foundry-pc-types are updated for 0.7)
    super.prepareBaseData();

    const actorData = this.data;
    const data = actorData.data;
    // Set this here before Active effects to allow POW crystals to boost it.
    data.attributes.magicPoints.max = data.characteristics.power.value;
    // const flags = actorData.flags;
    console.debug("*** RqgActor prepareBaseData  actorData", actorData);
  }

  prepareEmbeddedEntities(): void {
    super.prepareEmbeddedEntities();
    const actorData = this.data;
    const data = actorData.data;

    // Shorthand access to characteristics
    const str = data.characteristics.strength.value;
    const con = data.characteristics.constitution.value;
    const siz = data.characteristics.size.value;
    const dex = data.characteristics.dexterity.value;
    const int = data.characteristics.intelligence.value;
    const pow = data.characteristics.power.value;
    const cha = data.characteristics.charisma.value;

    data.attributes.hitPoints.max = RqgCalculations.hitPoints(con, siz, pow);

    data.skillCategoryModifiers = RqgCalculations.skillCategoryModifiers(
      str,
      siz,
      dex,
      int,
      pow,
      cha
    );

    this.items.forEach((item: RqgItem) =>
      ResponsibleItemClass.get(item.type).prepareAsEmbeddedItem(item)
    );
  }

  /**
   * Apply any transformations to the Actor data which are caused by ActiveEffects.
   */
  applyActiveEffects() {
    super.applyActiveEffects();
    // @ts-ignore 0.7
    console.debug("!! ***applyActiveEffects", this.effects);
  }

  /**
   * Apply final transformations to the Actor data after all effects have been applied
   */
  prepareDerivedData() {
    // @ts-ignore (until foundry-pc-types are updated for 0.7)
    super.prepareBaseData();
    console.debug("!! ***prepareDerivedData");

    const actorData = this.data;
    const data = actorData.data;

    // Shorthand access to characteristics
    const str = data.characteristics.strength.value;
    const con = data.characteristics.constitution.value;
    const siz = data.characteristics.size.value;
    const dex = data.characteristics.dexterity.value;
    const pow = data.characteristics.power.value;
    const cha = data.characteristics.charisma.value;

    // *** Setup calculated stats ***

    data.attributes.dexStrikeRank = RqgCalculations.dexSR(dex);
    data.attributes.sizStrikeRank = RqgCalculations.sizSR(siz);
    data.attributes.damageBonus = RqgCalculations.damageBonus(str, siz);
    data.attributes.healingRate = RqgCalculations.healingRate(con);
    data.attributes.spiritCombatDamage = RqgCalculations.spiritCombatDamage(
      pow,
      cha
    );
    data.attributes.maximumEncumbrance = Math.round(
      Math.min(str, (str + con) / 2)
    );

    data.attributes.equippedEncumbrance = this.items.reduce((sum, i) => {
      const enc = i.data.data.isEquipped
        ? (i.data.data.quantity || 1) * (i.data.data.encumbrance || 0)
        : 0;
      return sum + enc;
    }, 0);
    data.attributes.equippedEncumbrance = Math.round(
      data.attributes.equippedEncumbrance
    );

    data.attributes.travelEncumbrance = this.items.reduce(
      (sum, i) =>
        sum + (i.data.data.quantity || 1) * (i.data.data.encumbrance || 0),
      0
    );
    data.attributes.travelEncumbrance = Math.round(
      data.attributes.travelEncumbrance
    );

    const movementPenalty = Math.max(
      0,
      data.attributes.equippedEncumbrance - data.attributes.maximumEncumbrance
    );
    data.attributes.movementRate = 8 - movementPenalty; // TODO Humanoids only for now
    // @ts-ignore 0.7
    data.effects = [...this.effects].map((effect) => effect.data);
  }

  // Defaults when creating a new Actor
  static async create(data: any, options?: object): Promise<Entity> {
    data.token = data.token || {};
    if (data.type === "character") {
      mergeObject(
        data.token,
        {
          vision: true,
          dimSight: 30,
          brightSight: 0,
          actorLink: true,
          disposition: 1,
        },
        { overwrite: false }
      );
    }
    return await super.create(data, options);
  }
}
