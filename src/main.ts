// Register the mod
// (which will make it show up in the list of mods on the mod screen in the main menu)
const recycleMachine = RegisterMod("recycleMachine", 1);
const recycleMachineId = Isaac.GetEntityVariantByName("Recycle machine");
const game = Game();
//TODO take other players into account lol
const player = Game().GetPlayer(0);
const nbOfItems = Isaac.GetItemConfig().GetCollectibles().Size;

function postUpdate(): void {
	let room = game.GetRoom();
	let entities = room.GetEntities();
	let recycleMachineInstance = null;

	for (let index = 0; index < entities.Size; index++) {
		const element = entities.Get(index);
		if (element && (element.Type != EntityType.ENTITY_PLAYER && element.Type != EntityType.ENTITY_EFFECT)) {

			//294 is defined in the entities2.xml
			if (element.Type == EntityType.ENTITY_SLOT && element.Variant == 294)
				recycleMachineInstance = element;
		}

		if (recycleMachineInstance != null && player != null) {
			let c: Vector = recycleMachineInstance.Position;

			// c.X = recycleMachineInstance.Position.X;
			// c.Y = recycleMachineInstance.Position.Y;

			c.X = recycleMachineInstance.Position.X - player.Position.X;
			c.Y = recycleMachineInstance.Position.Y - player.Position.Y;


			// player collides with the machine
			if (c.Length() < recycleMachineInstance.Size + player.Size) {
				let ownedItems: CollectibleType[] = [];

				for (let index = 0; index < nbOfItems; index++) {

					if (player.HasCollectible(index, true)) {
						//TODO check for item copies
						ownedItems.push(index);
					}

					if (ownedItems != null && ownedItems.length > 0) {
						let itemToRemove = Math.floor(Math.random() * ((ownedItems.length -1) - 0 + 1)) + 0;
						Isaac.DebugString("item to remove" + itemToRemove);

						player.RemoveCollectible(ownedItems[itemToRemove]);
						player.Damage+= 5;
						Isaac.DebugString("removed stugff")
					}

				}

			}
		}

	}
}

recycleMachine.AddCallback(ModCallbacks.MC_POST_UPDATE, postUpdate);
