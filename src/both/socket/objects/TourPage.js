class TourPage {
  constructor({thumbnail, title, url, entry, commentCount = 0}) {
    this.thumbnail = thumbnail;
    this.title = title;
    this.url = url;
    this.entry = entry;
    this.commentCount = commentCount;
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
}

module.exports = TourPage;
