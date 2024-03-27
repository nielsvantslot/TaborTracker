class Generator {
  constructor(user) {
    this.user = user;
    this.fuel = 0;
    this.level = 0;
  }

  decreaseFuel(amount) {
    if (this.fuel > 0) {
      this.fuel -= amount;
      console.log(`${this.name} fuel decreased to ${this.fuel}`);
    } else {
      console.log(`${this.name} has run out of fuel`);
    }
  }
}
