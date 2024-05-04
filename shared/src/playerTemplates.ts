export class PlayerTemplate {
    constructor(public race: Record<number, string>) {}

    static empty(): PlayerTemplate {
        return new PlayerTemplate({});
    }

    static fromSerialized(serialized: Object): PlayerTemplate {
        return Object.assign(this.empty(), serialized);
    }
}
