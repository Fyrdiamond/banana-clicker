export default class BadgeRequirement {
    constructor(item, num_req) {
        this.item = item;
        this.num_req = num_req;
    }

    is_met() {
        if (this.item == "bananas") {
            return totalBananas >= this.num_req;
        }

        return buildings.get(this.item).count >= this.num_req;
    }
}
