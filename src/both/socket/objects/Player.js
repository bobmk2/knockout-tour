class Player {
  constructor({id, name, tourType}) {
    this.id = id;
    this.name = name;
    this.tourType = tourType;
  }

  update({tourType}) {
    this.tourType = tourType;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      tourType: this.tourType
    }
  }
}

module.exports = Player;
