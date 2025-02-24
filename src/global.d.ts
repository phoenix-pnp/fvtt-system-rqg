import { RqgItem } from "./items/rqgItem";
import { RqgItemDataProperties, RqgItemDataSource } from "./data-model/item-data/itemTypes";
import { RqgActor } from "./actors/rqgActor";
import { RqgActorDataProperties, RqgActorDataSource } from "./data-model/actor-data/rqgActorData";
import { RqgConfig, systemId } from "./system/config";
import { RqgChatMessageFlags } from "./data-model/shared/rqgDocumentFlags";
import {
  RqgActorFlags,
  RqgItemFlags,
  RqgJournalEntryFlags,
  RqgRollTableFlags,
} from "./data-model/shared/rqgDocumentFlags";
import { IconSettingsData } from "./applications/defaultItemIconSettings";

declare global {
  interface DocumentClassConfig {
    Item: typeof RqgItem;
    Actor: typeof RqgActor;
  }
}

declare global {
  interface SourceConfig {
    Item: RqgItemDataSource;
    Actor: RqgActorDataSource;
  }
}

declare global {
  interface DataConfig {
    Item: RqgItemDataProperties;
    Actor: RqgActorDataProperties;
  }
}

declare global {
  interface FlagConfig {
    Item: { [systemId]?: RqgItemFlags };
    Actor: { [systemId]?: RqgActorFlags };
    JournalEntry: { [systemId]?: RqgJournalEntryFlags };
    RollTable: { [systemId]?: RqgRollTableFlags };
    ChatMessage: { [systemId]?: RqgChatMessageFlags };
  }
}

declare global {
  namespace ClientSettings {
    interface Values {
      "rqg.worldLanguage": string;
      "rqg.specialCrit": boolean;
      "rqg.fumbleRollTable": string;
      "rqg.worldMigrationVersion": string;
      "rqg.hitLocations": object;
      "rqg.sortHitLocationsLowToHigh": boolean;
      "rqg.magicRuneName": string;
      "rqg.defaultItemIconSettings": IconSettingsData;
      "rqg.actor-wizard-feature-flag": boolean;
    }
  }
}

declare global {
  interface CONFIG {
    RQG: RqgConfig;
  }
}

declare global {
  // foundry.utils
  function isEmpty(v: any): boolean;
}

declare global {
  interface TokenDocument {
    delta: any;
  }
}
