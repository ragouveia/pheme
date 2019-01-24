export class CacheControl {

    constructor(public key: string,
        public value: string,
        public hash: string,
        private _accessCount: number = 0) {
    }

    get accessCount(): number {
        return this._accessCount;
    }

    public incrementAcessCount() {
        this._accessCount++;
    }
}
