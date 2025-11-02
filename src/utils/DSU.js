// src/utils/DSU.js

export default class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // path compression
    }
    return this.parent[x];
  }

  union(a, b) {
    a = this.find(a);
    b = this.find(b);
    if (a === b) return false; // already connected

    if (this.rank[a] < this.rank[b]) this.parent[a] = b;
    else if (this.rank[a] > this.rank[b]) this.parent[b] = a;
    else {
      this.parent[b] = a;
      this.rank[a]++;
    }

    return true;
  }
}
