class TourPage {
  constructor({thumbnail, title, url, startedAt, endedAt}) {
    this.thumbnail = thumbnail;
    this.title = title;
    this.url = url;
    this.startedAt = startedAt;
    this.endedAt = endedAt;
  }
}

module.exports = TourPage;
