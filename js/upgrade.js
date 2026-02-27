export default class Upgrade {
    constructor(name, cost, boosts) {
        this.name = name
        this.cost = cost;
        this.boosts = boosts;
        this.element = document.getElementById(this.name);

        this.bought = false;

        upgrades.set(this.name, this);

        this.attach(this.element);
    }

    attach(element) {
        element.addEventListener("click", () => this.click());
    }

    click() {
        if (!this.bought && totalBananas >= this.cost) {
            totalBananas -= this.cost;
            this.bought = true;
            for (const boost of this.boosts) {
                if (!(boost.for == "mouse")) {
                    buildings.get(boost.for).gain *= boost.bonus;
                } else {
                    clickPower *= boost.bonus;
                }
            }
        }
    }
}
