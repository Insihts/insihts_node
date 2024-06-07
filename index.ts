export interface InsihtsOptions {
  hostUrl?: string;
  websiteId?: string;
  sessionId?: string;
}

export interface InsihtsPayload {
  website: string;
  hostname?: string;
  language?: string;
  referrer?: string;
  screen?: string;
  title?: string;
  url?: string;
  name?: string;
  data?: {
    [key: string]: string | number | Date;
  };
}

export interface InsihtsEventData {
  [key: string]: string | number | Date;
}

export class Insihts {
  options: InsihtsOptions;
  properties: object;

  constructor(options = {}) {
    this.options = options;
    this.properties = {};
  }

  init(options: InsihtsOptions) {
    this.options = { ...this.options, ...options };
  }

  send(payload: InsihtsPayload, type: 'event' | 'identify' = 'event') {
    const hostUrl  = 'https://collector.insihts.com';

    return fetch(`${hostUrl}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `Mozilla/5.0 Node/${process.version}`,
      },
      body: JSON.stringify({ type, payload }),
    });
  }

  track(event: object | string, eventData?: InsihtsEventData) {
    const type = typeof event;
    const { websiteId } = this.options;

    switch (type) {
      case 'string':
        return this.send({
          website: websiteId,
          name: event as string,
          data: eventData,
        });
      case 'object':
        return this.send({ website: websiteId, ...(event as InsihtsPayload) });
    }

    return Promise.reject('Invalid payload.');
  }

  identify(properties: object = {}) {
    this.properties = { ...this.properties, ...properties };
    const { websiteId } = this.options;

    return this.send({ website: websiteId, data: { ...this.properties } }, 'identify');
  }

  reset() {
    this.properties = {};
  }
}

const insihts = new Insihts();

export default insihts;
