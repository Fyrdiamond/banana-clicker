export default class Badge {
    constructor(name, requirement) {
        this.name = name;
        this.requirement = requirement;
        this.element = document.getElementById(name);
        this.unlocked = false;

        badges.set(this.name, this);
    }

    completed() {
        return this.requirement.is_met();
    }
}
