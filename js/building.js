export default class Building {
    constructor(name, cost, gain, multiplier = 1.1) {
        this.name = name;
        this.cost = cost;
        this.gain = gain;
        this.multiplier = multiplier;
        this.element = document.getElementById(this.name);
        this.count = 0;

        buildings.set(this.name, this);

        this.attach();
    }

    attach() {
        this.element.addEventListener("click", () => {this.click()});
    }

    click() {
        if (totalBananas >= this.cost) {
            this.count++;
            totalBananas -= this.cost;
            this.cost *= this.multiplier;
        }
    }
}
