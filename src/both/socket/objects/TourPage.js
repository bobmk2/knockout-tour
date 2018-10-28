class TourPage {
  constructor({thumbnail, title, url, entry, startedAt, endedAt}) {
    this.thumbnail = thumbnail;
    this.title = title;
    this.url = url;
    this.entry = entry;
    this.startedAt = startedAt;
    this.endedAt = endedAt;
  }

  isValid() {
    return (
      typeof this.thumbnail !== 'undefined' &&
      typeof this.title !== 'undefined' &&
      typeof this.url !== 'undefined' &&
      typeof this.entry !== 'undefined'
    )
  }

  toJSON() {
    return {
      thumbnail: this.thumbnail,
      title: this.title,
      url: this.url,
      entry: this.entry
    }
  }

  toEmitData() {
    return {
      thumbnail: this.thumbnail,
      title: this.title,
      url: this.url,
      entry: this.entry,
      startedAt: this.startedAt,
      endedAt: this.endedAt
    }
  }
}

module.exports = TourPage;
