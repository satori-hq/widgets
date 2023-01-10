export interface GraphDatum {
  accountId: string;
  blockHeight: number;
  value: {
    type: string;
    accountId: string;
  };
}

export interface Node {
  id: string;
  count: number;
}

export interface Link {
  source: string; // subject ("follower", "poker")
  target: string; // object ("followed", "poked")
  blockHeight: number;
}
