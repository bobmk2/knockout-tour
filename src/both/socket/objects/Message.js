class Message {
  constructor({userName, tourType, text, pageUrl, pageTitle, createdAt}) {
    this.userName = userName;
    this.tourType = tourType;
    this.text = text;
    this.pageUrl = pageUrl;
    this.pageTitle = pageTitle;
    this.createdAt = createdAt;
  }

  isValid() {
    return (this.userName !== 'undefined' &&
        this.tourType !== 'undefined' &&
        this.text !== 'undefined' &&
        this.pageUrl !== 'undefined' &&
        this.pageTitle !== 'undefined' &&
        this.createdAt !== 'undefined'
    );
  }
}

module.exports = Message;
